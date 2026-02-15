let timers = [];
let timerHistory = [];
let nextTimerId = 1;
let alarmAudioContext = null;
let oscillators = new Map();

// Load history from localStorage
function loadHistory() {
    const saved = localStorage.getItem('timerHistory');
    if (saved) {
        timerHistory = JSON.parse(saved);
        renderHistory();
    }
}

function saveHistory() {
    localStorage.setItem('timerHistory', JSON.stringify(timerHistory));
}

function addToHistory(hours, minutes, seconds) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const entry = { hours, minutes, seconds, totalSeconds };

    // Remove if already exists
    timerHistory = timerHistory.filter(h => h.totalSeconds !== totalSeconds);

    // Add to front
    timerHistory.unshift(entry);

    // Keep only last 6
    timerHistory = timerHistory.slice(0, 6);

    saveHistory();
    renderHistory();
}

function renderHistory() {
    const historyEl = document.getElementById('history');
    const historyGrid = document.getElementById('historyGrid');

    if (timerHistory.length === 0) {
        historyEl.style.display = 'none';
        return;
    }

    historyEl.style.display = 'block';
    historyGrid.innerHTML = timerHistory.map(h => {
        const timeStr = formatTime(h.hours, h.minutes, h.seconds);
        const label = formatDuration(h.hours, h.minutes, h.seconds);
        return `
            <div class="history-item" onclick="quickStart(${h.hours}, ${h.minutes}, ${h.seconds})">
                <div class="history-item-time">${timeStr}</div>
                <div class="history-item-label">Quick Start</div>
            </div>
        `;
    }).join('');
}

function quickStart(hours, minutes, seconds) {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    const timer = {
        id: nextTimerId++,
        originalDuration: totalSeconds,
        originalHours: hours,
        originalMinutes: minutes,
        originalSeconds: seconds,
        remainingSeconds: totalSeconds,
        startTime: new Date(),
        isOvertime: false,
        overtimeSeconds: 0,
        alarmPlaying: false,
        interval: null
    };

    timers.push(timer);
    renderTimers();
    startTimer(timer);

    // Move to top of history
    addToHistory(hours, minutes, seconds);
}

function formatDuration(h, m, s) {
    const parts = [];
    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);
    return parts.join(' ');
}

function createTimer() {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes').value) || 0;
    const seconds = parseInt(document.getElementById('seconds').value) || 0;

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds === 0) {
        alert('Please set a time greater than 0');
        return;
    }

    addToHistory(hours, minutes, seconds);

    const timer = {
        id: nextTimerId++,
        originalDuration: totalSeconds,
        originalHours: hours,
        originalMinutes: minutes,
        originalSeconds: seconds,
        remainingSeconds: totalSeconds,
        startTime: new Date(),
        isOvertime: false,
        overtimeSeconds: 0,
        alarmPlaying: false,
        interval: null
    };

    timers.push(timer);
    renderTimers();
    startTimer(timer);
}

function startTimer(timer) {
    timer.interval = setInterval(() => {
        if (!timer.isOvertime) {
            timer.remainingSeconds--;

            if (timer.remainingSeconds <= 0) {
                timer.isOvertime = true;
                timer.remainingSeconds = 0;
                timer.overtimeSeconds = 0;
                playAlarm(timer.id);
                renderTimers(); // Full re-render when switching to overtime
            } else {
                updateTimerDisplay(timer); // Just update display
            }
        } else {
            timer.overtimeSeconds++;
            updateTimerDisplay(timer); // Just update display
        }
    }, 1000);
}

function playAlarm(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    timer.alarmPlaying = true;

    // Initialize audio context on first use
    if (!alarmAudioContext) {
        alarmAudioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Create oscillator for this timer
    const oscillator = alarmAudioContext.createOscillator();
    const gainNode = alarmAudioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(alarmAudioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    // Beep pattern
    let isBeeping = true;
    gainNode.gain.value = 0.3;

    const beepInterval = setInterval(() => {
        if (!timer.alarmPlaying) {
            clearInterval(beepInterval);
            return;
        }
        isBeeping = !isBeeping;
        gainNode.gain.value = isBeeping ? 0.3 : 0;
    }, 400);

    oscillator.start();
    oscillators.set(timerId, { oscillator, gainNode, beepInterval });
}

function silenceAlarm(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    timer.alarmPlaying = false;

    const osc = oscillators.get(timerId);
    if (osc) {
        clearInterval(osc.beepInterval);
        try {
            osc.oscillator.stop();
        } catch (e) {}
        oscillators.delete(timerId);
    }

    renderTimers();
}

function stopTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    clearInterval(timer.interval);
    silenceAlarm(timerId);

    // Show summary
    showSummary(timer);

    // Remove timer
    timers = timers.filter(t => t.id !== timerId);
    renderTimers();
}

function showSummary(timer) {
    const endTime = new Date();
    const totalElapsed = Math.floor((endTime - timer.startTime) / 1000);

    const summaryHTML = `
        <div class="summary-item">
            <span class="summary-label">Original Timer</span>
            <span class="summary-value">${formatTime(timer.originalHours, timer.originalMinutes, timer.originalSeconds)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Started At</span>
            <span class="summary-value">${formatTimeOfDay(timer.startTime)}</span>
        </div>
        <div class="summary-item">
            <span class="summary-label">Ended At</span>
            <span class="summary-value">${formatTimeOfDay(endTime)}</span>
        </div>
        ${timer.isOvertime ? `
        <div class="summary-item">
            <span class="summary-label">Overtime</span>
            <span class="summary-value" style="color: var(--danger)">+${formatTimeFromSeconds(timer.overtimeSeconds)}</span>
        </div>` : ''}
        <div class="summary-item">
            <span class="summary-label">Total Time</span>
            <span class="summary-value">${formatTimeFromSeconds(totalElapsed)}</span>
        </div>
    `;

    document.getElementById('summaryContent').innerHTML = summaryHTML;
    document.getElementById('summaryModal').classList.add('active');
}

function closeSummary() {
    document.getElementById('summaryModal').classList.remove('active');
}

function formatTime(h, m, s) {
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function formatTimeFromSeconds(totalSec) {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return formatTime(h, m, s);
}

function formatTimeOfDay(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function drawProgressRing(percentage, isOvertime, timerId) {
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const strokeColor = isOvertime ? '#EF4444' : '#818CF8';
    const bgColor = '#334155';

    return `
        <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
                cx="100"
                cy="100"
                r="${radius}"
                stroke="${bgColor}"
                stroke-width="12"
                fill="none"
            />
            <circle
                id="progress-circle-${timerId}"
                class="progress-ring-circle"
                cx="100"
                cy="100"
                r="${radius}"
                stroke="${strokeColor}"
                stroke-width="12"
                fill="none"
                stroke-dasharray="${circumference}"
                stroke-dashoffset="${offset}"
                stroke-linecap="round"
            />
        </svg>
    `;
}

function updateTimerDisplay(timer) {
    const timeEl = document.getElementById(`timer-time-${timer.id}`);
    const progressCircle = document.getElementById(`progress-circle-${timer.id}`);

    if (!timeEl || !progressCircle) {
        console.log('Elements not found, doing full render');
        renderTimers();
        return;
    }

    let displayTime, progressPercentage;
    if (timer.isOvertime) {
        displayTime = '+' + formatTimeFromSeconds(timer.overtimeSeconds);
        progressPercentage = 100;
    } else {
        displayTime = formatTimeFromSeconds(timer.remainingSeconds);
        progressPercentage = (timer.remainingSeconds / timer.originalDuration) * 100;
    }

    // Update time text
    timeEl.textContent = displayTime;

    // Update progress ring
    const radius = 85;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (progressPercentage / 100) * circumference;
    progressCircle.setAttribute('stroke-dashoffset', offset);
}

function restartTimer(timerId) {
    const timer = timers.find(t => t.id === timerId);
    if (!timer) return;

    quickStart(timer.originalHours, timer.originalMinutes, timer.originalSeconds);
}

function renderTimers() {
    const container = document.getElementById('timers');

    if (timers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⏱️</div>
                <div class="empty-state-text">Create your first timer to get started</div>
            </div>
        `;
        return;
    }

    container.innerHTML = timers.map(timer => {
        const icon = timer.isOvertime ? '🔴' : '⏱';
        const originalLabel = formatDuration(timer.originalHours, timer.originalMinutes, timer.originalSeconds);

        let displayTime, label, progressPercentage;
        if (timer.isOvertime) {
            displayTime = '+' + formatTimeFromSeconds(timer.overtimeSeconds);
            label = 'overtime';
            progressPercentage = 100; // Full circle in overtime
        } else {
            displayTime = formatTimeFromSeconds(timer.remainingSeconds);
            label = '';
            progressPercentage = (timer.remainingSeconds / timer.originalDuration) * 100;
        }

        const overtimeClass = timer.isOvertime ? 'overtime' : '';
        const progressRing = drawProgressRing(progressPercentage, timer.isOvertime, timer.id);

        const controls = timer.isOvertime
            ? `
                ${timer.alarmPlaying
                    ? `<button class="btn btn-secondary btn-small" onclick="silenceAlarm(${timer.id})">🔇 Silence</button>`
                    : ''}
                <button class="btn btn-danger btn-small" onclick="stopTimer(${timer.id})">Stop</button>
            `
            : `
                <button class="btn btn-secondary btn-small" onclick="restartTimer(${timer.id})">↻ Restart</button>
                <button class="btn btn-danger btn-small" onclick="stopTimer(${timer.id})">Stop</button>
            `;

        return `
            <div class="timer-card ${overtimeClass}" id="timer-card-${timer.id}">
                <div class="timer-header">
                    <span class="timer-icon">${icon}</span>
                    <span>${originalLabel} timer</span>
                </div>
                <div class="timer-display">
                    <div class="progress-ring">
                        ${progressRing}
                        <div class="timer-time" id="timer-time-${timer.id}">${displayTime}</div>
                    </div>
                    ${label ? `<div class="timer-label">${label}</div>` : ''}
                </div>
                <div class="timer-meta">Started at ${formatTimeOfDay(timer.startTime)}</div>
                <div class="timer-controls">
                    ${controls}
                </div>
            </div>
        `;
    }).join('');
}

// Initialize
loadHistory();
renderTimers();

// Close modal on background click
document.getElementById('summaryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeSummary();
    }
});

// Allow Enter key to create timer
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !document.getElementById('summaryModal').classList.contains('active')) {
        createTimer();
    }
});

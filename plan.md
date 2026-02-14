# OverTimer — A Timer That Keeps Counting

## The Problem

Apple's built-in timer does one thing: count down to zero, ring an alarm, and stop. But in real life, time doesn't stop when the alarm goes off. Meetings run over. Workouts go long. Cooking keeps going. You're left wondering *"how far past the timer am I?"* with no answer unless you mentally track it yourself.

There is no native way to see how much you've overrun your intended time.

## The Idea

**OverTimer** is a countdown timer with a twist: when it hits zero, the alarm sounds — but the clock doesn't stop. It flips into an **overtime counter**, tracking exactly how long you've gone past your target. The alarm keeps ringing until you deliberately dismiss it, and the overtime keeps ticking until you choose to stop.

## How It Works

1. **Set your time** — Pick the countdown duration (hours, minutes, seconds).
2. **Start the countdown** — The timer counts down to zero as expected.
3. **Zero is not the end** — When the countdown reaches `00:00:00`:
   - An alarm sound begins playing **on loop** until the user stops it.
   - The display switches to **overtime mode**, now counting *up* from zero (e.g., `+00:00:01`, `+00:00:02`, …).
   - The **original countdown duration** (e.g., "3:00 timer") remains visible on screen so you always know what you originally set.
4. **Dismiss the alarm** — The user can silence the alarm independently; the overtime counter keeps running.
5. **Stop when you're ready** — The user explicitly stops the session. A summary shows:
   - Original countdown duration
   - Exact timestamp the timer was started (e.g., "Started at 2:35 PM")
   - Total overtime elapsed
   - Total session time

## Key Features

| Feature | Description |
|---|---|
| **Countdown Timer** | Standard countdown from a user-defined duration |
| **Overtime Counter** | Automatically starts counting up once the countdown ends |
| **Original Duration Always Visible** | During overtime, the original set time stays on screen (e.g., "3:00 timer") so you never lose context |
| **Execution Timestamp** | Each timer records the exact time it was started |
| **Persistent Alarm** | Alarm loops continuously until manually dismissed by user |
| **Independent Controls** | Silence the alarm without stopping the overtime counter |
| **Session Summary** | See original duration, start time, overtime, and total elapsed time |
| **Visual State Change** | Clear UI shift (color, label) when transitioning from countdown to overtime |
| **Timer History** | Saves the last 6 timer durations you've used for quick reuse |
| **Multiple Simultaneous Timers** | Run several timers at the same time, each with full countdown → overtime functionality |

## Why This Matters

- **Meetings & Presentations** — Know exactly how much you've gone over your allotted time.
- **Cooking** — Timer went off but you're not ready yet? See how many extra minutes it's been.
- **Workouts** — Track how far you pushed past your planned interval.
- **Exams & Timed Tasks** — Understand your pacing by seeing the overrun.
- **General Awareness** — Any situation where knowing "how late am I?" is valuable.

## Multiple Simultaneous Timers

You can run **multiple timers at the same time**, each operating independently with the full feature set:

- Each timer has its own countdown, overtime counter, alarm, and dismiss controls.
- Timers are displayed in a list/grid — all visible at once, each clearly showing its current state.
- Starting a new timer never interferes with running timers.
- Each timer's alarm can be silenced independently without affecting the others.
- When a timer is stopped, its session summary is shown individually.

## Timer History & Quick Restart

- The app remembers the **last 6 timer durations** you've used.
- These appear as prominent, one-click buttons when creating a new timer, so you can instantly start a recent duration.
- History is ordered most-recent-first and automatically rotates — the oldest entry drops off when a 7th unique duration is used.
- Duplicate durations don't create new entries; they move the existing one to the top.
- **Quick restart button** — Each running timer has a restart button to immediately start a fresh timer with the same duration.
- Perfect for repeated tasks: workouts, cooking, pomodoro sessions, etc.

## Timer Display — What You See

**During countdown:**
```
┌─────────────────────────┐
│  ⏱  3:00 timer          │
│   ◯ Circular Progress   │  ← Visual ring showing time remaining
│     02:14               │
│  Started at 2:35 PM     │
│  [Stop]   [↻ Restart]   │
└─────────────────────────┘
```

**During overtime:**
```
┌─────────────────────────┐
│  🔴 3:00 timer          │
│   ◯ Full ring (red)     │  ← Progress ring full and pulsing
│    +00:00:42 overtime    │
│  Started at 2:35 PM     │
│  [Silence]    [Stop]    │
└─────────────────────────┘
```

The original duration and start timestamp are **always visible**, regardless of which phase the timer is in.

**Visual Progress Indicator:**
- Circular progress ring smoothly depletes as countdown progresses
- No flickering or jarring updates
- During overtime, ring fills with red and pulses to draw attention
- Provides at-a-glance understanding of timer state without reading numbers

## Design Principles

- **Simple by default** — Setting a timer should take seconds, not taps through menus.
- **Obvious state** — The user should always know at a glance: am I counting down or counting over?
- **Non-destructive** — Silencing the alarm should never kill the overtime counter.
- **Respectful** — No ads, no unnecessary permissions, no bloat.
- **Multi-timer first** — The UI is designed around having several timers running; one timer is just a special case.
- **Smooth visuals** — No jarring updates; use smooth circular progress indicators to show countdown at a glance.
- **Quick restart** — One-click to restart any timer from history, making repeated timing tasks effortless.

## What's Next

- Decide on platform and tech stack
- Wire up core timer logic (countdown → overtime transition)
- Design the UI states (countdown vs. overtime)
- Implement alarm audio with independent dismiss per timer
- Build session summary screen
- Implement timer history (persist last 6 durations)
- Build multi-timer management (add, list, independently control)
- Test edge cases (backgrounding, lock screen, notifications, overlapping alarms)

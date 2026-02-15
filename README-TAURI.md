# OverTimer - Tauri Desktop App

The timer that keeps counting when you go over - now as a native macOS desktop application!

## Features

- **Countdown Timer**: Set hours, minutes, and seconds for your timer
- **Overtime Counter**: Automatically switches to counting up when time expires
- **Persistent Alarm**: Loop alarm sound until you silence it
- **Multiple Timers**: Run several timers simultaneously
- **Visual Progress**: Circular progress ring shows time remaining
- **Timer History**: Quick-start from your last 6 used timer durations
- **Session Summary**: View detailed stats when stopping a timer

## Prerequisites

Before you can build and run the Tauri app, you need to install:

1. **Rust**: Required for Tauri
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Node.js and npm**: For managing dependencies
   - Download from [nodejs.org](https://nodejs.org/)

3. **Xcode Command Line Tools** (macOS):
   ```bash
   xcode-select --install
   ```

## Installation

1. Install npm dependencies:
   ```bash
   npm install
   ```

## Development

To run the app in development mode:

```bash
npm run dev
```

This will start the Tauri development server and open the app in a window.

## Building for Production

To create a production build:

```bash
npm run build
```

The built application will be in `src-tauri/target/release/bundle/`.

For macOS, you'll find:
- `OverTimer.app` - The application bundle in `src-tauri/target/release/bundle/macos/`
- `OverTimer.dmg` - Disk image installer in `src-tauri/target/release/bundle/dmg/`

## Project Structure

```
timer-app/
├── src/                    # Frontend source files
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Application styles
│   └── app.js            # JavaScript logic
├── src-tauri/             # Tauri/Rust backend
│   ├── src/
│   │   └── main.rs       # Rust main entry point
│   ├── icons/            # Application icons
│   ├── Cargo.toml        # Rust dependencies
│   ├── tauri.conf.json   # Tauri configuration
│   └── build.rs          # Build script
├── package.json           # Node.js dependencies
└── README-TAURI.md       # This file
```

## Notes

- The app uses localStorage for persisting timer history
- Web Audio API is used for alarm sounds
- All timers run independently with their own intervals

## Troubleshooting

### Icons Missing

If you see errors about missing icons during build, you'll need to generate proper icon files. You can:

1. Use the Tauri icon generator:
   ```bash
   npm install @tauri-apps/cli
   npx tauri icon path/to/your/icon.png
   ```

2. Or manually place icon files in `src-tauri/icons/`:
   - 32x32.png
   - 128x128.png
   - 128x128@2x.png
   - icon.icns (macOS)
   - icon.ico (Windows)

### Rust Not Found

Make sure Rust is installed and in your PATH:
```bash
rustc --version
cargo --version
```

If not found, restart your terminal after installing Rust.

## Original Web Version

The original web version is still available in `index.html` at the project root.

## License

This project is open source and available under the MIT License.

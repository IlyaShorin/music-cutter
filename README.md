# Music Cutter

[![English](https://img.shields.io/badge/lang-English-blue)](README.md)
[![Russian](https://img.shields.io/badge/lang-Russian-red)](README.ru.md)

A desktop application for cutting fragments from MP3 audio files.

## Installation

### macOS

After downloading the `.dmg` file, you may see the message "The application is damaged and can't be opened".

**Method 1:** Right-click the application, choose "Open", then click "Open" in the dialog.

**Method 2:** Run this command in the terminal:

```bash
xattr -cr /Applications/Music\ Cutter.app
```

This happens because the application is not signed with an Apple Developer certificate.

### Windows

Download and run the `.exe` or `.msi` installer.

## Tech Stack

- **Backend:** Rust + Tauri 2.x
- **Frontend:** React 19 + TypeScript + Vite + Chakra UI
- **Audio processing:** FFmpeg

## Development

```bash
npm run tauri dev
```

## Build

```bash
npm run tauri build
```

## IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# Changelog

## [1.1.0] - 2025-01-08

### Added
- **FFmpeg auto-install** — app now checks for FFmpeg on startup and offers to download it automatically
- Download progress indicator for FFmpeg installation
- FFmpeg status detection (system or bundled)
- Cross-platform support (macOS and Windows)

### Changed
- App size remains ~12MB (FFmpeg downloaded on-demand, ~90MB)
- Improved error handling for missing FFmpeg

### Technical
- Refactored FFmpeg services into modular structure
- Added React Context for FFmpeg state management
- Added Tauri commands for FFmpeg status and installation

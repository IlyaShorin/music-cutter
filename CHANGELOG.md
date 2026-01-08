# Unreleased

## [1.4.4](https://github.com/IlyaShorin/music-cutter/compare/v1.4.3...v1.4.4) (2026-01-08)


### Bug Fixes

* set z.ai base url for claude code review workflow ([fb29f22](https://github.com/IlyaShorin/music-cutter/commit/fb29f22d77ee1a8051f997e46a8cc64706565b10))

# [1.4.0](https://github.com/IlyaShorin/music-cutter/compare/v1.3.0...v1.4.0) (2026-01-08)


### Bug Fixes

* add tauri build to release workflow ([d3547e0](https://github.com/IlyaShorin/music-cutter/commit/d3547e0b4702fa9d578cd483103358ffd66d08d8))


### Features

* add dark/light theme toggle ([0b86b38](https://github.com/IlyaShorin/music-cutter/commit/0b86b3875b0d90c210e1747d40932fdf0c39978a))
* add dark/light theme toggle ([2fe69c5](https://github.com/IlyaShorin/music-cutter/commit/2fe69c5c51d25ee09589d27832e73459586a2ca3))

# [1.3.0](https://github.com/IlyaShorin/music-cutter/compare/v1.2.0...v1.3.0) (2026-01-08)


### Features

* Add Claude Code GitHub Workflow ([03d4c5c](https://github.com/IlyaShorin/music-cutter/commit/03d4c5cc894725e092c2b0797743d67ba8d42c73))

# [1.2.0](https://github.com/IlyaShorin/music-cutter/compare/v1.1.0...v1.2.0) (2026-01-08)


### Features

* add automated release workflow with semantic-release ([c2a3377](https://github.com/IlyaShorin/music-cutter/commit/c2a3377882d88514c151b7c5638ca885e6cf7b35))

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

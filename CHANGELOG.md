## [1.4.4](https://github.com/IlyaShorin/music-cutter/compare/v1.4.3...v1.4.4) (2026-01-08)


### Bug Fixes

* add settings and debug mode to claude code review workflow ([0cf4b64](https://github.com/IlyaShorin/music-cutter/commit/0cf4b643787b82d9f1cd86a10336eb38610b3ab4))

## [1.4.3](https://github.com/IlyaShorin/music-cutter/compare/v1.4.2...v1.4.3) (2026-01-08)


### Bug Fixes

* disable mcp servers in ci for claude code review ([1584b8a](https://github.com/IlyaShorin/music-cutter/commit/1584b8a68444c435b01d06ed4b88ef64a31bce78))
* set z.ai base url and disable mcp servers in ci ([09eb640](https://github.com/IlyaShorin/music-cutter/commit/09eb6405e61f4a379821dd6cbec48f3c90057963))

## [1.4.2](https://github.com/IlyaShorin/music-cutter/compare/v1.4.1...v1.4.2) (2026-01-08)


### Bug Fixes

* use cross-platform path separators for Windows compatibility ([1892265](https://github.com/IlyaShorin/music-cutter/commit/189226585e0bb48212e9afcadaac2b9df5d52e1e))

## [1.4.1](https://github.com/IlyaShorin/music-cutter/compare/v1.4.0...v1.4.1) (2026-01-08)


### Bug Fixes

* add proper padding to FFmpeg dialog title ([ad17c71](https://github.com/IlyaShorin/music-cutter/commit/ad17c713cc54caf81aeb884911eb5ed156f3728b))

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

## [1.6.7](https://github.com/IlyaShorin/music-cutter/compare/v1.6.6...v1.6.7) (2026-01-15)


### Bug Fixes

* use separate script file for latest.json generation to avoid quote escaping issues ([c726189](https://github.com/IlyaShorin/music-cutter/commit/c726189cf12e5a0c7e95f2463555637eaebe1b24))

## [1.6.6](https://github.com/IlyaShorin/music-cutter/compare/v1.6.5...v1.6.6) (2026-01-15)


### Bug Fixes

* initialize updater plugin correctly via setup() ([3c52cff](https://github.com/IlyaShorin/music-cutter/commit/3c52cff9d1d10135a556d3a4a9642673c74e4f7f))

## [1.6.5](https://github.com/IlyaShorin/music-cutter/compare/v1.6.4...v1.6.5) (2026-01-15)


### Bug Fixes

* escape quotes in latest.json generation ([f6a0a10](https://github.com/IlyaShorin/music-cutter/commit/f6a0a10b57d986090d3aec538bec0bae759864f5))

## [1.6.4](https://github.com/IlyaShorin/music-cutter/compare/v1.6.3...v1.6.4) (2026-01-15)


### Bug Fixes

* rebuild v1.6.1 release with updater artifacts ([cd09f32](https://github.com/IlyaShorin/music-cutter/commit/cd09f32487d6504d273f6118c54f28af77474a73))

## [1.6.3](https://github.com/IlyaShorin/music-cutter/compare/v1.6.2...v1.6.3) (2026-01-15)


### Bug Fixes

* trigger rebuild for v1.6.1 with correct version ([dd0527a](https://github.com/IlyaShorin/music-cutter/commit/dd0527ac8e3130fcde68b87d6a23a02f793c050c))

## [1.6.2](https://github.com/IlyaShorin/music-cutter/compare/v1.6.1...v1.6.2) (2026-01-15)


### Bug Fixes

* add package.json to semantic-release replacements ([2ee480d](https://github.com/IlyaShorin/music-cutter/commit/2ee480dc398aba99e33e54f6b9925c441a54448d))

## [1.6.1](https://github.com/IlyaShorin/music-cutter/compare/v1.6.0...v1.6.1) (2026-01-15)


### Bug Fixes

* add missing getAppVersion command to exports ([80e87ef](https://github.com/IlyaShorin/music-cutter/commit/80e87ef012769e5834e766a37880b6d8c68f90f9))

# [1.6.0](https://github.com/IlyaShorin/music-cutter/compare/v1.5.0...v1.6.0) (2026-01-15)


### Features

* add auto-update functionality with Tauri updater ([2cfe85a](https://github.com/IlyaShorin/music-cutter/commit/2cfe85ad5611e049fc52b02d222d6f40cb29212f))

# [1.5.0](https://github.com/IlyaShorin/music-cutter/compare/v1.4.12...v1.5.0) (2026-01-08)


### Features

* **i18n:** complete i18n implementation ([9a0df37](https://github.com/IlyaShorin/music-cutter/commit/9a0df3737410da7b97bed960d01eb8d6150df157))

## [1.4.12](https://github.com/IlyaShorin/music-cutter/compare/v1.4.11...v1.4.12) (2026-01-08)


### Bug Fixes

* support HH:MM:SS timecode format in tracklist parser ([7dab1e7](https://github.com/IlyaShorin/music-cutter/commit/7dab1e7530e9dea8049ddb85e2a194db91ca3a06))

## [1.4.11](https://github.com/IlyaShorin/music-cutter/compare/v1.4.10...v1.4.11) (2026-01-08)


### Bug Fixes

* download both ffmpeg and ffprobe on macOS auto-install ([4bd476b](https://github.com/IlyaShorin/music-cutter/commit/4bd476bc46a085362fa397793f106fc475a76766))

## [1.4.10](https://github.com/IlyaShorin/music-cutter/compare/v1.4.9...v1.4.10) (2026-01-08)


### Bug Fixes

* detect system FFmpeg in Homebrew paths on macOS ([81d83c6](https://github.com/IlyaShorin/music-cutter/commit/81d83c6a06f6cfb3f26b11f937f5aeccbec541fd))

## [1.4.9](https://github.com/IlyaShorin/music-cutter/compare/v1.4.8...v1.4.9) (2026-01-08)


### Bug Fixes

* hide console window on Windows when running FFmpeg processes ([2506c74](https://github.com/IlyaShorin/music-cutter/commit/2506c74820a9bd1077c425e28836cdd25199478d))

## [1.4.9](https://github.com/IlyaShorin/music-cutter/compare/v1.4.8...v1.4.9) (2026-01-08)


### Bug Fixes

* hide console window on Windows when running FFmpeg processes ([aadd123](https://github.com/IlyaShorin/music-cutter/commit/aadd123))

## [1.4.8](https://github.com/IlyaShorin/music-cutter/compare/v1.4.7...v1.4.8) (2026-01-08)


### Bug Fixes

* remove invalid anthropic_model param ([b40d5db](https://github.com/IlyaShorin/music-cutter/commit/b40d5dbd2b03eb14e7b5c7131737da186d8a983a))

## [1.4.7](https://github.com/IlyaShorin/music-cutter/compare/v1.4.6...v1.4.7) (2026-01-08)


### Bug Fixes

* use sonnet model and remove settings from claude workflow ([be50b42](https://github.com/IlyaShorin/music-cutter/commit/be50b425aef245d43eb703c3b5944505e8d1df29))

## [1.4.6](https://github.com/IlyaShorin/music-cutter/compare/v1.4.5...v1.4.6) (2026-01-08)


### Bug Fixes

* simplify claude code review settings ([a04bc7e](https://github.com/IlyaShorin/music-cutter/commit/a04bc7eb0259e157ea804c640b41bd825bbe1bbd))

## [1.4.5](https://github.com/IlyaShorin/music-cutter/compare/v1.4.4...v1.4.5) (2026-01-08)


### Bug Fixes

* pass tagName to tauri-action for artifact uploads ([dc5ae34](https://github.com/IlyaShorin/music-cutter/commit/dc5ae34a9e4bf3bf77f9a9db69fcb67ff0fab34e))

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

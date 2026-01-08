use crate::types::{FFmpegSource, FFmpegStatus};
use crate::services::ffmpeg_manager::detect::{find_system_ffmpeg, validate_executable};
use std::path::PathBuf;

const FFMPEG_BIN: &str = "ffmpeg";
const FFPROBE_BIN: &str = "ffprobe";
const FFMPEG_EXE: &str = "ffmpeg.exe";
const FFPROBE_EXE: &str = "ffprobe.exe";

pub struct FFmpegPaths {
    pub ffmpeg_path: Option<String>,
    pub ffprobe_path: Option<String>,
    pub source: FFmpegSource,
}

pub fn check_status(
    configured_ffmpeg: Option<&String>,
    configured_source: &FFmpegSource,
) -> FFmpegStatus {
    if let Some(ffmpeg_path) = configured_ffmpeg {
        if validate_executable(PathBuf::from(ffmpeg_path)) {
            return FFmpegStatus {
                installed: true,
                source: configured_source.clone(),
            };
        }
    }

    if find_system_ffmpeg().is_some() {
        return FFmpegStatus {
            installed: true,
            source: FFmpegSource::System,
        };
    }

    FFmpegStatus {
        installed: false,
        source: FFmpegSource::Bundled,
    }
}

pub fn get_ffmpeg_path(configured_ffmpeg: Option<&String>) -> Result<String, String> {
    if let Some(path) = configured_ffmpeg {
        if validate_executable(PathBuf::from(path)) {
            return Ok(path.clone());
        }
    }

    if let Some((path, _)) = find_system_ffmpeg() {
        return Ok(path.to_str()
            .ok_or_else(|| "Invalid FFmpeg path".to_string())?.to_string());
    }

    Err("FFmpeg not found. Please install FFmpeg to use this application.".to_string())
}

pub fn get_ffprobe_path(configured_ffprobe: Option<&String>) -> Result<String, String> {
    if let Some(path) = configured_ffprobe {
        if validate_executable(PathBuf::from(path)) {
            return Ok(path.clone());
        }
    }

    if let Some((_, Some(probe_path))) = find_system_ffmpeg() {
        return Ok(probe_path.to_str()
            .ok_or_else(|| "Invalid ffprobe path".to_string())?.to_string());
    }

    Err("FFprobe not found. Please install FFmpeg to use this application.".to_string())
}

pub fn set_bundled_paths(ffmpeg_dir: PathBuf) -> Result<FFmpegPaths, String> {
    let ffmpeg_bin = if cfg!(target_os = "windows") {
        FFMPEG_EXE
    } else {
        FFMPEG_BIN
    };

    let ffprobe_bin = if cfg!(target_os = "windows") {
        FFPROBE_EXE
    } else {
        FFPROBE_BIN
    };

    let ffmpeg_path = ffmpeg_dir.join(ffmpeg_bin);
    let ffprobe_path = ffmpeg_dir.join(ffprobe_bin);

    if !ffmpeg_path.exists() {
        return Err(format!("FFmpeg not found at {}", ffmpeg_path.display()));
    }

    if !ffprobe_path.exists() {
        return Err(format!("FFprobe not found at {}", ffprobe_path.display()));
    }

    Ok(FFmpegPaths {
        ffmpeg_path: Some(
            ffmpeg_path.to_str()
                .ok_or_else(|| "Invalid FFmpeg path".to_string())?.to_string()
        ),
        ffprobe_path: Some(
            ffprobe_path.to_str()
                .ok_or_else(|| "Invalid ffprobe path".to_string())?.to_string()
        ),
        source: FFmpegSource::Bundled,
    })
}

use std::path::PathBuf;
use crate::services::ffmpeg::command::hidden_command;

const FFMPEG_BIN: &str = "ffmpeg";
const FFPROBE_BIN: &str = "ffprobe";
const FFMPEG_EXE: &str = "ffmpeg.exe";
const FFPROBE_EXE: &str = "ffprobe.exe";

#[cfg(target_os = "macos")]
const HOMEBREW_PATHS: &[&str] = &[
    "/opt/homebrew/bin",
    "/usr/local/bin",
    "/opt/homebrew/opt/ffmpeg/bin",
];

pub fn find_system_ffmpeg() -> Option<(PathBuf, Option<PathBuf>)> {
    if cfg!(target_os = "macos") {
        find_macos_ffmpeg()
    } else {
        find_generic_ffmpeg()
    }
}

#[cfg(target_os = "macos")]
fn find_macos_ffmpeg() -> Option<(PathBuf, Option<PathBuf>)> {
    for base in HOMEBREW_PATHS {
        let ffmpeg_path = PathBuf::from(base).join(FFMPEG_BIN);
        let ffprobe_path = PathBuf::from(base).join(FFPROBE_BIN);

        if ffmpeg_path.exists() && validate_executable(ffmpeg_path.clone()) {
            let ffprobe = if ffprobe_path.exists() && validate_executable(ffprobe_path.clone()) {
                Some(ffprobe_path)
            } else {
                find_command(FFPROBE_BIN)
            };
            return Some((ffmpeg_path, ffprobe));
        }
    }

    find_generic_ffmpeg()
}

#[cfg(not(target_os = "macos"))]
fn find_macos_ffmpeg() -> Option<(PathBuf, Option<PathBuf>)> {
    find_generic_ffmpeg()
}

fn find_generic_ffmpeg() -> Option<(PathBuf, Option<PathBuf>)> {
    let (ffmpeg_cmd, ffprobe_cmd) = if cfg!(target_os = "windows") {
        (FFMPEG_EXE, FFPROBE_EXE)
    } else {
        (FFMPEG_BIN, FFPROBE_BIN)
    };

    let ffmpeg_path = find_command(ffmpeg_cmd)?;
    let ffprobe_path = find_command(ffprobe_cmd);

    Some((ffmpeg_path, ffprobe_path))
}

fn find_command(cmd: &str) -> Option<PathBuf> {
    let result = if cfg!(target_os = "windows") {
        hidden_command("where").arg(cmd).output()
    } else {
        hidden_command("which").arg(cmd).output()
    }.ok()?;

    if result.status.success() {
        let path = String::from_utf8_lossy(&result.stdout).trim().to_string();
        Some(PathBuf::from(path))
    } else {
        None
    }
}

pub fn validate_executable(path: PathBuf) -> bool {
    if !path.exists() {
        return false;
    }

    let result = hidden_command(&path)
        .arg("-version")
        .output();

    match result {
        Ok(output) => output.status.success(),
        Err(_) => false,
    }
}

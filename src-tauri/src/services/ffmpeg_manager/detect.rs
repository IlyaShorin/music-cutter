use std::path::PathBuf;
use crate::services::ffmpeg::command::hidden_command;

const FFMPEG_BIN: &str = "ffmpeg";
const FFPROBE_BIN: &str = "ffprobe";
const FFMPEG_EXE: &str = "ffmpeg.exe";
const FFPROBE_EXE: &str = "ffprobe.exe";

pub fn find_system_ffmpeg() -> Option<(PathBuf, Option<PathBuf>)> {
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

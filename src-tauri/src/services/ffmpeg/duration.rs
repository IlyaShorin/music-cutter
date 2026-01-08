use crate::services::ffmpeg::ffprobe_path;
use crate::services::ffmpeg::command::hidden_command;
use std::path::Path;

pub fn get_audio_duration(file_path: &str) -> Result<u64, String> {
    let path = Path::new(file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    let ffprobe = ffprobe_path()?;
    let output = hidden_command(ffprobe)
        .arg("-v")
        .arg("error")
        .arg("-show_entries")
        .arg("format=duration")
        .arg("-of")
        .arg("default=noprint_wrappers=1:nokey=1")
        .arg("-err_detect")
        .arg("ignore_err")
        .arg("-fflags")
        .arg("+genpts+igndts")
        .arg("-avoid_negative_ts")
        .arg("make_zero")
        .arg(file_path)
        .output()
        .map_err(|e| format!("Failed to execute ffprobe: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("ffprobe failed: {}", stderr));
    }

    let duration_str = String::from_utf8_lossy(&output.stdout);
    let duration = duration_str
        .trim()
        .parse::<f64>()
        .map_err(|_| "Invalid duration value".to_string())?;

    Ok(duration as u64)
}

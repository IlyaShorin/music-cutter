use crate::services::time::Timecode;
use crate::types::AudioOutput;
use std::path::Path;
use std::process::Command;

pub fn cut_audio(
    input_path: &str,
    start: &Timecode,
    end: &Timecode,
    output_path: &str,
) -> Result<AudioOutput, String> {
    let input = Path::new(input_path);
    if !input.exists() {
        return Err(format!("Input file does not exist: {}", input_path));
    }

    let duration = start.duration_to(end);
    if duration == 0 {
        return Err("End time must be after start time".to_string());
    }

    let output = Path::new(output_path);
    if let Some(parent) = output.parent() {
        if !parent.exists() {
            return Err(format!("Output directory does not exist: {}", parent.display()));
        }
    }

    let result = Command::new("ffmpeg")
        .arg("-i")
        .arg(input_path)
        .arg("-ss")
        .arg(&start.to_string())
        .arg("-t")
        .arg(duration.to_string())
        .arg("-c:a")
        .arg("libmp3lame")
        .arg("-q:a")
        .arg("2")
        .arg("-y")
        .arg(output_path)
        .output()
        .map_err(|e| format!("Failed to execute ffmpeg: {}", e))?;

    if !result.status.success() {
        let stderr = String::from_utf8_lossy(&result.stderr);
        return Err(format!("FFmpeg failed: {}", stderr));
    }

    Ok(AudioOutput {
        output_path: output_path.to_string(),
        duration_seconds: duration,
    })
}

use crate::services::time::Timecode;
use crate::services::ffmpeg::ffmpeg_path;
use crate::services::ffmpeg::filter::build_afilter;
use std::process::Command;

pub fn cut_audio_internal(
    input_path: &str,
    start: &Timecode,
    duration: u64,
    output_path: &str,
    codec: &[&str],
    fade_in: bool,
    fade_out: bool,
) -> Result<(), String> {
    let has_filters = fade_in || fade_out;

    let ffmpeg = ffmpeg_path()?;
    let mut cmd = Command::new(ffmpeg);
    cmd.arg("-v").arg("error");

    if !has_filters {
        cmd.arg("-err_detect")
            .arg("ignore_err")
            .arg("-fflags")
            .arg("+genpts+igndts")
            .arg("-avoid_negative_ts")
            .arg("make_zero");
    }

    cmd.arg("-i")
        .arg(input_path)
        .arg("-ss")
        .arg(start.to_string())
        .arg("-t")
        .arg(duration.to_string());

    let afilter = build_afilter(fade_in, fade_out, duration);
    if !afilter.is_empty() {
        let parts: Vec<&str> = afilter.split(' ').collect();
        for part in parts {
            cmd.arg(part);
        }
    }

    for arg in codec {
        cmd.arg(arg);
    }

    cmd.arg("-y").arg(output_path);

    let result = cmd
        .output()
        .map_err(|e| format!("Failed to execute ffmpeg: {}", e))?;

    if !result.status.success() {
        let stderr = String::from_utf8_lossy(&result.stderr);
        return Err(format!("FFmpeg failed: {}", stderr));
    }

    Ok(())
}

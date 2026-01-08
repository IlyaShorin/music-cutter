use crate::services::time::Timecode;
use crate::types::AudioOutput;
use std::path::Path;
use std::process::Command;

fn build_afilter(fade_in: bool, fade_out: bool, duration: u64) -> String {
    const FADE_DURATION: u64 = 3;

    let mut filters = Vec::new();

    if fade_in {
        filters.push(format!("afade=in:d={}", FADE_DURATION));
    }

    if fade_out {
        let fade_start = duration.saturating_sub(FADE_DURATION);
        filters.push(format!("afade=out:st={}:d={}", fade_start, FADE_DURATION));
    }

    if filters.is_empty() {
        String::new()
    } else {
        format!("-af {}", filters.join(","))
    }
}

fn cut_audio_internal(
    input_path: &str,
    start: &Timecode,
    duration: u64,
    output_path: &str,
    codec: &[&str],
    fade_in: bool,
    fade_out: bool,
) -> Result<(), String> {
    let has_filters = fade_in || fade_out;

    let mut cmd = Command::new("ffmpeg");
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

pub fn cut_audio(
    input_path: &str,
    start: &Timecode,
    end: &Timecode,
    output_path: &str,
    fade_in: bool,
    fade_out: bool,
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

    let has_filters = fade_in || fade_out;

    if has_filters {
        let temp_dir = std::env::temp_dir();
        let temp_file = temp_dir.join(format!("music_cutter_temp_{}.mp3", std::process::id()));
        let temp_path = temp_file.to_str().ok_or_else(|| "Invalid temp directory path".to_string())?;

        let cut_result = cut_audio_internal(
            input_path,
            start,
            duration,
            temp_path,
            &["-c:a", "libmp3lame", "-b:a", "192k"],
            false,
            false,
        );

        if let Err(e) = cut_result {
            let _ = std::fs::remove_file(&temp_file);
            return Err(e);
        }

        let fade_result = cut_audio_internal(
            temp_path,
            &Timecode::zero(),
            duration,
            output_path,
            &["-c:a", "libmp3lame", "-b:a", "192k"],
            fade_in,
            fade_out,
        );

        let _ = std::fs::remove_file(&temp_file);

        if let Err(e) = fade_result {
            let _ = std::fs::remove_file(output_path);
            return Err(e);
        }
    } else {
        let codec = &["-c:a", "libmp3lame", "-q:a", "2"][..];
        let copy_codec = &["-c:a", "copy"];

        let result = cut_audio_internal(input_path, start, duration, output_path, codec, false, false);

        if result.is_err() {
            let _ = std::fs::remove_file(output_path);
            let fallback = cut_audio_internal(input_path, start, duration, output_path, copy_codec, false, false);
            fallback?;
        }
    }

    let output_check = Path::new(output_path);
    if let Ok(metadata) = std::fs::metadata(output_check) {
        if metadata.len() == 0 {
            let _ = std::fs::remove_file(output_path);
            return Err("Output file is empty - input file may be corrupted".to_string());
        }
    }

    Ok(AudioOutput {
        output_path: output_path.to_string(),
        duration_seconds: duration,
    })
}

pub fn get_audio_duration(file_path: &str) -> Result<u64, String> {
    let path = Path::new(file_path);
    if !path.exists() {
        return Err(format!("File does not exist: {}", file_path));
    }

    let output = Command::new("ffprobe")
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

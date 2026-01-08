use crate::services::time::Timecode;
use crate::services::ffmpeg::internal::cut_audio_internal;
use crate::types::AudioOutput;
use std::path::Path;

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

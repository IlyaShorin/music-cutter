use crate::services::{cut_audio, get_audio_duration, write_metadata, Timecode};
use crate::types::{BatchInput, BatchOutput, MetadataInput, SingleTrackInput, SingleTrackOutput, TrackResult};
use std::fs;

const FORBIDDEN_CHARS: &[char] = &['<', '>', ':', '"', '/', '\\', '|', '?', '*'];

fn sanitize_filename(name: &str) -> String {
    name.replace(FORBIDDEN_CHARS, "_")
}

fn write_track_metadata(
    output_path: String,
    title: String,
    artist: Option<String>,
    cover: Option<String>,
) -> Result<(), String> {
    write_metadata(&MetadataInput {
        file_path: output_path,
        title: Some(title),
        artist,
        cover_image_data: cover,
        album: None,
        album_artist: None,
        composer: None,
        genre: None,
        year: None,
        track_number: None,
        total_tracks: None,
        disc_number: None,
        total_discs: None,
        is_compilation: None,
        comment: None,
    })
}

fn format_seconds_as_hms(seconds: u64) -> String {
    let hours = seconds / 3600;
    let minutes = (seconds % 3600) / 60;
    let secs = seconds % 60;
    format!("{:02}:{:02}:{:02}", hours, minutes, secs)
}

#[tauri::command]
pub async fn cut_audio_batch(input: BatchInput) -> Result<BatchOutput, String> {
    fs::create_dir_all(&input.output_folder)
        .map_err(|e| format!("Failed to create output folder: {}", e))?;

    let file_duration = get_audio_duration(&input.file_path)?;
    let mut results = Vec::new();

    for track in &input.tracks {
        let start = Timecode::parse(&track.start_time)?;

        let end = if let Some(end_time) = track.end_time.as_deref() {
            Timecode::parse(end_time)?
        } else {
            Timecode::from_seconds(file_duration)
        };

        let duration = start.duration_to(&end);
        if duration == 0 {
            results.push(TrackResult {
                title: track.title.clone(),
                output_path: String::new(),
                duration_seconds: 0,
                success: false,
                error: Some("End time must be after start time".to_string()),
            });
            continue;
        }

        let safe_title = sanitize_filename(&track.title);
        let output_path = format!("{}/{}.mp3", input.output_folder, safe_title);

        let artist = track
            .artist
            .as_ref()
            .or(input.default_artist.as_ref())
            .cloned();
        let cover = track.cover_data.as_ref().cloned();
        let fade_in = track.fade_in.unwrap_or(false);
        let fade_out = track.fade_out.unwrap_or(false);

        let cut_result = cut_audio(&input.file_path, &start, &end, &output_path, fade_in, fade_out);

        let success = cut_result.is_ok();

        if success {
            if let Err(e) = write_track_metadata(output_path.clone(), track.title.clone(), artist.clone(), cover) {
                results.push(TrackResult {
                    title: track.title.clone(),
                    output_path,
                    duration_seconds: duration,
                    success: false,
                    error: Some(format!("Failed to write metadata: {}", e)),
                });
                continue;
            }
        }

        results.push(TrackResult {
            title: track.title.clone(),
            output_path,
            duration_seconds: duration,
            success,
            error: cut_result.err(),
        });
    }

    Ok(BatchOutput {
        output_folder: input.output_folder,
        tracks_processed: results.len(),
        tracks_total: input.tracks.len(),
        results,
    })
}

#[tauri::command]
pub async fn get_audio_duration_command(file_path: String) -> Result<String, String> {
    let duration = get_audio_duration(&file_path)?;
    Ok(format_seconds_as_hms(duration))
}

#[tauri::command]
pub async fn cut_single_track(input: SingleTrackInput) -> Result<SingleTrackOutput, String> {
    fs::create_dir_all(&input.output_folder)
        .map_err(|e| format!("Failed to create output folder: {}", e))?;

    let file_duration = if let Some(duration) = input.file_duration_seconds {
        duration
    } else {
        get_audio_duration(&input.file_path)?
    };

    let start = Timecode::parse(&input.track.start_time)?;

    let end = if let Some(end_time) = input.track.end_time.as_deref() {
        Timecode::parse(end_time)?
    } else {
        Timecode::from_seconds(file_duration)
    };

    let duration = start.duration_to(&end);
    if duration == 0 {
        return Ok(SingleTrackOutput {
            result: TrackResult {
                title: input.track.title,
                output_path: String::new(),
                duration_seconds: 0,
                success: false,
                error: Some("End time must be after start time".to_string()),
            },
        });
    }

    let safe_title = sanitize_filename(&input.track.title);
    let output_path = format!("{}/{}.mp3", input.output_folder, safe_title);

    let artist = input
        .track
        .artist
        .as_ref()
        .or(input.default_artist.as_ref())
        .cloned();
    let cover = input.track.cover_data.as_ref().cloned();
    let fade_in = input.track.fade_in.unwrap_or(false);
    let fade_out = input.track.fade_out.unwrap_or(false);

    let cut_result = cut_audio(&input.file_path, &start, &end, &output_path, fade_in, fade_out);

    let success = cut_result.is_ok();

    if success {
        if let Err(e) = write_track_metadata(
            output_path.clone(),
            input.track.title.clone(),
            artist.clone(),
            cover,
        ) {
            return Ok(SingleTrackOutput {
                result: TrackResult {
                    title: input.track.title,
                    output_path,
                    duration_seconds: duration,
                    success: false,
                    error: Some(format!("Failed to write metadata: {}", e)),
                },
            });
        }
    }

    Ok(SingleTrackOutput {
        result: TrackResult {
            title: input.track.title,
            output_path,
            duration_seconds: duration,
            success,
            error: cut_result.err(),
        },
    })
}

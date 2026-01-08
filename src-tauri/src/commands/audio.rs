use crate::services::{cut_audio, write_metadata, Timecode};
use crate::types::{AudioInput, MetadataInput};

#[tauri::command]
pub async fn cut_audio_fragment(input: AudioInput) -> Result<crate::types::AudioOutput, String> {
    let start = Timecode::parse(&input.start_time)?;
    let end = Timecode::parse(&input.end_time)?;
    let fade_in = input.fade_in.unwrap_or(false);
    let fade_out = input.fade_out.unwrap_or(false);

    cut_audio(&input.file_path, &start, &end, &input.output_path, fade_in, fade_out)?;

    write_metadata(&MetadataInput {
        file_path: input.output_path.clone(),
        title: input.title,
        artist: input.artist,
        album: input.album,
        album_artist: input.album_artist,
        composer: input.composer,
        genre: input.genre,
        year: input.year,
        track_number: input.track_number,
        total_tracks: input.total_tracks,
        disc_number: input.disc_number,
        total_discs: input.total_discs,
        is_compilation: input.is_compilation,
        comment: input.comment,
        cover_image_data: input.cover_image_data,
    })?;

    Ok(crate::types::AudioOutput {
        output_path: input.output_path,
        duration_seconds: start.duration_to(&end),
    })
}

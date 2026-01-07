use crate::services::{cut_audio, Timecode};
use crate::types::AudioInput;

#[tauri::command]
pub async fn cut_audio_fragment(input: AudioInput) -> Result<crate::types::AudioOutput, String> {
    let start = Timecode::parse(&input.start_time)?;
    let end = Timecode::parse(&input.end_time)?;

    cut_audio(&input.file_path, &start, &end, &input.output_path)
}

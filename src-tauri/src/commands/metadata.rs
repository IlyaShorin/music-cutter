use crate::services::{read_metadata, write_metadata};
use crate::types::{MetadataInput, MetadataOutput};

#[tauri::command]
pub async fn get_audio_metadata(file_path: String) -> Result<MetadataOutput, String> {
    read_metadata(&file_path)
}

#[tauri::command]
pub async fn set_audio_metadata(input: MetadataInput) -> Result<(), String> {
    write_metadata(&input)
}

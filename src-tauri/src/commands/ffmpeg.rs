use crate::services::{download_and_install_ffmpeg, get_ffmpeg_status};
use crate::types::FFmpegStatus;
use tauri::Window;

#[tauri::command]
pub async fn check_ffmpeg_status() -> Result<FFmpegStatus, String> {
    Ok(get_ffmpeg_status())
}

#[tauri::command]
pub async fn download_and_install_ffmpeg_command(
    window: Window,
) -> Result<(), String> {
    download_and_install_ffmpeg(window).await
}

pub mod disk;
pub mod download;
pub mod extract;

use tauri::{Emitter, Window};
use crate::services::FFmpegManager;
use crate::services::ffmpeg_downloader::disk::check_disk_space;
use crate::services::ffmpeg_downloader::download::download_file;
use crate::services::ffmpeg_downloader::extract::extract_zip;

const FFMPEG_MACOS_URL: &str = "https://evermeet.cx/ffmpeg/getrelease/zip";
const FFPROBE_MACOS_URL: &str = "https://evermeet.cx/ffprobe/getrelease/zip";
const FFMPEG_WINDOWS_URL: &str = "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";

pub async fn download_and_install_ffmpeg(window: Window) -> Result<(), String> {
    let ffmpeg_dir = FFmpegManager::bundled_dir()?;

    check_disk_space(&ffmpeg_dir)?;

    std::fs::create_dir_all(&ffmpeg_dir)
        .map_err(|e| format!("Failed to create FFmpeg directory: {}", e))?;

    if cfg!(target_os = "macos") {
        download_macos_ffmpeg(&ffmpeg_dir, &window).await?;
    } else if cfg!(target_os = "windows") {
        download_windows_ffmpeg(&ffmpeg_dir, &window).await?;
    } else {
        return Err("Automatic FFmpeg download is only supported on macOS and Windows".to_string());
    }

    let mut manager = FFmpegManager::new()?;
    manager.set_bundled_paths(ffmpeg_dir)?;

    Ok(())
}

async fn download_macos_ffmpeg(ffmpeg_dir: &std::path::Path, window: &Window) -> Result<(), String> {
    let downloads = &[
        (FFMPEG_MACOS_URL, "ffmpeg.zip"),
        (FFPROBE_MACOS_URL, "ffprobe.zip"),
    ];

    for (i, (url, filename)) in downloads.iter().enumerate() {
        let zip_path = ffmpeg_dir.join(filename);
        let progress_offset = (i * 50) as u8;

        window.emit("ffmpeg-download-progress", serde_json::json!({
            "current": progress_offset,
            "total": 100,
            "percentage": progress_offset
        })).ok();

        let download_result = download_file(url, &zip_path, window).await;

        if download_result.is_err() {
            let _ = std::fs::remove_file(&zip_path);
            return download_result;
        }

        let extract_result = extract_zip(&zip_path, ffmpeg_dir);
        let _ = std::fs::remove_file(&zip_path);

        extract_result?;

        window.emit("ffmpeg-download-progress", serde_json::json!({
            "current": progress_offset + 50,
            "total": 100,
            "percentage": progress_offset + 50
        })).ok();
    }

    Ok(())
}

async fn download_windows_ffmpeg(ffmpeg_dir: &std::path::Path, window: &Window) -> Result<(), String> {
    let zip_path = ffmpeg_dir.join("ffmpeg.zip");

    window.emit("ffmpeg-download-progress", serde_json::json!({
        "current": 0,
        "total": 100,
        "percentage": 0
    })).ok();

    let download_result = download_file(FFMPEG_WINDOWS_URL, &zip_path, window).await;

    if download_result.is_err() {
        let _ = std::fs::remove_file(&zip_path);
        return download_result;
    }

    window.emit("ffmpeg-download-progress", serde_json::json!({
        "current": 100,
        "total": 100,
        "percentage": 100
    })).ok();

    let extract_result = extract_zip(&zip_path, ffmpeg_dir);
    let _ = std::fs::remove_file(&zip_path);

    extract_result?;

    Ok(())
}

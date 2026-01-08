use std::path::PathBuf;
use std::fs::File;
use std::io::Write;
use std::time::Duration;
use tauri::{Emitter, Window};
use reqwest::Client;

pub async fn download_file(url: &str, path: &PathBuf, window: &Window) -> Result<(), String> {
    let client = Client::builder()
        .timeout(Duration::from_secs(300))
        .build()
        .map_err(|e| format!("Failed to create HTTP client: {}", e))?;
    let response = client
        .get(url)
        .send()
        .await
        .map_err(|e| format!("Failed to initiate download: {}", e))?;

    let total = response
        .content_length()
        .ok_or("Failed to get content length")?;

    let mut file = File::create(path)
        .map_err(|e| format!("Failed to create file: {}", e))?;

    let mut current = 0;
    let mut stream = response.bytes_stream();

    use futures_util::StreamExt;
    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result
            .map_err(|e| format!("Failed to read chunk: {}", e))?;

        file.write_all(&chunk)
            .map_err(|e| format!("Failed to write chunk: {}", e))?;

        current += chunk.len() as u64;
        let percentage = ((current as f64 / total as f64) * 100.0) as u8;

        window.emit("ffmpeg-download-progress", serde_json::json!({
            "current": current,
            "total": total,
            "percentage": percentage
        })).ok();
    }

    Ok(())
}

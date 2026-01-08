use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FFmpegConfig {
    pub ffmpeg_path: Option<String>,
    pub ffprobe_path: Option<String>,
    pub source: FFmpegSource,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
pub enum FFmpegSource {
    System,
    Bundled,
}

#[derive(Debug, Clone, Serialize)]
pub struct FFmpegStatus {
    pub installed: bool,
    pub source: FFmpegSource,
}

#[derive(Debug, Clone, Serialize)]
#[allow(dead_code)]
pub struct DownloadProgress {
    pub current: u64,
    pub total: u64,
    pub percentage: u8,
}

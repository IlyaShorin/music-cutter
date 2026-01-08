pub mod command;
pub mod cut;
pub mod duration;
pub mod filter;
pub(crate) mod internal;

use crate::services::FFmpegManager;
use crate::types::FFmpegStatus;
use once_cell::sync::Lazy;
use std::sync::Mutex;

static FFMPEG_MANAGER: Lazy<Mutex<Option<FFmpegManager>>> = Lazy::new(|| Mutex::new(None));

pub fn get_ffmpeg_status() -> FFmpegStatus {
    let guard = FFMPEG_MANAGER.lock().ok();
    if let Some(Some(manager)) = guard.as_deref() {
        return manager.check_status();
    }

    let manager = FFmpegManager::new();
    match manager {
        Ok(m) => m.check_status(),
        Err(_) => FFmpegStatus {
            installed: false,
            source: crate::types::FFmpegSource::Bundled,
        },
    }
}

pub(crate) fn manager() -> Result<FFmpegManager, String> {
    let mut guard = FFMPEG_MANAGER
        .lock()
        .map_err(|e| format!("Manager lock failed: {}", e))?;

    if guard.is_none() {
        *guard = Some(FFmpegManager::new()?);
    }

    guard.as_ref()
        .cloned()
        .ok_or_else(|| "Manager unavailable".to_string())
}

pub(crate) fn ffmpeg_path() -> Result<String, String> {
    manager()?.get_ffmpeg_path()
}

pub(crate) fn ffprobe_path() -> Result<String, String> {
    manager()?.get_ffprobe_path()
}

pub use cut::cut_audio;
pub use duration::get_audio_duration;

pub mod detect;
pub mod paths;

use std::path::PathBuf;
use std::fs;
use std::env;
use dirs::home_dir;

use crate::types::FFmpegConfig;

const CONFIG_FILENAME: &str = "ffmpeg.json";
const APP_ID: &str = "com.ikshorin.music-cutter";

#[derive(Clone)]
pub struct FFmpegManager {
    config_path: PathBuf,
    pub config: FFmpegConfig,
}

impl FFmpegManager {
    pub fn new() -> Result<Self, String> {
        let config_dir = Self::config_dir()?;
        fs::create_dir_all(&config_dir)
            .map_err(|e| format!("Failed to create config directory: {}", e))?;

        let config_path = config_dir.join(CONFIG_FILENAME);
        let mut manager = Self {
            config_path,
            config: FFmpegConfig {
                ffmpeg_path: None,
                ffprobe_path: None,
                source: crate::types::FFmpegSource::Bundled,
            },
        };

        manager.load_config()?;
        Ok(manager)
    }

    pub fn config_dir() -> Result<PathBuf, String> {
        let base = if cfg!(target_os = "macos") {
            home_dir()
                .map(|h| h.join("Library").join("Application Support").join(APP_ID))
        } else if cfg!(target_os = "windows") {
            env::var("APPDATA")
                .ok()
                .map(|p| PathBuf::from(p).join(APP_ID))
        } else {
            home_dir()
                .map(|h| h.join(".config").join(APP_ID))
        };

        base.ok_or_else(|| "Failed to determine config directory".to_string())
    }

    pub fn bundled_dir() -> Result<PathBuf, String> {
        Self::config_dir().map(|dir| dir.join("ffmpeg"))
    }

    fn load_config(&mut self) -> Result<(), String> {
        if !self.config_path.exists() {
            return Ok(());
        }

        let content = fs::read_to_string(&self.config_path)
            .map_err(|e| format!("Failed to read config: {}", e))?;

        self.config = serde_json::from_str(&content)
            .map_err(|e| format!("Failed to parse config: {}", e))?;
        Ok(())
    }

    fn save_config(&self) -> Result<(), String> {
        let content = serde_json::to_string_pretty(&self.config)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;

        fs::write(&self.config_path, content)
            .map_err(|e| format!("Failed to write config: {}", e))?;
        Ok(())
    }

    pub fn check_status(&self) -> crate::types::FFmpegStatus {
        crate::services::ffmpeg_manager::paths::check_status(
            self.config.ffmpeg_path.as_ref(),
            &self.config.source,
        )
    }

    pub fn get_ffmpeg_path(&self) -> Result<String, String> {
        crate::services::ffmpeg_manager::paths::get_ffmpeg_path(self.config.ffmpeg_path.as_ref())
    }

    pub fn get_ffprobe_path(&self) -> Result<String, String> {
        crate::services::ffmpeg_manager::paths::get_ffprobe_path(self.config.ffprobe_path.as_ref())
    }

    pub fn set_bundled_paths(&mut self, ffmpeg_dir: PathBuf) -> Result<(), String> {
        let paths = crate::services::ffmpeg_manager::paths::set_bundled_paths(ffmpeg_dir)?;

        self.config.ffmpeg_path = paths.ffmpeg_path;
        self.config.ffprobe_path = paths.ffprobe_path;
        self.config.source = paths.source;

        self.save_config()?;
        Ok(())
    }
}

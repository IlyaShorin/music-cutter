pub mod ffmpeg;
pub mod ffmpeg_downloader;
pub mod ffmpeg_manager;
pub mod metadata;
pub mod time;

pub use ffmpeg::{cut_audio, get_audio_duration, get_ffmpeg_status};
pub use ffmpeg_downloader::download_and_install_ffmpeg;
pub use ffmpeg_manager::FFmpegManager;
pub use metadata::{read_metadata, write_metadata};
pub use time::Timecode;

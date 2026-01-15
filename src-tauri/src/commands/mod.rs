pub mod app;
pub mod audio;
pub mod batch;
pub mod ffmpeg;
pub mod file;
pub mod metadata;

pub use app::get_app_version;
pub use audio::cut_audio_fragment;
pub use batch::{cut_audio_batch, cut_single_track, get_audio_duration_command};
pub use ffmpeg::{check_ffmpeg_status, download_and_install_ffmpeg_command};
pub use file::{clear_output_folder, select_audio_file, select_output_file, select_output_folder, select_output_folder_as};
pub use metadata::{get_audio_metadata, set_audio_metadata};

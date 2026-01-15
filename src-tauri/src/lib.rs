mod commands;
mod services;
mod types;

use commands::{
    check_ffmpeg_status, clear_output_folder, cut_audio_fragment, cut_audio_batch, cut_single_track,
    download_and_install_ffmpeg_command, get_app_version, get_audio_duration_command, get_audio_metadata, select_audio_file, select_output_file,
    select_output_folder, select_output_folder_as, set_audio_metadata,
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            #[cfg(desktop)]
            app.handle().plugin(tauri_plugin_updater::Builder::new().build())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            select_audio_file,
            select_output_file,
            select_output_folder,
            select_output_folder_as,
            cut_audio_fragment,
            get_audio_metadata,
            set_audio_metadata,
            cut_audio_batch,
            cut_single_track,
            get_audio_duration_command,
            clear_output_folder,
            check_ffmpeg_status,
            download_and_install_ffmpeg_command,
            get_app_version,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

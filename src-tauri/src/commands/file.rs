use tauri_plugin_dialog::DialogExt;
use std::sync::mpsc;
use std::fs;
use std::path::Path;

#[tauri::command]
pub async fn select_audio_file(app: tauri::AppHandle) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    app.dialog()
        .file()
        .add_filter("Audio Files", &["mp3", "wav", "m4a", "aac"])
        .pick_file(move |file_path| {
            tx.send(file_path).ok();
        });

    let file_path = rx.recv().map_err(|e| e.to_string())?
        .ok_or_else(|| "No file selected".to_string())?;

    file_path
        .into_path()
        .map_err(|e| e.to_string())?
        .to_str()
        .map(String::from)
        .ok_or_else(|| "Invalid file path".to_string())
}

#[tauri::command]
pub async fn select_output_file(
    app: tauri::AppHandle,
    default_name: &str,
) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    app.dialog()
        .file()
        .add_filter("MP3 Audio", &["mp3"])
        .set_file_name(default_name)
        .save_file(move |file_path| {
            tx.send(file_path).ok();
        });

    let file_path = rx.recv().map_err(|e| e.to_string())?
        .ok_or_else(|| "No file selected".to_string())?;

    file_path
        .into_path()
        .map_err(|e| e.to_string())?
        .to_str()
        .map(String::from)
        .ok_or_else(|| "Invalid file path".to_string())
}

#[tauri::command]
pub async fn select_output_folder_as(
    app: tauri::AppHandle,
    default_name: &str,
) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    app.dialog()
        .file()
        .set_file_name(default_name)
        .save_file(move |file_path| {
            tx.send(file_path).ok();
        });

    let file_path = rx.recv().map_err(|e| e.to_string())?
        .ok_or_else(|| "No file selected".to_string())?;

    file_path
        .into_path()
        .map_err(|e| e.to_string())?
        .to_str()
        .map(String::from)
        .ok_or_else(|| "Invalid file path".to_string())
}

#[tauri::command]
pub async fn select_output_folder(app: tauri::AppHandle) -> Result<String, String> {
    let (tx, rx) = mpsc::channel();

    app.dialog()
        .file()
        .pick_folder(move |folder_path| {
            tx.send(folder_path).ok();
        });

    let folder_path = rx.recv().map_err(|e| e.to_string())?
        .ok_or_else(|| "No folder selected".to_string())?;

    folder_path
        .into_path()
        .map_err(|e| e.to_string())?
        .to_str()
        .map(String::from)
        .ok_or_else(|| "Invalid folder path".to_string())
}

#[tauri::command]
pub async fn clear_output_folder(path: String) -> Result<(), String> {
    if Path::new(&path).exists() {
        fs::remove_dir_all(&path)
            .map_err(|e| format!("Failed to clear output folder: {}", e))?;
    }
    fs::create_dir_all(&path)
        .map_err(|e| format!("Failed to create output folder: {}", e))?;
    Ok(())
}

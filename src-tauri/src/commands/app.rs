#[tauri::command]
pub async fn get_app_version(app: tauri::AppHandle) -> String {
    app.package_info().version.to_string()
}

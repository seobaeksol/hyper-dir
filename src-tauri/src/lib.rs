mod config;
mod fs;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            fs::read_directory,
            fs::create_directory,
            fs::remove_file_or_directory,
            fs::rename_file_or_directory,
            config::get_path_aliases,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

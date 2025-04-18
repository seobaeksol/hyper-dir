use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use tauri::command;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

#[command]
pub fn read_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let mut entries = vec![];

    let path_buf = PathBuf::from(path);
    let read = fs::read_dir(&path_buf).map_err(|e| e.to_string())?;

    for entry in read {
        if let Ok(entry) = entry {
            let metadata = entry.metadata().map_err(|e| e.to_string())?;
            entries.push(FileEntry {
                name: entry.file_name().to_string_lossy().to_string(),
                path: entry.path().to_string_lossy().to_string(),
                is_dir: metadata.is_dir(),
            });
        }
    }

    Ok(entries)
}

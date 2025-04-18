use serde::Serialize;
use std::fs;
use std::path::PathBuf;
use std::time::UNIX_EPOCH;
use tauri::command;

#[derive(Serialize)]
pub struct FileEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
    pub size: Option<u64>,
    pub modified: Option<u64>,
    pub file_type: String,
}

#[command]
pub fn read_directory(path: String) -> Result<Vec<FileEntry>, String> {
    let mut entries = vec![];
    let read = fs::read_dir(PathBuf::from(&path)).map_err(|e| e.to_string())?;

    for entry in read {
        if let Ok(entry) = entry {
            let metadata = entry.metadata().map_err(|e| e.to_string())?;
            let file_type = if metadata.is_dir() {
                "folder"
            } else if metadata.is_file() {
                "file"
            } else {
                "other"
            };

            let modified = metadata
                .modified()
                .ok()
                .and_then(|time| time.duration_since(UNIX_EPOCH).ok().map(|d| d.as_secs()));

            entries.push(FileEntry {
                name: entry.file_name().to_string_lossy().to_string(),
                path: entry.path().to_string_lossy().to_string(),
                is_dir: metadata.is_dir(),
                size: metadata.len().into(),
                modified,
                file_type: file_type.to_string(),
            });
        }
    }

    Ok(entries)
}

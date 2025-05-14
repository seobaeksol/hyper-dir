use std::collections::HashMap;
use std::fs;
use std::io::Write;
use std::path::PathBuf;

use tauri::command;
use toml::Value;

/// Returns the config file path depending on the OS.
pub fn get_config_path(app_name: &str) -> PathBuf {
    #[cfg(target_os = "windows")]
    {
        use std::env;
        let appdata = env::var("APPDATA").unwrap_or_else(|_| "C:\\Users\\Public".to_string());
        PathBuf::from(appdata).join(app_name).join("config.toml")
    }
    #[cfg(target_os = "macos")]
    {
        use std::env;
        let home = env::var("HOME").unwrap_or_else(|_| "/Users/Shared".to_string());
        PathBuf::from(home)
            .join("Library")
            .join("Application Support")
            .join(app_name)
            .join("config.toml")
    }
    #[cfg(not(any(target_os = "windows", target_os = "macos")))]
    {
        // Default: Linux or others
        use std::env;
        let home = env::var("HOME").unwrap_or_else(|_| "/tmp".to_string());
        PathBuf::from(home).join(format!(".{}-config.toml", app_name))
    }
}

/// Returns a default config TOML string with predefined path aliases.
pub fn default_config_toml(home: &str) -> String {
    let home = home.replace("\\", "/");
    format!(
        r#"[aliases]
home = "{home}"
documents = "{home}/Documents"
downloads = "{home}/Downloads"
desktop = "{home}/Desktop"
pictures = "{home}/Pictures"
music = "{home}/Music"
videos = "{home}/Videos"
"#,
        home = home
    )
}

pub type AliasMap = HashMap<String, String>;

pub fn ensure_and_read_config(app_name: &str) -> Result<AliasMap, String> {
    let config_path = get_config_path(app_name);
    // Get the home directory according to the current OS
    let home_dir = {
        #[cfg(target_os = "windows")]
        {
            // On Windows, use the USERPROFILE environment variable
            std::env::var("USERPROFILE").unwrap_or_else(|_| "C:\\Users\\Public".to_string())
        }
        #[cfg(target_os = "macos")]
        {
            // On macOS, use the HOME environment variable
            std::env::var("HOME").unwrap_or_else(|_| "/Users/Shared".to_string())
        }
        #[cfg(not(any(target_os = "windows", target_os = "macos")))]
        {
            // On Linux or other OS, use the HOME environment variable
            std::env::var("HOME").unwrap_or_else(|_| "/tmp".to_string())
        }
    };

    // If file does not exist, create it with default values
    if !config_path.exists() {
        let default = default_config_toml(&home_dir);
        if let Some(parent) = config_path.parent() {
            fs::create_dir_all(parent).map_err(|e| e.to_string())?;
        }
        let mut file = fs::File::create(&config_path).map_err(|e| e.to_string())?;
        file.write_all(default.as_bytes())
            .map_err(|e| e.to_string())?;
    }

    // Read and parse the config file
    let content = fs::read_to_string(&config_path).map_err(|e| e.to_string())?;
    let value: Value = toml::from_str(&content).map_err(|e| e.to_string())?;

    // Parse [aliases] section
    let mut aliases = AliasMap::new();
    if let Some(table) = value.get("aliases").and_then(|v| v.as_table()) {
        for (k, v) in table {
            if let Some(path) = v.as_str() {
                aliases.insert(k.clone(), path.to_string());
            }
        }
    }
    Ok(aliases)
}

#[command]
pub fn get_path_aliases(app_name: String) -> Result<AliasMap, String> {
    ensure_and_read_config(&app_name)
}

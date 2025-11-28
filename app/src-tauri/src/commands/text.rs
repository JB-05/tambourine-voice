use arboard::Clipboard;
use enigo::{Direction, Enigo, Key, Keyboard, Settings};
use std::thread;
use std::time::Duration;

const SERVER_URL: &str = "ws://127.0.0.1:8765";

#[tauri::command]
pub async fn get_server_url() -> String {
    SERVER_URL.to_string()
}

#[tauri::command]
pub async fn type_text(text: String) -> Result<(), String> {
    // Run keyboard operations in blocking thread
    tokio::task::spawn_blocking(move || type_text_blocking(&text))
        .await
        .map_err(|e| e.to_string())?
}

fn type_text_blocking(text: &str) -> Result<(), String> {
    let mut clipboard = Clipboard::new().map_err(|e| e.to_string())?;

    // Save previous clipboard content
    let previous = clipboard.get_text().unwrap_or_default();

    // Set new text
    clipboard.set_text(text).map_err(|e| e.to_string())?;

    // Small delay for clipboard to stabilize
    thread::sleep(Duration::from_millis(50));

    // Simulate Ctrl+V / Cmd+V
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;

    #[cfg(target_os = "macos")]
    let modifier = Key::Meta;
    #[cfg(not(target_os = "macos"))]
    let modifier = Key::Control;

    enigo
        .key(modifier, Direction::Press)
        .map_err(|e| e.to_string())?;
    thread::sleep(Duration::from_millis(50));
    enigo
        .key(Key::Unicode('v'), Direction::Click)
        .map_err(|e| e.to_string())?;
    thread::sleep(Duration::from_millis(50));
    enigo
        .key(modifier, Direction::Release)
        .map_err(|e| e.to_string())?;

    // Restore previous clipboard after a delay
    thread::sleep(Duration::from_millis(100));
    let _ = clipboard.set_text(&previous);

    Ok(())
}

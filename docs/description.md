# Hyper-Dir Project Description

**Hyper-Dir** is a productivity-focused, keyboard-first file explorer for Windows.
Built with **Tauri + Rust + React**, it aims to provide a fast, intuitive, and extensible file management experience for developers and power users.

## Key Features

- **Keyboard-centric workflow**  
  (Command palette, shortcuts, modal navigation)
- **Multi-panel, tabbed browsing**  
  (VSCode-like layout)
- **Powerful search**  
  (Fuzzy file/command search)
- **Extensible architecture**  
  (Planned plugin system for commands, panels, and more)
- **Native performance**  
  (Rust backend, React frontend, optimized for Windows)

## Technology Stack

| Area        | Tech Stack                        |
| ----------- | --------------------------------- |
| Frontend    | React, TypeScript, TailwindCSS    |
| Backend     | Rust, Tauri v2                    |
| State Mgmt  | Zustand                           |
| Tooling     | Bun, Vite                         |
| Target OS   | Windows (native app via Tauri)    |

## Project Structure (Summary)

```
src/
├── App.tsx, main.tsx, App.css         # App entry and mount
├── commands/                          # Commands for command palette
├── components/                        # UI components
│   └── layout/                        # Layout, panels, sidebar, etc.
├── hooks/                             # Custom React hooks
├── ipc/                               # Tauri IPC bindings
├── state/                             # Zustand state management
```

## Current Features

- Custom titlebar, statusbar, and panel layout
- Panel/tab-based navigation with keyboard shortcuts
- Command palette with dynamic command registration
- File listing and sorting per directory
- Sidebar with multiple panels (Explorer, Git, etc.)
- IPC setup between frontend and backend (Tauri)
- Rust-based file system operations (in progress)

## Essential File Explorer Features to Implement

- Drag & drop file/folder operations
- File/folder creation, renaming, and deletion
- File copy, cut, paste, and move between panels/tabs
- Context menus (right-click actions)
- File/folder property viewer (size, type, modified date, etc.)
- Directory tree navigation with expand/collapse
- File preview (text, image, etc.)
- Bulk selection and batch operations
- Undo/redo for file operations
- Integration with system clipboard
- Quick access (favorites, recent folders/files)
- Advanced search filters (by type, date, size)
- File/folder permission management (where applicable)
- Archive/compress/extract support (zip, etc.)
- Plugin system for custom actions and UI panels

## Roadmap / Future Plans

- Define and expand keybinding schema
- Expand command palette with context-aware actions
- Complete file operations and directory watchers (Rust side)
- Finalize plugin architecture (sidebar panels, commands)
- Improve focus management and keyboard routing
- Add more integrations (Git, terminal, cloud storage, etc.)

---

MIT © 2025 Hyper-Dir Contributors

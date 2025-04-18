# ⚡ Hyper-Dir

**Hyper-Dir** is a productivity-focused, keyboard-first file explorer replacement for Windows.  
It is designed for developers and power users who need speed, customizability, and powerful navigation.

---

## 🔥 Project Vision

Hyper-Dir delivers a fast, customizable, and keyboard-centric experience tailored for advanced users.  
Inspired by **Visual Studio Code**, **Ranger**, and **Midnight Commander**, it provides a modern UI and power features without mouse dependency.

---

## 🧠 Core Concepts

- ⌨️ **Keyboard-first interaction**: Navigate, search, and manage files with minimal mouse use.
- 🖥️ **Split view and tabs**: View and manage multiple directories side-by-side.
- 🔍 **Powerful fuzzy search**: Quickly find files, folders, and commands.
- 🧩 **Command palette**: A universal entry point for all operations.
- 🧬 **Plugin-friendly architecture**: Future-proof system with custom extensions and keybindings.
- 👩‍💻 **Developer-centric UX**: Designed to boost focus and reduce context switching.

---

## 💻 Technology Stack

| Layer            | Tech                                                |
| ---------------- | --------------------------------------------------- |
| **Frontend**     | React + TypeScript, TailwindCSS, Zustand, Vite, Bun |
| **Backend**      | Rust, Tauri v2, walkdir, notify                     |
| **IPC / Bridge** | Tauri commands, plugin-based messaging              |
| **Platform**     | Windows (native, transparent window support)        |

---

## 📦 Project Structure

```
hyper-dir/
├── src-tauri/                  # Rust backend (Tauri)
│   ├── fs/                     # Filesystem logic
│   ├── services/               # Background tasks, watchers, indexing
│   └── config/                 # App config and keybindings
├── frontend/
│   ├── src/
│   │   ├── components/         # UI components (panels, tabs, palette)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── state/              # Zustand global state
│   │   ├── utils/              # Fuzzy search, path, keyboard utils
│   │   └── layout/panel/       # Panel view-related components
│   └── public/                 # Static files, app icon, config
├── bun.config.ts               # Bun dev server config
└── tauri.conf.json             # Tauri app config
```

---

## 🚧 Current Progress

### ✅ Done

- Project architecture, vision, UI concept finalized
- Titlebar & basic layout scaffolded (VSCode style)
- Zustand-based global state management
- TailwindCSS + Bun + Vite environment configured
- Panel.tsx layout implemented
- File list rendering and basic sort logic
- CommandPalette component with basic toggle
- Icon and favicon assets created

### 🛠️ In Progress

- Panel sorting logic integration into fileStore
- Focus management between CommandPalette and Panels
- Sidebar structure and tree view (design phase)
- Tab management and multi-panel support
- Frontend ↔ Backend communication setup with Tauri v2
- Transparent window loading and splash screen control

---

## 🎯 Short-Term Goals

- [ ] Define complete UI wireframe
- [ ] Build MVP layout with split panels and tabs
- [ ] Implement fuzzy search module
- [ ] Design and finalize command palette logic
- [ ] Backend filesystem API (walkdir, notify)
- [ ] Keybinding schema and default shortcuts

---

## 🧠 Inspirations

- [Visual Studio Code](https://code.visualstudio.com/)
- [Ranger](https://github.com/ranger/ranger)
- [Midnight Commander](https://midnight-commander.org/)
- [Tauri](https://tauri.app/)
- [walkdir crate](https://docs.rs/walkdir)

---

## 🧑‍💻 For Contributors

We're building this as a productivity-enhancing tool for developers.  
If you enjoy working with Rust, Tauri, or keyboard-focused UIs, feel free to contribute!

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

---

## 📜 License

MIT © 2025 Hyper-Dir Contributors

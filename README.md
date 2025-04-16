# 🚀 Hyper-Dir

**Hyper-Dir** is a high-performance, keyboard-first file explorer replacement for Windows.  
Built with **Rust**, **React**, and **Tauri**, it empowers developers and power users with a split-view interface, fuzzy search, and extensibility—designed to replace traditional file explorers with something faster and more powerful.

---

## 🔥 Key Features

- ⚡ **Keyboard-First Interface**  
  Navigate, search, and manipulate files with blazing speed using keyboard shortcuts and a command palette.

- 🖥️ **Split View & Tabs**  
  Manage multiple directories in parallel—like your favorite code editors.

- 🔍 **Fuzzy Search**  
  Quickly find files, folders, and commands using smart, partial-match search.

- 🧩 **Extensible**  
  (Coming soon) Plugin-friendly architecture with configurable actions and keybindings.

- 💡 **Developer-Centric UX**  
  Inspired by tools like **VSCode**, **Ranger**, and **Midnight Commander**.

---

## 👤 Who It's For

- Developers and sysadmins tired of clunky Explorer workflows
- Keyboard-heavy users who want maximum speed and efficiency
- Power users managing deep directory trees or large codebases

---

## ⚙️ Tech Stack

| Layer      | Technology                                         |
| ---------- | -------------------------------------------------- |
| Backend    | Rust (`walkdir`, `notify`, `std::fs`, async tasks) |
| Frontend   | React + TypeScript                                 |
| IPC Bridge | Tauri or custom RPC                                |
| Runtime    | Bun (for serving React)                            |
| Platform   | Windows (native build)                             |

---

## 📦 Project Structure

```

hyper-dir/
├── src-tauri/ # Rust backend for FS ops, IPC, config
│ ├── fs/ # File traversal, actions, metadata
│ ├── services/ # Background tasks, watchers, caching
│ └── config/ # Keybindings, app state, user config
├── frontend/
│ ├── src/components/ # Panels, tabs, file list, command UI
│ ├── src/hooks/ # Keyboard input, state sync
│ ├── src/utils/ # Path parsing, fuzzy matchers, helpers
│ ├── src/state/ # Zustand or Redux store
│ └── public/ # Static assets
├── bun.config.ts # Bun runtime config
└── README.md

```

---

## 🛠️ Short-Term Roadmap

- [ ] UI Wireframe & Navigation Model
- [ ] MVP Layout (Split View + Tabs)
- [ ] React ↔ Rust Bridge via Tauri
- [ ] Fuzzy Search Engine
- [ ] Command Palette Logic
- [ ] Configurable Keybinding Schema

---

## 🧠 Inspiration & Credits

- [Visual Studio Code](https://code.visualstudio.com/)
- [Ranger (CLI file manager)](https://github.com/ranger/ranger)
- [Tauri](https://tauri.app/)
- [walkdir crate](https://docs.rs/walkdir)

---

## 📄 License

TBD – will be added as the project nears initial public release.

---

## 🤝 Contributions

Currently in early development – core contributors only.
Public contributions and plugin SDKs will be supported in a future milestone.

---

Made with ❤️ by developers who live in the terminal.

---

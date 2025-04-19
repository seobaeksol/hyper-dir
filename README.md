# ⚡ Hyper-Dir

**Hyper-Dir** is a productivity-focused, keyboard-first file explorer replacement for Windows.  
Built with **Tauri + Rust + React**, it is designed to enhance directory navigation for developers and power users who want speed, tabs, fuzzy search, and full keyboard control.

---

## 🔥 Vision

Hyper-Dir aims to minimize context switching by providing a fast and intuitive file manager that emphasizes:

- **Keyboard-first workflow** (command palette, shortcuts, modal navigation)
- **Multi-panel, tabbed browsing** (VSCode-like layout)
- **Powerful search** (fuzzy file/command search)
- **Customizable, extensible architecture** (plugin-friendly)

---

## 💻 Tech Stack

| Layer      | Technology                     |
| ---------- | ------------------------------ |
| Frontend   | React, TypeScript, TailwindCSS |
| Backend    | Rust, Tauri v2                 |
| State Mgmt | Zustand                        |
| Tooling    | Bun, Vite                      |
| OS Target  | Windows (native app via Tauri) |

---

## 📁 Project Structure

```
src/
├── App.tsx, main.tsx, App.css         # App entry and mount
│
├── commands/                          # Commands used by the command palette
│   ├── commandList.ts
│   └── registerDefaultCommands.ts
│
├── components/
│   ├── CommandPalette.tsx             # Command palette UI
│   └── layout/
│       ├── Titlebar.tsx               # Custom titlebar (VSCode style)
│       ├── Statusbar.tsx              # Bottom status bar
│       ├── Sidebar.tsx                # Layout for side tabs
│       │
│       ├── panel/                     # File browsing panel (main view)
│       │   ├── Panel.tsx              # Core panel layout
│       │   ├── PanelFileList.tsx      # File list display
│       │   ├── PanelHeader.tsx        # Current path + controls
│       │   ├── PanelItem.tsx          # Each file/folder row
│       │   ├── Tabbar.tsx             # Tabs per panel
│       │   ├── PanelWrapper.tsx       # Wrapper for tabbed panels
│       │   └── usePanelKeyboardNav.ts # Panel key navigation
│       │
│       └── sidebar/
│           ├── SidebarTab.tsx         # Top-level sidebar tab
│           └── panels/                # Sidebar tab content panels
│               ├── ExplorerPanel.tsx
│               ├── SearchPanel.tsx
│               ├── GitPanel.tsx
│               ├── StarredPanel.tsx
│               └── ConfigPanel.tsx
│
├── hooks/                             # React hooks
│   ├── useHotkeys.ts
│   └── useSidebarController.ts
│
├── ipc/                               # IPC bindings to Tauri commands
│   ├── commands.ts
│   └── fs.ts
│
└── state/                             # Zustand state management
    ├── actions.ts
    ├── commandStore.ts
    ├── fileStore.ts
    ├── panelStore.ts
    ├── uiStore.ts
    └── index.ts
```

---

## 🧠 Current Features

✅ Titlebar, Statusbar, Panel layout  
✅ Panel/tab-based navigation with keyboard shortcuts  
✅ Command palette with dynamic command registration  
✅ File listing and sorting per directory  
✅ Sidebar with multiple panels (Explorer, Git, etc.)  
✅ IPC setup between frontend and backend (Tauri)  
🛠️ In-progress: fuzzy search, multi-panel sync, plugin support

---

## 🎯 Short-Term Roadmap

- [ ] Fuzzy search for file names & commands
- [ ] Define and parse keybinding schema
- [ ] Expand Command Palette with context-aware actions
- [ ] File operations and directory watchers (Rust side)
- [ ] Plugin architecture (for sidebar panels, commands)
- [ ] Improve focus management and keyboard routing

---

## 🧑‍💻 Contributing

We welcome contributions from Rustaceans, frontend engineers, and productivity tool enthusiasts!

```bash
git checkout -b feat/<feature-name>
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit/message guidelines and branch strategy.

---

## 📜 License

MIT © 2025 Hyper-Dir Contributors

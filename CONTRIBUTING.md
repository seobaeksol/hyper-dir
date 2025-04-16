# 🤝 Contributing to Hyper-Dir

Welcome, and thank you for your interest in contributing to **Hyper-Dir** – a fast, keyboard-centric file explorer built with Rust + React + Tauri.

We’re building this tool for power users and developers who want a blazing-fast and extensible file management experience on Windows.

---

## 🧭 Contribution Overview

Hyper-Dir is currently in **early development**, and contributions are limited to core collaborators.  
Once we hit our first public milestone, we’ll open up issues, plugin APIs, and more for community contribution.

For now, here’s how to get involved or prepare to contribute:

---

## 🛠️ Tech Stack

| Area        | Tech Used                                  |
| ----------- | ------------------------------------------ |
| Backend     | Rust (`tauri`, `walkdir`, `notify`, async) |
| Frontend    | React, TypeScript, TailwindCSS             |
| Build Tools | Bun, Vite                                  |
| Platform    | Windows (native-first focus)               |

---

## 🔧 Local Setup

> Requirements: `bun`, `rust`, `cargo`, `pnpm` or `npm`, and `tauri-cli`

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/hyper-dir.git
cd hyper-dir
```

### 2. Install Frontend Dependencies

```bash
bun install
```

### 3. Install Rust + Tauri Dependencies

```bash
cargo install tauri-cli
```

### 4. Run Dev Mode

```bash
# from root
bun run dev
```

---

## 📁 Project Structure (Simplified)

```
hyper-dir/
├── frontend/           # React UI with split view, command palette
├── src-tauri/          # Rust backend: filesystem, IPC, services
├── bun.config.ts       # Bun + Vite setup
├── README.md
└── CONTRIBUTING.md
```

---

## ✅ Contributing Guidelines

- 🧹 **Code Style**

  - Use `rustfmt` and `clippy` for Rust code.
  - Use `eslint` and `prettier` for TypeScript.
  - Keep functions modular and testable.

- 🧪 **Testing**

  - All new logic should include tests or examples (unit or integration).
  - Avoid regressions—run existing test suites before PRs.

- 📦 **Commits**

  - Follow conventional commit format:
    - `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, etc.

- 📄 **PRs**
  - Keep PRs small and focused.
  - Describe changes clearly.
  - Link related issues if available.

---

## 🧩 Plugin Architecture (Upcoming)

Once the plugin SDK is defined, we’ll:

- Allow custom command registration
- Enable sidebar/tool integration
- Expose file system event APIs

We’ll publish developer docs and plugin examples when the system stabilizes.

---

## 💬 Communication

We're working in a private group during early stages.  
If you’re interested in joining early development or giving feedback:

- 📬 Contact: [your-email@example.com]
- 🐦 Follow updates on Twitter: [@hyperdirapp]

---

## 🧠 Inspiration

- VSCode, Ranger, Midnight Commander
- Speed, keyboard UX, and extensibility-first apps

---

Thank you for helping make file navigation better for power users 🙌

# 🗂️ Git Branching Strategy for Hyper-Dir

This document describes the branching strategy used for developing **Hyper-Dir**, a productivity-focused file explorer built with Rust + React + Tauri.

---

## 🔧 Overview

We adopt a **Trunk-based Development** approach with minimal long-lived branches. Feature work is organized using short-lived topic branches that merge into the `dev` branch, and stable releases are promoted to `main`.

---

## 🌳 Branch Structure

| Branch          | Description                                                          |
| --------------- | -------------------------------------------------------------------- |
| `main`          | Stable, production-ready releases. Tags (`vX.Y.Z`) are created here. |
| `dev`           | Integration branch for feature work. All new code merges here first. |
| `feat/*`        | Feature branches (e.g. `feat/command-palette`)                       |
| `fix/*`         | Bugfix branches (e.g. `fix/fuzzy-crash`)                             |
| `refactor/*`    | Refactoring or structure changes                                     |
| `release/x.y.z` | Temporary release stabilization branches                             |

---

## 🔁 Workflow

### 🧱 1. Creating a Feature

```bash
git checkout dev
git checkout -b feat/split-view-layout
```

After development and testing, submit a PR to `dev`.

---

### 🚀 2. Releasing a Version

```bash
git checkout dev
git checkout -b release/0.2.0
# Final fixes, QA, bump version
git checkout main
git merge release/0.2.0
git tag v0.2.0
git push origin main --tags
```

---

### 🛠 3. Hotfixes

Hotfixes are branched from `main` directly:

```bash
git checkout main
git checkout -b fix/panic-on-large-dir
# Fix, commit, test
git tag v0.2.1
git push origin main --tags
```

If needed, also cherry-pick or merge back into `dev`.

---

## ✅ Conventions

- All commits follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- Feature branches are prefixed with `feat/`, bugfixes with `fix/`, refactors with `refactor/`
- Pull Requests target `dev`, except for hotfixes

---

## 📦 CI/CD & Releases

- All PRs to `dev` and `main` are automatically tested via GitHub Actions
- Production builds are triggered from `main` tags

---

## 🧠 Summary

- Develop in `feat/*`, merge into `dev`
- Release via `release/x.y.z` → `main`
- Patch via `fix/*` from `main`
- Keep branches short-lived and descriptive

---

Happy hacking! 🦀⚛️

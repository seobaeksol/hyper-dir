### 1. Drag & Drop File/Folder Operations
- [ ] Frontend: Implement drag-and-drop UI (React DnD or HTML5 API)
- [ ] Backend: Implement file move/copy in Rust (Tauri)
- [ ] IPC: Expose file move/copy commands to frontend

### 2. File/Folder Creation, Renaming, Deletion
- [ ] Frontend: UI for create/rename/delete (context menu or buttons)
- [ ] Backend: Filesystem mutation functions in Rust
- [ ] IPC: Expose create/rename/delete via Tauri
- [ ] State: Update Zustand stores after mutation

### 3. File Copy, Cut, Paste, and Move Between Panels/Tabs
- [ ] Frontend: Clipboard logic (internal/system clipboard)
- [ ] Backend: File operations in Rust
- [ ] UI: Visual indicators for cut/copy state

### 4. Context Menus (Right-click Actions)
- [ ] Frontend: Implement a custom context menu component
- [ ] Backend: Hook menu actions to IPC commands

### 5. File/Folder Property Viewer
- [ ] Frontend: Modal or sidebar with file/folder info
- [ ] Backend: Rust returns stat info (size, type, modified date, etc.)

### 6. Directory Tree Navigation (Expand/Collapse)
- [ ] Frontend: Tree view component for sidebar
- [ ] State: Track expanded/collapsed state per folder

### 7. File Preview (Text, Image, etc.)
- [ ] Frontend: Modal or preview pane
- [ ] Backend: Read file content via IPC

### 8. Bulk Selection and Batch Operations
- [ ] Frontend: Shift/Ctrl+Click selection, batch action toolbar
- [ ] Backend: Accept multiple paths for operations

### 9. Undo/Redo for File Operations
- [ ] Frontend: Undo/redo stack in Zustand
- [ ] Backend: Track previous states, possibly use temporary storage for undo

### 10. Integration with System Clipboard
- [ ] Frontend: Use Tauri clipboard APIs
- [ ] Backend: Copy/paste files using system clipboard

### 11. Quick Access (Favorites, Recent)
- [ ] Frontend: Sidebar section for favorites/recent
- [ ] Backend: Track file/folder usage, persist in local storage

### 12. Advanced Search Filters
- [ ] Frontend: Search bar with filter options
- [ ] Backend: Rust-side search with filter support

### 13. File/Folder Permission Management
- [ ] Frontend: Permission dialog
- [ ] Backend: Rust exposes permission APIs (where supported)

### 14. Archive/Compress/Extract Support
- [ ] Frontend: Context menu/archive actions
- [ ] Backend: Use Rust crates for zip/tar

### 15. Plugin System for Custom Actions/UI Panels
- [ ] Architecture: Plugin API, dynamic loading, extension points for UI and commands

---

## To-do (Sidebar & Command Palette Enhancements)

- Implement drag-and-drop pinning in the Starred panel.
- Add undo/redo functionality for tab and file operations.
- Refine the command palette for enhanced UX.
- Review and test for edge cases or bugs in the sidebar and tab management.

---
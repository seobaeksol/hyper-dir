# 📐 Hyper-Dir Panel Manager Design

## 1. 🧭 Goals

The Panel Manager is a global controller responsible for creating, removing, and switching between multiple panels.  
Hyper-Dir supports one or more panels by default, and users can arrange them freely in a grid layout (up, down, left, right).

---

## 2. 📦 Panel Structure Overview

```ts
interface Panel {
  id: string;
  tabIds: string[];
  activeTabId: string;
  position: {
    row: number;
    column: number;
  };
}
```

Each Panel includes:

- Unique `id`
- Multiple `tabs`
- Currently active `tab` ID
- Grid layout position defined by `row` and `column`

---

## 3. 📚 State Definition (`panelStore`)

````ts
interface PanelStore {
  panels: Panel[];
  activePanelId: string;
  addPanel(position: { row: number; column: number }, initialDir?: string): void;
  removePanel(id: string): void;
  setActivePanel(id: string): void;
  getPanelById(id: string): Panel | undefined;
}
```ts
interface PanelStore {
  panels: Panel[];
  activePanelId: string;
  addPanel(position: { row: number; column: number }, initialDir?: string): void;
  removePanel(id: string): void;
  setActivePanel(id: string): void;
  getPanelById(id: string): Panel | undefined;
}
````

- Starts with a default panel at top-left
- State is managed using Zustand

---

## 3.1 📚 State Definition (`tabStore`)

```ts
interface Tab {
  id: string;
  panelId: string;
  currentDir: string;
  history: string[];
}

interface TabStore {
  tabs: Tab[];
  addTab(panelId: string, dir: string): void;
  removeTab(tabId: string): void;
  setActiveTab(panelId: string, tabId: string): void;
  getTabsByPanelId(panelId: string): Tab[];
  getActiveTab(panelId: string): Tab | undefined;
}
```

- Each panel references tab IDs
- TabStore centrally manages the actual tab data

## 4. ⚙️ Core Operations

### ➕ Add Panel (`addPanel`)

- Generate a new Panel ID
- Create a default tab initialized with the specified directory or home directory
- Place it in the Grid based on the provided `position`
- Handle conflicts if a panel already exists at that position

### ❌ Remove Panel (`removePanel`)

- Also removes its tabs and associated state
- Keeps at least one panel alive

### ✅ Set Active Panel (`setActivePanel`)

- Sets the active panel, which is used for keyboard focus and command execution

---

## 5. 🧠 Shortcut Design (Example)

| Key                | Action                                                         |
| ------------------ | -------------------------------------------------------------- |
| Ctrl + Alt + \     | Create a new panel (preferably below or to the right)          |
| Ctrl + Alt + Q     | Close the currently focused panel                              |
| Ctrl + Alt + ↑↓←→  | Move focus between adjacent panels                             |
| Ctrl + Alt + [1~9] | Switch to a specific panel by index (top-left to bottom-right) |

---

## 6. 🖼️ UI Structure

```tsx
<App>
 └─ PanelWrapper[] // Wraps each Panel and manages focus and position
      ├─ Panel ({row: 0, column: 0})
      ├─ Panel ({row: 0, column: 1})
      ├─ Panel ({row: 1, column: 0})
      └─ Panel ({row: 1, column: 1})
```

- `PanelWrapper` is dynamically rendered based on `panelStore`
- It manages both positioning and focus handling
- No separate `PanelGrid`; layout is handled within the wrapper itself

---

## 7. 🧩 Future Extensions

- Drag & drop panel position rearrangement
- Panel merging and splitting UI
- Save/load panel layout configuration
- Directional/ratio-based resizing support

---

## 8. 🧩 Actions (`panelActions.ts`)

Core actions are extracted to a separate module for maintainability and reuse:

### 🔁 Move Focus

```ts
export function moveFocusToPanel(direction: "up" | "down" | "left" | "right") {
  const state = get(panelStore);
  const current = state.panels.find((p) => p.id === state.activePanelId);
  if (!current) return;

  const target = state.panels.find((p) => {
    switch (direction) {
      case "up":
        return (
          p.position.column === current.position.column &&
          p.position.row === current.position.row - 1
        );
      case "down":
        return (
          p.position.column === current.position.column &&
          p.position.row === current.position.row + 1
        );
      case "left":
        return (
          p.position.row === current.position.row &&
          p.position.column === current.position.column - 1
        );
      case "right":
        return (
          p.position.row === current.position.row &&
          p.position.column === current.position.column + 1
        );
    }
  });

  if (target) {
    state.setActivePanel(target.id);
  }
}
```

### ➕ Get Next Available Position

```ts
export function getNextAvailablePosition(): { row: number; column: number } {
  const state = get(panelStore);
  const positions = state.panels.map(
    (p) => `${p.position.row},${p.position.column}`
  );

  // Simple row-priority placement
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if (!positions.includes(`${row},${col}`)) {
        return { row, column: col };
      }
    }
  }
  return { row: 0, column: 0 }; // fallback
}
```

### ❌ Remove Focused Panel

```ts
export function removeFocusedPanel() {
  const state = get(panelStore);
  if (state.panels.length <= 1) return;
  state.removePanel(state.activePanelId);
}
```

> Future improvements could include directional priority, distance-based lookup, and auto-layout recalculations.

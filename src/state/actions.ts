import { usePanelStore } from "./panelStore";
import { SortKey, SortOrder, useFileStore } from "./fileStore";
import { useTabStore } from "./tabStore";
import { registerDefaultCommands } from "../commands/registerDefaultCommands";
export function getNextAvailablePosition(): { row: number; column: number } {
  const state = usePanelStore.getState();
  const panels = state.panels;

  if (panels.length === 0) {
    return { row: 0, column: 0 }; // First panel at origin
  }

  // Find the maximum row and column
  let maxRow = 0;
  let maxCol = 0;

  panels.forEach((panel) => {
    maxRow = Math.max(maxRow, panel.position.row);
    maxCol = Math.max(maxCol, panel.position.column);
  });

  // Check if we have any empty positions in the current grid
  // For positions like (0,0), (0,1), (1,0), return (1,1)
  for (let row = 0; row <= maxRow; row++) {
    for (let col = 0; col <= maxCol; col++) {
      const positionExists = panels.some(
        (p) => p.position.row === row && p.position.column === col
      );

      if (!positionExists) {
        return { row, column: col };
      }
    }
  }

  // If all positions in the grid are filled
  // For a complete square, add a new column
  if (maxRow === maxCol) {
    return { row: 0, column: maxCol + 1 };
  }

  // Otherwise, complete the rectangle
  return { row: maxRow + 1, column: 0 };
}

export function addRowPanel() {
  const state = usePanelStore.getState();
  const panels = state.panels;

  if (panels.length === 0) {
    // If no panels exist, create first one at origin
    state.addPanel({ row: 0, column: 0 });
    return;
  }

  // Find the active panel
  const activePanel = panels.find((p) => p.id === state.activePanelId);
  if (!activePanel) return;

  // Add a panel below the active panel
  const newPosition = {
    row: activePanel.position.row + 1,
    column: activePanel.position.column,
  };

  // Check if a panel already exists at this position
  const existingPanel = panels.find(
    (p) =>
      p.position.row === newPosition.row &&
      p.position.column === newPosition.column
  );

  if (!existingPanel) {
    state.addPanel(newPosition);
  }
}

export function addColumnPanel() {
  const state = usePanelStore.getState();
  const panels = state.panels;

  if (panels.length === 0) {
    // If no panels exist, create first one at origin
    state.addPanel({ row: 0, column: 0 });
    return;
  }

  // Find the active panel
  const activePanel = panels.find((p) => p.id === state.activePanelId);
  if (!activePanel) return;

  // Add a panel to the right of the active panel
  const newPosition = {
    row: activePanel.position.row,
    column: activePanel.position.column + 1,
  };

  // Check if a panel already exists at this position
  const existingPanel = panels.find(
    (p) =>
      p.position.row === newPosition.row &&
      p.position.column === newPosition.column
  );

  if (!existingPanel) {
    state.addPanel(newPosition);
  }
}

export async function openTab(path: string) {
  const panelStore = usePanelStore.getState();
  const fileStore = useFileStore.getState();
  const tabStore = useTabStore.getState();
  const activePanelId = panelStore.activePanelId;

  if (!activePanelId) {
    console.error("No active panel found");
    return;
  }

  const tabId = tabStore.addTab(activePanelId, path);
  await fileStore.loadDirectory(activePanelId, tabId, path);
}

export async function moveDirectory(tabId: string, path: string) {
  const tabStore = useTabStore.getState();
  const fileStore = useFileStore.getState();
  const activePanelId = usePanelStore.getState().activePanelId;

  if (!activePanelId || !tabId) {
    console.error("No active panel or tab found");
    return;
  }

  await fileStore.loadDirectory(activePanelId, tabId, path);
  tabStore.updateTab(
    activePanelId,
    tabId,
    path.split("\\").pop() || path,
    path
  );
}

export function closeTab(panelId: string, tabId: string) {
  const tabStore = useTabStore.getState();
  const fileStore = useFileStore.getState();

  tabStore.closeTab(panelId, tabId);
  // Clean up file state for the closed tab
  fileStore.setFileState(panelId, tabId, {
    files: [],
    selectedIndex: -1,
    currentDir: "",
  });
}

export function switchTab(panelId: string, tabId: string) {
  const tabStore = useTabStore.getState();
  tabStore.switchTab(panelId, tabId);
}

export function setSort(
  panelId: string,
  tabId: string,
  sortKey: SortKey,
  sortOrder: SortOrder
) {
  const fileStore = useFileStore.getState();
  fileStore.setSortKey(panelId, tabId, sortKey);
  fileStore.setSortOrder(panelId, tabId, sortOrder);
}

export function initializeApp() {
  const panelStore = usePanelStore.getState();

  if (panelStore.panels.length === 0) {
    panelStore.addPanel({ row: 0, column: 0 });
  }

  registerDefaultCommands();
}

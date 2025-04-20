import { usePanelStore } from "./panelStore";
import { SortKey, SortOrder, useFileStore } from "./fileStore";
import { useTabStore } from "./tabStore";

export function getNextAvailablePosition(): { row: number; column: number } {
  const state = usePanelStore.getState();
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

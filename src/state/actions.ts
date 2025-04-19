import { usePanelStore } from "./panelStore";
import { SortKey, SortOrder, useFileStore } from "./fileStore";

export async function openTab(path: string) {
  const panelStore = usePanelStore.getState();
  const fileStore = useFileStore.getState();
  const activePanelId = panelStore.activePanelId;

  if (!activePanelId) {
    console.error("No active panel found");
    return;
  }

  const tabId = panelStore.addTab(activePanelId, path);
  await fileStore.loadDirectory(activePanelId, tabId, path);
}

export async function moveDirectory(path: string) {
  const panelStore = usePanelStore.getState();
  const fileStore = useFileStore.getState();
  const activePanelId = panelStore.activePanelId;
  const activeTabId = panelStore.panels.find(
    (p) => p.id === activePanelId
  )?.activeTabId;

  if (!activePanelId || !activeTabId) {
    console.error("No active panel or tab found");
    return;
  }

  await fileStore.loadDirectory(activePanelId, activeTabId, path);
  panelStore.updateTab(
    activePanelId,
    activeTabId,
    path.split("\\").pop() || path,
    path
  );
}

export function closeTab(panelId: string, tabId: string) {
  const panelStore = usePanelStore.getState();
  const fileStore = useFileStore.getState();

  panelStore.closeTab(panelId, tabId);
  // Clean up file state for the closed tab
  fileStore.setFileState(panelId, tabId, {
    files: [],
    selectedIndex: -1,
    currentDir: "",
  });
}

export function switchTab(panelId: string, tabId: string) {
  const panelStore = usePanelStore.getState();
  panelStore.switchTab(panelId, tabId);
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

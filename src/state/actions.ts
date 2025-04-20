import { usePanelStore } from "./panelStore";
import { SortKey, SortOrder, useFileStore } from "./fileStore";
import { useTabStore } from "./tabStore";
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

export async function moveDirectory(path: string) {
  const tabStore = useTabStore.getState();
  const fileStore = useFileStore.getState();
  const activePanelId = usePanelStore.getState().activePanelId;
  const activeTabId = tabStore.getActiveTab(activePanelId)?.id;

  if (!activePanelId || !activeTabId) {
    console.error("No active panel or tab found");
    return;
  }

  await fileStore.loadDirectory(activePanelId, activeTabId, path);
  tabStore.updateTab(
    activePanelId,
    activeTabId,
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

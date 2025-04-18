// src/hooks/useSidebarController.ts
import { useUIStore } from "@/state/uiStore";

export function useSidebarController(side: "left" | "right") {
  const display = useUIStore((s) => s.sidebar[side].display);
  const setVisible = (v: boolean) =>
    useUIStore.getState().setSidebarVisible(side, v);
  const toggle = () => useUIStore.getState().toggleSidebar(side);
  const activeTabId = useUIStore((s) => s.sidebar[side].activeTabId);
  const setActiveTab = (tabId: string) =>
    useUIStore.getState().setActiveTab(side, tabId);

  return { display, setVisible, toggle, activeTabId, setActiveTab };
}

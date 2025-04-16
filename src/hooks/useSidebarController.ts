// src/hooks/useSidebarController.ts
import { useUIStore } from "@/state/uiStore";

export function useSidebarController(side: "left" | "right") {
  const display = useUIStore((s) => s.sidebar[side].display);
  const setVisible = (v: boolean) =>
    useUIStore.getState().setSidebarVisible(side, v);
  const toggle = () => useUIStore.getState().toggleSidebar(side);

  return { display, setVisible, toggle };
}

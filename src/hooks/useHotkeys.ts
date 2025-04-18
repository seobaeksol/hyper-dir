// src/hooks/useHotkeys.ts
import { useEffect } from "react";
import { useSidebarController } from "./useSidebarController";
import { useCommandStore } from "@/state/commandStore";

export function useHotkeys() {
  const left = useSidebarController("left");
  const right = useSidebarController("right");
  const openSearchMode = useCommandStore((s) => s.openSearchMode);
  const openCommandMode = useCommandStore((s) => s.openCommandMode);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;
      const isShift = e.shiftKey;

      if (isCtrl && !isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        right.toggle();
      }

      if (isCtrl && isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        left.toggle();
      }

      // Ctrl + P → Command Palette with search mode
      if (isCtrl && !isShift && e.key.toLowerCase() === "p") {
        e.preventDefault();
        openSearchMode();
      }

      // Ctrl + Shift + P → Command Palette with command mode
      if (isCtrl && isShift && e.key.toLowerCase() === "p") {
        e.preventDefault();
        openCommandMode();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

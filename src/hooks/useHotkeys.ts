// src/hooks/useHotkeys.ts
import { useEffect } from "react";
import { useSidebarController } from "./useSidebarController";
import { useUIStore } from "@/state/uiStore";

export function useHotkeys() {
  const left = useSidebarController("left");
  const right = useSidebarController("right");
  const toggleCommandPalette = useUIStore((s) => s.toggleCommandPalette);

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

      // Ctrl + P → 커맨드 팔레트 열기
      if (isCtrl && !isShift && e.key.toLowerCase() === "p") {
        e.preventDefault();
        toggleCommandPalette();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

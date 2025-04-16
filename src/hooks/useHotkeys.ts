// src/hooks/useHotkeys.ts
import { useEffect } from "react";
import { useSidebarController } from "./useSidebarController";

export function useHotkeys() {
  const left = useSidebarController("left");
  const right = useSidebarController("right");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey;
      const isAlt = e.altKey;

      if (isCtrl && !isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        left.toggle();
      }

      if (isCtrl && isAlt && e.key.toLowerCase() === "b") {
        e.preventDefault();
        right.toggle();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}

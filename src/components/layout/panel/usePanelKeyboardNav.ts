// src/components/layout/panel/usePanelKeyboardNav.ts
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";

export function usePanelKeyboardNav() {
  const files = useFileStore((s) => s.files);
  const selectedIndex = useFileStore((s) => s.selectedIndex);
  const setSelectedIndex = useFileStore((s) => s.setSelectedIndex);
  const loadDirectory = useFileStore((s) => s.loadDirectory);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isAlt = e.altKey;

      if (!isAlt && e.key === "ArrowUp") {
        e.preventDefault();
        if (files.length > 0) {
          setSelectedIndex((selectedIndex - 1 + files.length) % files.length);
        }
      }

      if (!isAlt && e.key === "ArrowDown") {
        e.preventDefault();
        if (files.length > 0) {
          setSelectedIndex((selectedIndex + 1) % files.length);
        }
      }

      if (!isAlt && e.key === "Enter") {
        e.preventDefault();
        const target = files[selectedIndex];
        console.log(files);
        console.log(target);
        if (target?.is_dir) {
          loadDirectory(target.path);
        }
      }

      if (!isAlt && e.key === "Backspace") {
        e.preventDefault();
        const parent = files.find((f) => f.name === "..");
        if (parent) {
          loadDirectory(parent.path);
        }
      }

      if (!isAlt && e.key === "Escape") {
        e.preventDefault();
        setSelectedIndex(-1);
      }

      if (isAlt && e.key === "ArrowUp") {
        e.preventDefault();
        const parent = files.find((f) => f.name === "..");
        if (parent) {
          loadDirectory(parent.path);
        }
      }

      if (isAlt && e.key === "ArrowDown") {
        e.preventDefault();
        const target = files[selectedIndex];
        if (target?.is_dir) {
          loadDirectory(target.path);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [files, selectedIndex]);
}

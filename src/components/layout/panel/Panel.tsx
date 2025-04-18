// src/components/layout/panel/Panel.tsx
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";

export const Panel = () => {
  const { currentDir, files, selectedIndex, setSelectedIndex, loadDirectory } =
    useFileStore();

  usePanelKeyboardNav();

  useEffect(() => {
    loadDirectory(currentDir);
  }, [currentDir]);

  return (
    <div className="w-full p-2">
      <div className="font-semibold mb-2 text-xs opacity-70 text-white">
        {currentDir}
      </div>
      <ul className="text-sm space-y-1">
        <PanelHeader />
        {files.map((file, idx) => (
          <PanelItem
            key={file.path + idx}
            file={file}
            selected={idx === selectedIndex}
            onClick={() => {
              setSelectedIndex(idx);
              if (file.is_dir) loadDirectory(file.path);
            }}
          />
        ))}
      </ul>
    </div>
  );
};

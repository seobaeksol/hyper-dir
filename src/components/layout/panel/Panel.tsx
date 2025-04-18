// src/components/layout/panel/Panel.tsx
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { useSortedFiles } from "./useSortedFiles";
import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";

export const Panel = () => {
  const { currentDir, selectedIndex, setSelectedIndex, loadDirectory } =
    useFileStore();
  const sortedFiles = useSortedFiles();

  useEffect(() => {
    loadDirectory(currentDir);
  }, [currentDir]);

  return (
    <div className="w-full p-2">
      <div className="font-semibold mb-2 text-xs opacity-70">{currentDir}</div>
      <ul className="text-sm space-y-1">
        <PanelHeader />
        {sortedFiles.map((file, idx) => (
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

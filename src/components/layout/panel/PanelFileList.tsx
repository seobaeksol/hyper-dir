import { moveDirectory } from "@/state/actions";
import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";
import { useMemo } from "react";

interface PanelFileListProps {
  panelId: string;
}

export const PanelFileList = ({ panelId }: PanelFileListProps) => {
  const { getCurrentFileState, setFileState, loadDirectory } = useFileStore();
  const { panels } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  if (!panel) return null;

  const fileState = getCurrentFileState(panelId, panel.activeTabId);
  const { currentDir, files, selectedIndex, sortKey, sortOrder } = fileState;

  // Separate parent directory entry and other files
  const [parentEntry, otherFiles] = useMemo(() => {
    const parent = files.find((f) => f.name === "..");
    const others = files.filter((f) => f.name !== "..");
    return [parent, others];
  }, [files]);

  // Sort files with useMemo
  const sortedFiles = useMemo(() => {
    const sorted = [...otherFiles].sort((a, b) => {
      // Directory first (except when sorting by file_type)
      if (sortKey !== "file_type") {
        if (a.is_dir && !b.is_dir) return -1;
        if (!a.is_dir && b.is_dir) return 1;
      }

      // Sort by key
      const va = a[sortKey] ?? 0;
      const vb = b[sortKey] ?? 0;

      if (typeof va === "string" && typeof vb === "string") {
        return sortOrder === "asc"
          ? va.localeCompare(vb, undefined, { sensitivity: "base" })
          : vb.localeCompare(va, undefined, { sensitivity: "base" });
      } else if (typeof va === "number" && typeof vb === "number") {
        return sortOrder === "asc" ? va - vb : vb - va;
      }

      return 0;
    });

    // Always put parent directory at the top
    return parentEntry ? [parentEntry, ...sorted] : sorted;
  }, [otherFiles, parentEntry, sortKey, sortOrder]);

  return (
    <div className="flex flex-col h-[calc(100%-2rem)]">
      <div className="p-2">
        <div className="font-semibold mb-2 text-xs opacity-70 text-white">
          {currentDir}
        </div>
        <div className="overflow-x-auto">
          <ul className="text-sm min-w-max">
            <PanelHeader
              panelId={panelId}
              tabId={panel.activeTabId}
              sortKey={sortKey}
              sortOrder={sortOrder}
            />
          </ul>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 pt-0">
        <ul className="text-sm space-y-1 min-w-max">
          {sortedFiles.map((file, idx) => (
            <PanelItem
              key={file.path + idx}
              file={file}
              selected={idx === selectedIndex}
              onClick={() => {
                if (file.is_dir) {
                  moveDirectory(file.path);
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

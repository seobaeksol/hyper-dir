import { moveDirectory } from "@/state/actions";
import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";
import { FileState, useFileStore } from "@/state/fileStore";
import { useEffect, useMemo } from "react";
import { useTabStore } from "@/state/tabStore";

interface PanelFileListProps {
  panelId: string;
  tabId: string;
}

export const PanelFileList = ({ panelId, tabId }: PanelFileListProps) => {
  const { getCurrentFileState } = useFileStore();
  const { getTabById } = useTabStore();
  const tab = getTabById(panelId, tabId);

  useEffect(() => {
    if (tab) {
      moveDirectory(tabId, tab.path);
    }
  }, []);

  const fileState = tab
    ? getCurrentFileState(panelId, tab.id)
    : ({
        currentDir: "",
        files: [],
        selectedIndex: -1,
        sortKey: "name",
        sortOrder: "asc",
      } as FileState);
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

  // Render nothing or a fallback if tab is undefined
  if (!tab || sortedFiles.length === 0) {
    return (
      <div
        className="flex flex-col h-[calc(100%-2rem)]"
        data-testid="panelfilelist"
      >
        <div className="p-2">
          <div className="font-semibold mb-2 text-xs opacity-70 text-white">
            No directory selected
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col h-[calc(100%-2rem)]"
      data-testid="panelfilelist"
    >
      <PanelHeader
        currentDir={currentDir}
        panelId={panelId}
        tabId={tab.id}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
      <div className="flex-1 overflow-auto p-2 pt-0">
        <ul className="text-sm space-y-1 min-w-max">
          {sortedFiles.map((file, idx) => (
            <PanelItem
              key={file.path + idx}
              file={file}
              selected={idx === selectedIndex}
              onClick={() => {
                if (file.is_dir) {
                  moveDirectory(tabId, file.path);
                }
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

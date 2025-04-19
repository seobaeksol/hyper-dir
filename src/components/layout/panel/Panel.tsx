// src/components/layout/panel/Panel.tsx
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";
import { usePanelStore } from "@/state/panelStore";
import { Tabbar } from "./Tabbar";

interface PanelProps {
  panelId: string;
}

export const Panel = ({ panelId }: PanelProps) => {
  const { getCurrentFileState, setFileState, loadDirectory } = useFileStore();
  const { panels } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  usePanelKeyboardNav(panelId);

  useEffect(() => {
    if (panel?.activeTabId) {
      const activeTab = panel.tabs.find((t) => t.id === panel.activeTabId);
      if (activeTab) {
        loadDirectory(panelId, panel.activeTabId, activeTab.path);
      }
    }
  }, [panel?.activeTabId]);

  if (!panel) return null;

  const fileState = getCurrentFileState(panelId, panel.activeTabId);
  const { currentDir, files, selectedIndex } = fileState;

  return (
    <div className="flex flex-col h-full">
      <Tabbar panelId={panelId} />
      <div className="flex-1 p-2 overflow-auto">
        <div className="font-semibold mb-2 text-xs opacity-70 text-white">
          {currentDir}
        </div>
        <ul className="text-sm space-y-1">
          <PanelHeader
            panelId={panelId}
            tabId={panel.activeTabId}
            sortKey={fileState.sortKey}
            sortOrder={fileState.sortOrder}
          />
          {files.map((file, idx) => (
            <PanelItem
              key={file.path + idx}
              file={file}
              selected={idx === selectedIndex}
              onClick={() => {
                setFileState(panelId, panel.activeTabId, {
                  selectedIndex: idx,
                });
                if (file.is_dir)
                  loadDirectory(panelId, panel.activeTabId, file.path);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

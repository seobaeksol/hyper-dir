// src/components/layout/panel/Panel.tsx
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";
import { Tabbar } from "./Tabbar";
import { PanelFileList } from "./PanelFileList";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";

interface PanelProps {
  panelId: string;
}

export const Panel = ({ panelId }: PanelProps) => {
  const { loadDirectory } = useFileStore();
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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabbar panelId={panelId} />
      <PanelFileList panelId={panelId} />
    </div>
  );
};

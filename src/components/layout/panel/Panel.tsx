// src/components/layout/panel/Panel.tsx
import { useEffect } from "react";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";
import { Tabbar } from "./Tabbar";
import { PanelFileList } from "./PanelFileList";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";
import { moveDirectory } from "@/state/actions";

interface PanelProps {
  panelId: string;
}

export const Panel = ({ panelId }: PanelProps) => {
  const { getCurrentFileState } = useFileStore();
  const { panels } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  usePanelKeyboardNav(panelId);

  useEffect(() => {
    if (panel?.activeTabId) {
      const activeTab = panel.tabs.find((t) => t.id === panel.activeTabId);
      if (activeTab) {
        const fileState = getCurrentFileState(panelId, panel.activeTabId);
        if (!fileState.currentDir) {
          moveDirectory(activeTab.path);
        }
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

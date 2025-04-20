import { usePanelStore } from "@/state/panelStore";
import { Tabbar } from "./Tabbar";
import { PanelFileList } from "./PanelFileList";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";
import { useTabStore } from "@/state/tabStore";

interface PanelProps {
  panelId: string;
}

export const Panel = ({ panelId }: PanelProps) => {
  const { panels, setActivePanel } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);
  const { getActiveTab } = useTabStore();
  const activeTab = getActiveTab(panelId);

  usePanelKeyboardNav(panelId);

  if (!panel) return null;

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      onClick={() => setActivePanel(panelId)}
    >
      <Tabbar panelId={panelId} />
      {activeTab && <PanelFileList panelId={panelId} tabId={activeTab.id} />}
    </div>
  );
};

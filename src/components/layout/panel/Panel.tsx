import { usePanelStore } from "@/state/panelStore";
import { Tabbar } from "./Tabbar";
import { PanelFileList } from "./PanelFileList";
import { usePanelKeyboardNav } from "./usePanelKeyboardNav";

interface PanelProps {
  panelId: string;
}

export const Panel = ({ panelId }: PanelProps) => {
  const { panels } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  usePanelKeyboardNav(panelId);

  if (!panel) return null;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Tabbar panelId={panelId} />
      <PanelFileList panelId={panelId} />
    </div>
  );
};

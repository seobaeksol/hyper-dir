import { Panel } from "./Panel";
import { usePanelStore } from "@/state/panelStore";

export const PanelWrapper = () => {
  const { panels, activePanelId } = usePanelStore();

  return (
    <div className="flex flex-1 overflow-hidden">
      {panels.map((panel) => (
        <div
          key={panel.id}
          className={`flex flex-col flex-1 overflow-hidden transition-all duration-200 ${
            panel.id === activePanelId ? "bg-zinc-900/50" : "bg-zinc-900/20"
          }`}
        >
          <Panel panelId={panel.id} />
        </div>
      ))}
    </div>
  );
};

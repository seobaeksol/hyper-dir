import React from "react";
import { usePanelStore } from "@/state/panelStore";
import { useFileStore } from "@/state/fileStore";
import { closeTab, switchTab, openTab } from "@/state/actions";

interface TabbarProps {
  panelId: string;
}

export const Tabbar: React.FC<TabbarProps> = ({ panelId }) => {
  const { panels } = usePanelStore();
  const { getCurrentFileState } = useFileStore();
  const panel = panels.find((p) => p.id === panelId);

  if (!panel) return null;

  const fileState = getCurrentFileState(panelId, panel.activeTabId);
  const { currentDir } = fileState;

  return (
    <div className="h-8 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 overflow-x-auto">
      <div className="flex gap-1 text-sm text-white">
        {panel.tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-1 px-3 py-1 rounded-t-sm ${
              tab.id === panel.activeTabId
                ? "bg-zinc-700 font-bold"
                : "hover:bg-zinc-700 opacity-75"
            }`}
            onClick={() => switchTab(panelId, tab.id)}
          >
            <span>{tab.title}</span>
            <button
              className="text-xs opacity-50 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(panelId, tab.id);
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          className="px-2 py-1 text-xs opacity-50 hover:opacity-100"
          onClick={() => openTab(currentDir)}
        >
          +
        </button>
      </div>
    </div>
  );
};

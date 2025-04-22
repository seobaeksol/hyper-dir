import React from "react";
import { closeTab, switchTab, openTab } from "@/state/actions";
import { useTabStore } from "@/state/tabStore";

interface TabbarProps {
  panelId: string;
}

export const Tabbar: React.FC<TabbarProps> = ({ panelId }) => {
  const { getTabsByPanelId, getActiveTab } = useTabStore();
  const tabs = getTabsByPanelId(panelId);
  const activeTab = getActiveTab(panelId);

  return (
    <div
      className="h-8 bg-zinc-800 flex items-center px-2 overflow-x-auto"
      data-testid="tabbar"
    >
      <div className="flex gap-1 text-sm text-white">
        {tabs.map((tab) => (
          <div className="relative group" key={tab.id}>
            <div
              className={`flex items-center justify-between gap-1 px-3 py-1 rounded-t-sm min-w-[120px] transition-colors ${
                tab.id === activeTab?.id
                  ? "bg-zinc-700 text-white border-b-2 border-zinc-500"
                  : "bg-zinc-900 text-zinc-400 hover:bg-zinc-700 border-b-2 border-zinc-900"
              }`}
              onClick={() => switchTab(panelId, tab.id)}
            >
              <span className="truncate" title={tab.path}>
                {tab.title}
              </span>
              <button
                className="opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(panelId, tab.id);
                }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        <button
          className="px-2 py-1 text-xs opacity-50 hover:opacity-100"
          onClick={() => openTab(activeTab?.path || "C:\\")} // TOBE: Configure default directory by platform
        >
          +
        </button>
      </div>
    </div>
  );
};

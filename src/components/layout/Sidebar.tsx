// src/components/layout/Sidebar.tsx
import React from "react";
import { SidebarTab } from "./sidebar/SidebarTab";
import { ExplorerPanel } from "./sidebar/panels/ExplorerPanel";
import { GitPanel } from "./sidebar/panels/GitPanel";
import { SearchPanel } from "./sidebar/panels/SearchPanel";
import { ConfigPanel } from "./sidebar/panels/ConfigPanel";
import { StarredPanel } from "./sidebar/panels/StarredPanel";
import { useSidebarController } from "@/hooks/useSidebarController";


const TABS = [
  { id: "explorer", icon: "📁", panel: <ExplorerPanel /> },
  { id: "search", icon: "🔍", panel: <SearchPanel /> },
  { id: "git", icon: "🔃", panel: <GitPanel /> },
  { id: "config", icon: "⚙️", panel: <ConfigPanel /> },
  { id: "starred", icon: "⭐", panel: <StarredPanel /> },
];

export const Sidebar: React.FC<{ position: "left" | "right" }> = ({ position }) => {
  const { display, activeTabId, setActiveTab } = useSidebarController(position);

  if (!display) return null;

  const ActivePanel = TABS.find((tab) => tab.id === activeTabId)?.panel;

  return (
    <div className={`w-60 bg-zinc-900 border-zinc-700 ${position === "left" ? "border-r" : "border-l"}`}>
      {/* Tab Icons */}
      <div className="flex flex-row bg-zinc-800 text-white h-10 items-center px-2 gap-1 border-b border-zinc-700">
        {TABS.map((tab) => (
          <SidebarTab
            key={tab.id}
            icon={tab.icon}
            active={activeTabId === tab.id}
            onClick={() => setActiveTab(tab.id)}
          />
        ))}
      </div>
      {/* Panel Content */}
      <div className="p-2 text-sm text-white h-[calc(100%-2.5rem)] overflow-y-auto">
        {ActivePanel}
      </div>
    </div>
  );
};

// src/components/layout/Sidebar.tsx
import React, { useState } from "react";
import { useUIStore } from "@/state/uiStore";
import { SidebarTab } from "./sidebar/SidebarTab";
import { ExplorerPanel } from "./sidebar/panels/ExplorerPanel";
import { GitPanel } from "./sidebar/panels/GitPanel";
import { SearchPanel } from "./sidebar/panels/SearchPanel";
import { ConfigPanel } from "./sidebar/panels/ConfigPanel";
import { StarredPanel } from "./sidebar/panels/StarredPanel";

type SidebarTabType = "explorer" | "git" | "search" | "config" | "starred";

export const Sidebar: React.FC<{ position: "left" | "right" }> = ({ position }) => {
  const sidebarVisible = useUIStore((state) => state.sidebarVisible);
  const [activeTab, setActiveTab] = useState<SidebarTabType>("explorer");

  const renderPanel = () => {
    switch (activeTab) {
      case "explorer": return <ExplorerPanel />;
      case "git": return <GitPanel />;
      case "search": return <SearchPanel />;
      case "config": return <ConfigPanel />;
      case "starred": return <StarredPanel />;
      default: return null;
    }
  };

  if (!sidebarVisible) return null;

  return (
    <div className={`w-60 bg-zinc-900 border-zinc-700 ${position === "left" ? "border-r" : "border-l"}`}>
      {/* 탭 아이콘 */}
      <div className="flex flex-row bg-zinc-800 text-white h-10 items-center px-2 gap-1 border-b border-zinc-700">
        <SidebarTab icon="📁" active={activeTab === "explorer"} onClick={() => setActiveTab("explorer")} />
        <SidebarTab icon="🔍" active={activeTab === "search"} onClick={() => setActiveTab("search")} />
        <SidebarTab icon="🔃" active={activeTab === "git"} onClick={() => setActiveTab("git")} />
        <SidebarTab icon="⚙️" active={activeTab === "config"} onClick={() => setActiveTab("config")} />
        <SidebarTab icon="⭐" active={activeTab === "starred"} onClick={() => setActiveTab("starred")} />
      </div>

      {/* 패널 콘텐츠 */}
      <div className="p-2 text-sm text-white h-[calc(100%-2.5rem)] overflow-y-auto">
        {renderPanel()}
      </div>
    </div>
  );
};

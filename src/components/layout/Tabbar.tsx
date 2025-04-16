// src/components/layout/Tabbar.tsx
import React from "react";

export const Tabbar: React.FC = () => {
  const tabs = ["~/project", "~/src", "~/docs"];
  const activeTab = 1;

  return (
    <div className="h-8 bg-zinc-800 border-b border-zinc-700 flex items-center px-2 overflow-x-auto">
      <div className="flex gap-1 text-sm text-white">
        {tabs.map((tab, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-1 px-3 py-1 rounded-t-sm ${
              idx === activeTab
                ? "bg-zinc-700 font-bold"
                : "hover:bg-zinc-700 opacity-75"
            }`}
          >
            <span>{tab}</span>
            <button className="text-xs opacity-50 hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
};

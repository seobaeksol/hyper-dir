// src/components/layout/Titlebar.tsx
import React from "react";

export const Titlebar: React.FC = () => {
  return (
    <div className="h-8 bg-zinc-800 text-white flex items-center justify-between px-2">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold">📁 Hyper-Dir</span>
        <span className="text-xs opacity-50">Explorer</span>
      </div>
      <div className="flex gap-2">
        <button className="text-xs hover:bg-zinc-700 px-1 rounded">Layout</button>
        <button className="text-xs">🗕</button>
        <button className="text-xs">🗖</button>
        <button className="text-xs">✕</button>
      </div>
    </div>
  );
};

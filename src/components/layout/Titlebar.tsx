// src/components/layout/Titlebar.tsx
import React from "react";
import { Window } from "@tauri-apps/api/window";

export const Titlebar: React.FC = () => {
  const handleMinimize = () => Window.getCurrent().minimize();
  const handleMaximize = () => Window.getCurrent().toggleMaximize();
  const handleClose = () => Window.getCurrent().close();

  return (
    <div className="h-8 bg-zinc-800 text-white flex items-center justify-between px-2" data-tauri-drag-region >
      <div className="flex items-center gap-2">
        <img src="/icons/128x128_no_bg_no_padding.png" alt="Hyper-Dir Logo" className="w-4 h-4 rounded-sm" />
        <span className="text-sm font-bold">Hyper-Dir</span>
      </div>
      <div className="flex gap-2">
        <button className="text-xs hover:bg-zinc-700 px-1 rounded">Layout</button>
        <button 
          className="text-xs hover:bg-zinc-700 px-1 rounded"
          onClick={handleMinimize}
        >
          🗕
        </button>
        <button 
          className="text-xs hover:bg-zinc-700 px-1 rounded"
          onClick={handleMaximize}
        >
          🗖
        </button>
        <button 
          className="text-xs hover:bg-zinc-700 px-1 rounded"
          onClick={handleClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

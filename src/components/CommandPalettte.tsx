// src/components/CommandPalette.tsx
import React from "react";
import { useUIStore } from "@/state/uiStore";

export const CommandPalette: React.FC = () => {
  const visible = useUIStore((s) => s.commandPaletteVisible);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50">
      <div className="mt-32 w-full max-w-md bg-zinc-900 text-white rounded shadow-lg p-4">
        <input
          type="text"
          className="w-full px-3 py-2 rounded bg-zinc-800 text-sm focus:outline-none"
          placeholder="Type a command..."
          autoFocus
        />
        <ul className="mt-2 text-sm text-zinc-400 max-h-64 overflow-y-auto">
          <li className="py-1 px-2 hover:bg-zinc-800 rounded">Open Folder</li>
          <li className="py-1 px-2 hover:bg-zinc-800 rounded">Toggle Sidebar</li>
          <li className="py-1 px-2 hover:bg-zinc-800 rounded">Switch Layout</li>
        </ul>
      </div>
    </div>
  );
};

// src/components/CommandPalette.tsx
import React, { useEffect, useRef } from "react";
import { useUIStore } from "@/state/uiStore";
import { useCommandStore } from "@/state/commandStore";

export const CommandPalette: React.FC = () => {
  const visible = useUIStore((s) => s.commandPaletteVisible);
  const toggle = useUIStore((s) => s.toggleCommandPalette);
  const inputRef = useRef<HTMLInputElement>(null);

  const { query, commands, selectedIndex, setQuery, selectNext, selectPrev, executeSelected } =
    useCommandStore();

  // Escape Key Handling
  useEffect(() => {
    if (!visible) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        toggle(); // Close
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selectNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectPrev();
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeSelected();
        toggle(); // Close
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible]);

  if (!visible) return null;

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/30 flex items-start justify-center z-50" onClick={toggle}>
      <div className="mt-32 w-full max-w-md bg-zinc-900 text-white rounded shadow-lg p-4" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800 text-sm focus:outline-none"
          placeholder="Type a command..."
          autoFocus
        />
        <ul className="mt-2 text-sm text-zinc-400 max-h-64 overflow-y-auto">
          {filteredCommands.map((cmd, idx) => (
            <li
              key={cmd.id}
              className={`py-1 px-2 rounded ${
                idx === selectedIndex ? "bg-zinc-700 text-white" : "hover:bg-zinc-800"
              }`}
              onClick={() => {
                cmd.action();
                toggle();
              }}
            >
              {cmd.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

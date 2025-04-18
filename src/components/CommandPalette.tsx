// src/components/CommandPalette.tsx
import React, { useEffect, useRef } from "react";
import { useUIStore } from "@/state/uiStore";
import { useCommandStore } from "@/state/commandStore";
import { useFileStore } from "@/state/fileStore";

export const CommandPalette: React.FC = () => {
  const visible = useUIStore((s) => s.commandPaletteVisible);
  const setVisible = useUIStore((s) => s.setCommandPaletteVisible);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    query,
    commands,
    selectedIndex,
    setQuery,
    selectNext,
    selectPrev,
    executeSelected,
    getMode,
  } = useCommandStore();

  // Escape Key Handling
  useEffect(() => {
    if (!visible) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setVisible(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        selectNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectPrev();
      } else if (e.key === "Enter") {
        e.preventDefault();
        executeSelected();
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible]);

  const fileList = useFileStore((s) => s.files);

  if (!visible) return null;

  const mode = getMode();

  const filteredCommands = commands.filter((cmd) =>
    cmd.title
      .toLowerCase()
      .includes(query.replace(/^>/, "").trim().toLowerCase())
  );

  const filteredFiles = fileList.filter((f) =>
    f.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/30 flex items-start justify-center z-50"
      onClick={() => setVisible(false)}
    >
      <div
        className="mt-32 w-full max-w-md bg-zinc-900 text-white rounded shadow-lg p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3 py-2 rounded bg-zinc-800 text-sm focus:outline-none"
          placeholder={
            mode === "command" ? "Type a command..." : "Search files..."
          }
          autoFocus
        />
        <ul className="mt-2 text-sm text-zinc-400 max-h-64 overflow-y-auto">
          {mode === "search"
            ? filteredFiles.map((file, idx) => (
                <li
                  key={file.path}
                  className={`py-1 px-2 rounded ${
                    idx === selectedIndex
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-800"
                  }`}
                  onClick={() => {
                    // TODO: File open logic
                  }}
                >
                  {file.name}
                </li>
              ))
            : filteredCommands.map((cmd, idx) => (
                <li
                  key={cmd.id}
                  className={`py-1 px-2 rounded ${
                    idx === selectedIndex
                      ? "bg-zinc-700 text-white"
                      : "hover:bg-zinc-800"
                  }`}
                  onClick={() => {
                    cmd.action();
                    setVisible(false);
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

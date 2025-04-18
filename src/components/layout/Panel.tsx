// src/components/layout/Panel.tsx
import { useFileStore } from "@/state/fileStore";
import React, { useEffect } from "react";

export const Panel: React.FC = () => {
  const { currentDir, files, selectedIndex, setSelectedIndex, loadDirectory } =
    useFileStore();

  useEffect(() => {
    loadDirectory(currentDir);
  }, [currentDir]);

  return (
    <div className="flex flex-1 bg-zinc-950 text-white overflow-hidden">
      <div className="w-1/2 border-r border-zinc-700 p-2">
        {/* Current Directory */}
        <div className="font-semibold mb-2 text-xs opacity-70">
          {currentDir}
        </div>

        {/* Files List */}
        <ul className="text-sm space-y-1">
          {files.map((file, idx) => (
            <li
              key={file.path + idx}
              onClick={() => {
                if (file.isDir) {
                  loadDirectory(file.path);
                }
              }}
              className={`flex justify-between px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer ${
                selectedIndex === idx ? "bg-zinc-800" : ""
              }`}
            >
              <span>
                {file.isDir ? "📁" : "📄"} {file.name}
              </span>
              <span className="text-xs opacity-50">1.2 KB</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2 p-2">
        <div className="font-semibold mb-2">📝 Preview</div>
        <div className="text-xs text-zinc-400">
          Select a file to view its contents
        </div>
      </div>
    </div>
  );
};

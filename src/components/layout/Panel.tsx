// src/components/layout/Panel.tsx
import React from "react";

const dummyFiles = [
  { name: "main.rs", type: "file", size: "1.4 KB" },
  { name: "src", type: "folder", size: "-" },
  { name: "README.md", type: "file", size: "832 B" },
];

export const Panel: React.FC = () => {
  return (
    <div className="flex flex-1 bg-zinc-950 text-white overflow-hidden">
      <div className="w-1/2 border-r border-zinc-700 p-2">
        <div className="font-semibold mb-2">📁 ~/project</div>
        <ul className="space-y-1 text-sm">
          {dummyFiles.map((file, idx) => (
            <li
              key={idx}
              className="flex justify-between px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer"
            >
              <span>
                {file.type === "folder" ? "📁" : "📄"} {file.name}
              </span>
              <span className="text-xs opacity-50">{file.size}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-1/2 p-2">
        <div className="font-semibold mb-2">📝 Preview</div>
        <div className="text-xs text-zinc-400">Select a file to view its contents</div>
      </div>
    </div>
  );
};

// src/components/layout/Panel.tsx
import { FileEntry } from "@/ipc/fs";
import { SortKey, SortOrder, useFileStore } from "@/state/fileStore";
import React, { useEffect } from "react";

function formatBytes(bytes?: number) {
  if (bytes == null) return "-";
  const units = ["B", "KB", "MB", "GB"];
  let i = 0;
  let size = bytes;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(1)} ${units[i]}`;
}

function formatTimestamp(ts?: number) {
  if (!ts) return "-";
  return new Date(ts * 1000).toLocaleString();
}
function sortFiles(
  files: FileEntry[],
  key: SortKey,
  order: SortOrder
): FileEntry[] {
  return [...files].sort((a, b) => {
    // 1. ".." First
    if (a.name === ".." && b.name !== "..") return -1;
    if (a.name !== ".." && b.name === "..") return 1;

    // 2. Directory First
    if (key !== "file_type" && a.is_dir && !b.is_dir) return -1;
    if (key !== "file_type" && !a.is_dir && b.is_dir) return 1;

    // 3. Sort by key
    const va = a[key] ?? 0;
    const vb = b[key] ?? 0;

    if (typeof va === "string" && typeof vb === "string") {
      return order === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    } else if (typeof va === "number" && typeof vb === "number") {
      return order === "asc" ? va - vb : vb - va;
    }

    return 0;
  });
}

export const Panel: React.FC = () => {
  const {
    currentDir,
    files,
    selectedIndex,
    setSelectedIndex,
    loadDirectory,
    sortKey,
    sortOrder,
    setSortKey,
    setSortOrder,
  } = useFileStore();

  useEffect(() => {
    loadDirectory(currentDir);
  }, [currentDir]);

  const sortedFiles = sortFiles(files, sortKey, sortOrder);

  return (
    <div className="flex flex-1 bg-zinc-950 text-white overflow-hidden">
      <div className="w-1/2 border-r border-zinc-700 p-2">
        {/* Current Directory */}
        <div className="font-semibold mb-2 text-xs opacity-70">
          {currentDir}
        </div>

        {/* Files List */}
        <ul className="text-sm space-y-1">
          <li className="px-2 py-1 text-xs uppercase text-zinc-500 flex border-b border-zinc-700">
            <span
              className="flex-1 cursor-pointer"
              onClick={() => setSortKey("name")}
            >
              Name {sortKey === "name" && (sortOrder === "asc" ? "▲" : "▼")}
            </span>
            <span
              className="w-24 text-right cursor-pointer"
              onClick={() => setSortKey("file_type")}
            >
              Type{" "}
              {sortKey === "file_type" && (sortOrder === "asc" ? "▲" : "▼")}
            </span>
            <span
              className="w-24 text-right cursor-pointer"
              onClick={() => setSortKey("size")}
            >
              Size {sortKey === "size" && (sortOrder === "asc" ? "▲" : "▼")}
            </span>
            <span
              className="w-36 text-right cursor-pointer"
              onClick={() => setSortKey("modified")}
            >
              Modified{" "}
              {sortKey === "modified" && (sortOrder === "asc" ? "▲" : "▼")}
            </span>
          </li>
          {sortedFiles.map((file, idx) => (
            <li
              key={file.path + idx}
              onClick={() => {
                if (file.is_dir) {
                  loadDirectory(file.path);
                }
              }}
              className={`flex justify-between px-2 py-1 rounded hover:bg-zinc-800 cursor-pointer ${
                selectedIndex === idx ? "bg-zinc-800" : ""
              }`}
            >
              <span className="flex-1 truncate">
                {file.name === ".." ? (
                  <span className="text-zinc-500">↩️ ..</span>
                ) : (
                  <>
                    {file.is_dir ? "📁" : "📄"} {file.name}
                  </>
                )}
              </span>
              {/* 타입 */}
              <span className="w-24 text-right text-xs opacity-70">
                {file.file_type}
              </span>
              {/* 크기 */}
              <span className="w-24 text-right text-xs opacity-70">
                {formatBytes(file.size)}
              </span>
              {/* 수정일 */}
              <span className="w-36 text-right text-xs opacity-60">
                {formatTimestamp(file.modified)}
              </span>
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

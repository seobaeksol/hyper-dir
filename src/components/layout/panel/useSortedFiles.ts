// src/components/layout/panel/useSortedFiles.ts
import { useFileStore } from "@/state/fileStore";
import { FileEntry } from "@/ipc/fs";
import { useMemo } from "react";
import { SortKey, SortOrder } from "@/state/fileStore";

function sortFiles(
  files: FileEntry[],
  key: SortKey,
  order: SortOrder
): FileEntry[] {
  return [...files].sort((a, b) => {
    // 1. ".." First
    if (a.name === "..") return -1;
    if (b.name === "..") return 1;

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

export function useSortedFiles() {
  const files = useFileStore((s) => s.files);
  const sortKey = useFileStore((s) => s.sortKey);
  const sortOrder = useFileStore((s) => s.sortOrder);

  return useMemo(
    () => sortFiles(files, sortKey, sortOrder),
    [files, sortKey, sortOrder]
  );
}

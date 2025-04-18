// src/components/layout/panel/formatters.ts
export function formatBytes(bytes?: number): string {
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

export function formatTimestamp(ts?: number): string {
  if (!ts) return "-";
  return new Date(ts * 1000).toLocaleString();
}

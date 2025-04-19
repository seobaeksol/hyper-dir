// src/components/layout/panel/PanelItem.tsx
import { FileEntry } from "@/ipc/fs";
import { formatBytes, formatTimestamp } from "./formatters";

interface Props {
  file: FileEntry;
  selected: boolean;
  onClick: () => void;
}

export const PanelItem: React.FC<Props> = ({ file, selected, onClick }) => {
  return (
    <li
      onClick={onClick}
      className={`flex justify-between px-2 py-1 rounded cursor-pointer text-white ${
        selected ? "bg-zinc-800" : "hover:bg-zinc-800"
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
      <span className="w-24 text-right text-xs opacity-70">
        {file.file_type}
      </span>
      <span className="w-24 text-right text-xs opacity-70">
        {formatBytes(file.size)}
      </span>
      <span className="w-36 text-right text-xs opacity-60 whitespace-nowrap">
        {formatTimestamp(file.modified)}
      </span>
    </li>
  );
};

// src/components/layout/panel/PanelHeader.tsx
import { SortKey, SortOrder } from "@/state/fileStore";
import { setSort, setCurrentDir, moveDirectory } from "@/state/actions";
import { useState } from "react";
import { usePathAliases } from "@/state/pathAliasStore";

export const PanelHeader = ({
  panelId,
  tabId,
  sortKey,
  sortOrder,
  currentDir,
}: {
  panelId: string;
  tabId: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
  currentDir: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(currentDir);
  const { aliases } = usePathAliases("hyper-dir");

  const handleDirClick = () => {
    setIsEditing(true);
    setEditValue(currentDir);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log(aliases);
    if (e.key === "Enter") {
      const aliasPath = aliases[editValue.toLowerCase()];
      if (aliasPath) {
        moveDirectory(tabId, aliasPath);
      } else {
        setCurrentDir(panelId, tabId, editValue);
      }
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditValue(currentDir);
    }
  };

  const renderHeader = (key: typeof sortKey, label: string) => (
    <span
      className="cursor-pointer"
      onClick={() =>
        sortKey === key
          ? setSort(panelId, tabId, key, sortOrder === "asc" ? "desc" : "asc")
          : setSort(panelId, tabId, key, "asc")
      }
    >
      {label} {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
    </span>
  );

  return (
    <div className="p-2">
      <div className="font-semibold mb-2 text-xs opacity-70 text-white w-full">
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
            className="w-full bg-zinc-800 text-white px-1 py-0.5 rounded"
            autoFocus
          />
        ) : (
          <span
            className="cursor-pointer hover:opacity-100 transition-opacity block w-full"
            onClick={handleDirClick}
          >
            {currentDir}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <ul className="text-sm min-w-max">
          <li className="px-2 py-1 text-xs uppercase text-zinc-500 flex border-b border-zinc-700">
            <span className="flex-1">{renderHeader("name", "Name")}</span>
            <span className="w-24 text-right">
              {renderHeader("file_type", "Type")}
            </span>
            <span className="w-24 text-right">
              {renderHeader("size", "Size")}
            </span>
            <span className="w-36 text-right">
              {renderHeader("modified", "Modified")}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

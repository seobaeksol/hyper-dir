// src/components/layout/panel/PanelHeader.tsx
import { useFileStore, SortKey, SortOrder } from "@/state/fileStore";

export const PanelHeader = ({
  panelId,
  tabId,
  sortKey,
  sortOrder,
}: {
  panelId: string;
  tabId: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
}) => {
  const { setSortKey, setSortOrder } = useFileStore();
  const renderHeader = (key: typeof sortKey, label: string) => (
    <span
      className="cursor-pointer"
      onClick={() =>
        sortKey === key
          ? setSortOrder(panelId, tabId, sortOrder === "asc" ? "desc" : "asc")
          : setSortKey(panelId, tabId, key)
      }
    >
      {label} {sortKey === key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
    </span>
  );

  return (
    <li className="px-2 py-1 text-xs uppercase text-zinc-500 flex border-b border-zinc-700">
      <span className="flex-1">{renderHeader("name", "Name")}</span>
      <span className="w-24 text-right">
        {renderHeader("file_type", "Type")}
      </span>
      <span className="w-24 text-right">{renderHeader("size", "Size")}</span>
      <span className="w-36 text-right">
        {renderHeader("modified", "Modified")}
      </span>
    </li>
  );
};

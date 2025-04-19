import { PanelHeader } from "./PanelHeader";
import { PanelItem } from "./PanelItem";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";

interface PanelFileListProps {
  panelId: string;
}

export const PanelFileList = ({ panelId }: PanelFileListProps) => {
  const { getCurrentFileState, setFileState, loadDirectory } = useFileStore();
  const { panels } = usePanelStore();
  const panel = panels.find((p) => p.id === panelId);

  if (!panel) return null;

  const fileState = getCurrentFileState(panelId, panel.activeTabId);
  const { currentDir, files, selectedIndex } = fileState;

  return (
    <div className="flex flex-col h-[calc(100%-2rem)]">
      <div className="p-2">
        <div className="font-semibold mb-2 text-xs opacity-70 text-white">
          {currentDir}
        </div>
        <div className="overflow-x-auto">
          <ul className="text-sm min-w-max">
            <PanelHeader
              panelId={panelId}
              tabId={panel.activeTabId}
              sortKey={fileState.sortKey}
              sortOrder={fileState.sortOrder}
            />
          </ul>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-2 pt-0">
        <ul className="text-sm space-y-1 min-w-max">
          {files.map((file, idx) => (
            <PanelItem
              key={file.path + idx}
              file={file}
              selected={idx === selectedIndex}
              onClick={() => {
                setFileState(panelId, panel.activeTabId, {
                  selectedIndex: idx,
                });
                if (file.is_dir)
                  loadDirectory(panelId, panel.activeTabId, file.path);
              }}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

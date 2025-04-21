import React from "react";

interface FileSearchResultListProps {
  query: string;
  files: any[];
  onFileExecute?: (file: any) => void;
}

export const FileSearchResultList: React.FC<FileSearchResultListProps> = ({
  query,
  files,
  onFileExecute,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(query.toLowerCase())
  );

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [query, files]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (filteredFiles.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(idx => {
          if (filteredFiles.length === 0) return -1;
          if (idx < 0) return 0;
          return Math.min(idx + 1, filteredFiles.length - 1);
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(idx => {
          if (filteredFiles.length === 0) return -1;
          if (idx <= 0) return -1;
          return idx - 1;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== -1 && filteredFiles[selectedIndex]) {
          onFileExecute?.(filteredFiles[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filteredFiles, selectedIndex, onFileExecute]);

  // Scroll to selected item
  React.useEffect(() => {
    if (selectedIndex !== -1 && itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex]);

  return (
    <ul
      className="mt-2 text-sm text-zinc-400 max-h-64 overflow-y-auto"
      tabIndex={0}
    >
      {filteredFiles.map((file, idx) => (
        <li
          key={file.path}
          ref={el => { itemRefs.current[idx] = el; }}
          className={`py-1 px-2 rounded flex items-center gap-2 ${idx === selectedIndex
            ? "bg-zinc-700 text-white"
            : "hover:bg-zinc-800"
            }`}
          onMouseEnter={() => setSelectedIndex(idx)}
          onMouseLeave={() => setSelectedIndex(-1)}
          onClick={() => onFileExecute?.(file)}
        >
          {file.is_dir ? (
            <span className="text-blue-400" aria-label="directory" title="Directory">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4a2 2 0 012-2h4.586A2 2 0 0110 2.586l1.414 1.414A2 2 0 0013.414 4H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4z" /></svg>
            </span>
          ) : (
            <span className="text-zinc-400" aria-label="file" title="File">
              <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V8.828a2 2 0 00-.586-1.414l-5.828-5.828A2 2 0 0010.828 2H4zm2 2v4a2 2 0 002 2h4v6a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2h2zm4 2.414L15.586 10H12a2 2 0 01-2-2V4.414z" /></svg>
            </span>
          )}
          <span className={file.is_dir ? "text-blue-400 font-medium" : ""}>{file.name}</span>
        </li>
      ))}

    </ul>
  );
};

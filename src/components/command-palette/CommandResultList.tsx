import React from "react";

interface CommandResultListProps {
  query: string;
  commands: any[];
  onCommandExecute?: (command: any) => void;
}

export const CommandResultList: React.FC<CommandResultListProps> = ({
  query,
  commands,
  onCommandExecute,
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const itemRefs = React.useRef<(HTMLLIElement | null)[]>([]);
  const filteredCommands = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(query.toLowerCase().replace(/^>/, '').trim())
  );

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [query, commands]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (filteredCommands.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(idx => {
          if (filteredCommands.length === 0) return -1;
          if (idx < 0) return 0;
          return Math.min(idx + 1, filteredCommands.length - 1);
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(idx => {
          if (filteredCommands.length === 0) return -1;
          if (idx <= 0) return -1;
          return idx - 1;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex !== -1 && filteredCommands[selectedIndex]) {
          onCommandExecute?.(filteredCommands[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [filteredCommands, selectedIndex, onCommandExecute]);

  // 선택된 항목이 바뀔 때 스크롤 자동 이동
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
      {filteredCommands.map((cmd, idx) => (
        <li
          key={cmd.id}
          ref={el => { itemRefs.current[idx] = el; }}
          className={`py-1 px-2 rounded ${idx === selectedIndex
            ? "bg-zinc-700 text-white"
            : "hover:bg-zinc-800"
            }`}
          onMouseEnter={() => setSelectedIndex(idx)}
          onMouseLeave={() => setSelectedIndex(-1)}
          onClick={() => onCommandExecute?.(cmd)}
        >
          {cmd.title}
        </li>
      ))}
    </ul>
  );
};

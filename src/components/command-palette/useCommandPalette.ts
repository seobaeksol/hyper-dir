import { useEffect, useState } from "react";
import { useCommandStore } from "@/state/commandStore";
import { useUIStore } from "@/state/uiStore";
import { useFileStore } from "@/state/fileStore";
import { usePanelStore } from "@/state/panelStore";
import { useTabStore } from "@/state/tabStore";
import { moveDirectory } from "@/state/actions";

function getMode(query: string) {
  return query.trim().startsWith(">") ? "command" : "search";
}

const useCommandPalette = () => {
  const visible = useUIStore((s) => s.commandPaletteVisible);
  const setVisible = useUIStore((s) => s.setCommandPaletteVisible);
  const { query, commands, setQuery, prompt, resolvePrompt, cancelPrompt } =
    useCommandStore();
  const activePanelId = usePanelStore((s) => s.activePanelId);
  const activeTabId = useTabStore((s) => s.getActiveTab(activePanelId)?.id);
  const fileState = useFileStore((s) =>
    activeTabId && activePanelId
      ? s.fileStates[activePanelId]?.[activeTabId]
      : null
  );

  const files = fileState?.files || [];

  const [promptInput, setPromptInput] = useState("");

  // Keyboard handling for prompt
  useEffect(() => {
    if (!visible || !prompt) return;
    setPromptInput(prompt.initialValue || "");
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        cancelPrompt();
        setVisible(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        resolvePrompt(promptInput);
        setVisible(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, prompt, promptInput]);

  // Keyboard handling for normal mode (리스트 제어 로직 제거)
  useEffect(() => {
    if (!visible || prompt) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setVisible(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, setVisible, prompt]);

  const mode = getMode(query);

  // 리스트의 실행만 콜백으로 전달
  const onFileExecute = (file: any) => {
    // 파일 열기/이동 등 실제 동작 구현
    if (file.is_dir && activeTabId) {
      moveDirectory(activeTabId, file.path);
    } else {
      // TODO: 파일 열기 로직 구현
      console.log("File open logic", file);
    }
    setVisible(false);
  };

  const onCommandExecute = (cmd: any) => {
    cmd?.action?.();
    setVisible(false);
  };

  return {
    visible,
    prompt,
    mode,
    query,
    setQuery,
    commands,
    files,
    promptInput,
    setPromptInput,
    onFileExecute,
    onCommandExecute,
  };
};

export default useCommandPalette;

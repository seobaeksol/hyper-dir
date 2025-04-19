import "./App.css";

import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { Statusbar } from "./components/layout/Statusbar";
import { useHotkeys } from "./hooks/useHotkeys";
import { CommandPalette } from "./components/CommandPalette";
import { registerDefaultCommands } from "./commands/registerDefaultCommands";
import { useEffect } from "react";
import { usePanelStore } from "./state/panelStore";
import { PanelWrapper } from "./components/layout/panel/PanelWrapper";

function App() {
  useHotkeys();
  const { panels, addPanel } = usePanelStore();

  useEffect(() => {
    registerDefaultCommands();
    if (panels.length === 0) {
      addPanel();
    }
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950">
      <Titlebar />
      <div className="flex flex-1">
        <Sidebar position="left" />
        <PanelWrapper />
        <Sidebar position="right" />
      </div>
      <Statusbar />
      <CommandPalette />
    </div>
  );
}

export default App;

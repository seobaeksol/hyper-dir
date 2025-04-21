import "./App.css";

import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { Statusbar } from "./components/layout/Statusbar";
import { useHotkeys } from "./hooks/useHotkeys";
import { CommandPalette } from "./components/command-palette/CommandPalette";
import { useEffect } from "react";
import { PanelWrapper } from "./components/layout/panel/PanelWrapper";
import { initializeApp } from "./state/actions";

function App() {
  useHotkeys();

  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-zinc-950">
      <Titlebar />
      <div className="flex flex-1 overflow-hidden">
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

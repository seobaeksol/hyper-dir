import "./App.css";

import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/sidebar/Sidebar";
import { Statusbar } from "./components/layout/Statusbar";
import { useHotkeys } from "./hooks/useHotkeys";
import { CommandPalette } from "./components/command-palette/CommandPalette";
import { useEffect } from "react";
import { PanelWrapper } from "./components/layout/panel/PanelWrapper";
import { initializeApp } from "./state/actions";
import { once } from "./utils";
import { ToastContainer } from "@/components/common/ToastContainer";

const initializeAppOnce = once(initializeApp);

function App() {
  useHotkeys();

  useEffect(() => {
    initializeAppOnce();
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
      <ToastContainer />
    </div>
  );
}

export default App;

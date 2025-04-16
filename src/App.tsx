import "./App.css";

import { Titlebar } from "./components/layout/Titlebar";
import { Sidebar } from "./components/layout/Sidebar";
import { Tabbar } from "./components/layout/Tabbar";
import { Panel } from "./components/layout/Panel";
import { Statusbar } from "./components/layout/Statusbar";

function App() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Titlebar />
      <div className="flex flex-1">
        <Sidebar position="left" />
        <div className="flex flex-col flex-1">
          <Tabbar />
          <Panel />
        </div>
        <Sidebar position="right" />
      </div>
      <Statusbar />
    </div>
  );
}

export default App;

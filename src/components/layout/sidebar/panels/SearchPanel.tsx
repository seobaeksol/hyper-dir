// src/components/layout/sidebar/panels/SearchPanel.tsx
import React from "react";

export const SearchPanel: React.FC = () => {
  return (
    <div role="tabpanel">
      <div className="font-bold mb-2">Search</div>
      <input
        type="text"
        placeholder="Search files..."
        className="w-full px-2 py-1 rounded bg-zinc-800 text-white text-sm mb-2"
      />
      <ul className="text-xs text-zinc-400 space-y-1">
        <li>📄 App.tsx – 3 matches</li>
        <li>📄 Sidebar.tsx – 1 match</li>
        <li>📄 main.tsx – 2 matches</li>
      </ul>
    </div>
  );
};

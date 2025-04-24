// src/components/layout/sidebar/panels/StarredPanel.tsx
import React from "react";

export const StarredPanel: React.FC = () => {
  return (
    <div role="tabpanel">
      <div className="font-bold mb-2">Starred</div>
      <ul className="text-xs text-zinc-300 space-y-1">
        <li>📄 main.rs</li>
        <li>📁 /src/components/</li>
        <li>📄 /README.md</li>
      </ul>
      <div className="mt-2 text-xs opacity-50">Drag files here to pin</div>
    </div>
  );
};

// src/components/layout/sidebar/panels/ExplorerPanel.tsx
import React from "react";

export const ExplorerPanel: React.FC = () => {
  return (
    <div>
      <div className="font-bold mb-2">Explorer</div>
      <ul className="space-y-1 text-xs">
        <li>📁 src/</li>
        <li>📄 README.md</li>
        <li>📄 bun.config.ts</li>
      </ul>
    </div>
  );
};

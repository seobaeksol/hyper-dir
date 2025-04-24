// src/components/layout/sidebar/panels/GitPanel.tsx
import React from "react";

export const GitPanel: React.FC = () => {
  return (
    <div role="tabpanel">
      <div className="font-bold mb-2">Git</div>
      <div className="text-xs mb-2 text-zinc-400">Uncommitted Changes</div>
      <ul className="text-xs space-y-1">
        <li className="text-red-400">M src/components/Panel.tsx</li>
        <li className="text-green-400">A src/utils/git.ts</li>
        <li className="text-yellow-400">R README.md → README.old.md</li>
      </ul>
      <div className="mt-4 text-xs text-zinc-500">
        Last Commit: `fix layout bugs`
      </div>
    </div>
  );
};

// src/components/layout/sidebar/panels/ConfigPanel.tsx
import React from "react";

export const ConfigPanel: React.FC = () => {
  return (
    <div>
      <div className="font-bold mb-2">Settings</div>
      <ul className="text-xs space-y-2">
        <li>
          <label className="flex items-center justify-between">
            <span>Dark Mode</span>
            <input type="checkbox" checked readOnly />
          </label>
        </li>
        <li>
          <label className="flex items-center justify-between">
            <span>Use Vim Keys</span>
            <input type="checkbox" />
          </label>
        </li>
        <li>
          <label className="flex items-center justify-between">
            <span>Auto Save</span>
            <input type="checkbox" />
          </label>
        </li>
      </ul>
    </div>
  );
};

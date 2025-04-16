// src/components/layout/Statusbar.tsx
import React from "react";

export const Statusbar: React.FC = () => {
  return (
    <div className="h-6 bg-zinc-800 text-xs text-white px-3 flex items-center justify-between border-t border-zinc-700">
      <div className="opacity-50">📂 3 items</div>
      <div className="opacity-50">⌨️ INSERT | UTF-8 | Windows</div>
    </div>
  );
};

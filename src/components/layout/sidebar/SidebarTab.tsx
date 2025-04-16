// src/components/layout/sidebar/SidebarTab.tsx
import React from "react";

interface SidebarTabProps {
  icon: string;
  active: boolean;
  onClick: () => void;
}

export const SidebarTab: React.FC<SidebarTabProps> = ({ icon, active, onClick }) => {
  return (
    <button
      className={`w-8 h-8 text-lg flex items-center justify-center rounded hover:bg-zinc-700 ${
        active ? "bg-zinc-600" : ""
      }`}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

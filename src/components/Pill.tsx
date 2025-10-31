import React from "react";

export function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick?: () => void }) {
  const stateClass = active ? "bg-black text-white border-black" : "bg-white border-gray-300 hover:bg-gray-50";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full border text-sm transition shadow-sm focus:outline-none focus:ring-2 ${stateClass}`}
    >
      {children}
    </button>
  );
}


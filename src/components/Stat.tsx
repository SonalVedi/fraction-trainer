import React from "react";

export function Stat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center p-3 rounded-xl bg-gray-50 min-w-[110px]">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}


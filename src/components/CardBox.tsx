import React from "react";

export function CardBox({ children }: { children: React.ReactNode }) {
  return <div className="bg-white border rounded-2xl p-5 shadow-sm">{children}</div>;
}


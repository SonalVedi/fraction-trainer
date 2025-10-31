import React from "react";
import { Fraction } from "../types";
import { simplify } from "../utils/fraction";

export function FractionText({ f, className = "" }: { f: Fraction; className?: string }) {
  const s = simplify(f.n, f.d);
  return (
    <span className={`inline-flex flex-col items-center leading-tight ${className}`} aria-label={`${s.n} over ${s.d}`}>
      <span className="text-2xl md:text-3xl font-medium">{s.n}</span>
      <span className="block w-full h-0.5 bg-current my-0.5" />
      <span className="text-2xl md:text-3xl font-medium">{s.d}</span>
    </span>
  );
}


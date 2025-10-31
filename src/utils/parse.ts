import { Fraction } from "../types";
import { simplify } from "./fraction";

export function parseAnswer(s: string): Fraction | null {
  s = s.trim().replace(/\s+/g, " ");
  if (!s) return null;
  let m = s.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
  if (m) {
    const sign = m[1] === "-" ? -1 : 1;
    const W = parseInt(m[2], 10), N = parseInt(m[3], 10), D = parseInt(m[4], 10);
    if (D === 0) return null;
    return simplify(sign * (W * D + N), D);
  }
  if (/^-?\d+$/.test(s)) {
    return { n: parseInt(s, 10), d: 1 };
  }
  m = s.match(/^\s*(-?\d+)\s*\/\s*(-?\d+)\s*$/);
  if (m) {
    const n = parseInt(m[1], 10);
    const d = parseInt(m[2], 10);
    if (d === 0) return null;
    return simplify(n, d);
  }
  return null;
}

export function clampInt(v: number, min: number, max: number) {
  if (isNaN(v)) return min;
  return Math.max(min, Math.min(max, Math.round(v)));
}

export function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds * 1000) % 1000);
  return `${m}:${s.toString().padStart(2, "0")}.${Math.floor(ms / 10).toString().padStart(2, "0")}`;
}


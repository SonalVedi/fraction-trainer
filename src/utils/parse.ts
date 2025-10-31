import { Fraction } from "../types";
import { simplify } from "./fraction";

export function parseAnswer(s: string): Fraction | null {
  const str = s.trim().replace(/\s+/g, " ");
  if (!str) return null;

  // mixed number: -?W N/D
  let m = str.match(/^(-?)(\d+)\s+(\d+)\/(\d+)$/);
  if (m) {
    const [, signStr, wStr, nStr, dStr] = m; // destructure
    if (!wStr || !nStr || !dStr) return null; // TS-safe guard

    const sign = signStr === "-" ? -1 : 1;
    const W = Number.parseInt(wStr, 10);
    const N = Number.parseInt(nStr, 10);
    const D = Number.parseInt(dStr, 10);
    if (!Number.isFinite(W) || !Number.isFinite(N) || !Number.isFinite(D) || D === 0) return null;

    return simplify(sign * (W * D + N), D);
  }

  // integer
  if (/^-?\d+$/.test(str)) {
    return { n: Number.parseInt(str, 10), d: 1 };
  }

  // simple fraction a/b
  m = str.match(/^\s*(-?\d+)\s*\/\s*(-?\d+)\s*$/);
  if (m) {
    const [, nStr, dStr] = m;
    if (!nStr || !dStr) return null;

    const n = Number.parseInt(nStr, 10);
    const d = Number.parseInt(dStr, 10);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return null;

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


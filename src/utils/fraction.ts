import { Fraction } from "../types";

export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a || 1;
}

export function simplify(n: number, d: number) {
  if (d === 0) throw new Error("Denominator cannot be 0");
  if (n === 0) return { n: 0, d: 1 };
  const sign = (n < 0) !== (d < 0) ? -1 : 1;
  n = Math.abs(n); d = Math.abs(d);
  const g = gcd(n, d);
  return { n: sign * (n / g), d: d / g };
}

export function multiply(a: Fraction, b: Fraction): Fraction {
  const { n, d } = simplify(a.n * b.n, a.d * b.d);
  return { n, d };
}

export function divide(a: Fraction, b: Fraction): Fraction {
  const { n, d } = simplify(a.n * b.d, a.d * b.n);
  return { n, d };
}

export function equalFrac(a: Fraction, b: Fraction): boolean {
  const aa = simplify(a.n, a.d);
  const bb = simplify(b.n, b.d);
  return aa.n === bb.n && aa.d === bb.d;
}

export function toPretty(f: Fraction): string {
  const s = simplify(f.n, f.d);
  return `${s.n}/${s.d}`;
}


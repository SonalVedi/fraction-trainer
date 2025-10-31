// Fraction types and related
export type Fraction = { n: number; d: number };
export type Operation = "×" | "÷";
export type Question = { a: Fraction; b: Fraction; op: Operation; answer: Fraction };
export type Settings = {
  operations: Operation[];
  maxNumerator: number;
  maxDenominator: number;
  testCount: number;
  allowMixed: boolean;
  allowNegatives: boolean;
  targetTimeSec: number | null;
};
export type TestRecord = { id: string; date: string; count: number; correct: number; secs: number };
export type PBs = { bestStreak?: number; bestScorePct?: number; bestTimeSec?: number };


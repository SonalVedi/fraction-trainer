import { Fraction, Operation, Question, Settings } from "../types";
import { simplify, multiply, divide } from "./fraction";

export function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateFraction(maxNum: number, maxDen: number, allowMixed: boolean, allowNegatives: boolean): Fraction {
  const d = randInt(1, maxDen);
  let n = randInt(1, maxNum);
  if (allowMixed && Math.random() < 0.35) n += d * randInt(1, 2);
  const sign = allowNegatives && Math.random() < 0.25 ? -1 : 1;
  return simplify(sign * n, d);
}

export function generateQuestion(settings: Settings): Question {
  const op: Operation = settings.operations.length === 2 ? (Math.random() < 0.5 ? "×" : "÷") : settings.operations[0];
  const a = generateFraction(settings.maxNumerator, settings.maxDenominator, settings.allowMixed, settings.allowNegatives);
  let b = generateFraction(settings.maxNumerator, settings.maxDenominator, settings.allowMixed, settings.allowNegatives);
  if (op === "÷" && b.n === 0) b.n = 1;
  const answer = op === "×" ? multiply(a, b) : divide(a, b);
  return { a, b, op, answer: simplify(answer.n, answer.d) };
}


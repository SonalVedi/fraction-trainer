import React from "react";
import { Question } from "../types";
import { FractionText } from "./FractionText";

export function QuestionText({ q }: { q: Question }) {
  return (
    <span className="inline-flex items-center gap-2">
      <FractionText f={q.a} />
      <span>{q.op}</span>
      <FractionText f={q.b} />
    </span>
  );
}


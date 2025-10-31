import React, { useEffect, useRef, useState } from "react";
import { Settings, PBs, Question, Fraction, Operation } from "../types";
import { generateQuestion } from "../utils/random";
import { equalFrac, toPretty, simplify } from "../utils/fraction";
import { parseAnswer } from "../utils/parse";
import { loadPBs, savePBs } from "../utils/persist";
import { CardBox } from "../components/CardBox";
import { Stat } from "../components/Stat";
import { FractionText } from "../components/FractionText";
import { Pill } from "../components/Pill";
import { AnimatePresence, motion } from "framer-motion";

export function Practice({ settings, resetToken }: { settings: Settings; resetToken: number }) {
  const [q, setQ] = useState<Question>(() => generateQuestion(settings));
  const [input, setInput] = useState("");
  const [result, setResult] = useState<null | { correct: boolean; user: Fraction }>(null);
  const [count, setCount] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [lastTime, setLastTime] = useState<number | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [steps, setSteps] = useState<React.ReactNode[]>([]);
  const [streak, setStreak] = useState(0);
  const [pbs, setPBs] = useState<PBs>(() => loadPBs());
  const startRef = useRef<number>(performance.now());
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, [q]);

  useEffect(() => {
    setCount(0);
    setCorrect(0);
    setLastTime(null);
    setShowSteps(false);
    setSteps([]);
    setStreak(0);
    setPBs({});
    try { savePBs({}); } catch {}
  }, [resetToken]);

  function submit() {
    const parsed = parseAnswer(input);
    if (!parsed) return;
    const ok = equalFrac(parsed, q.answer);
    setResult({ correct: ok, user: parsed });
    const now = performance.now();
    const secs = (now - startRef.current) / 1000;
    setLastTime(secs);
    setCount((c) => c + 1);
    setCorrect((c) => c + (ok ? 1 : 0));
    setShowSteps(false);
    setSteps(explainSteps(q.a, q.b, q.op));
    const nextStreak = ok ? streak + 1 : 0;
    setStreak(nextStreak);
    const nextPBs: PBs = { ...pbs };
    if (!pbs.bestStreak || nextStreak > pbs.bestStreak) nextPBs.bestStreak = nextStreak;
    if (!pbs.bestTimeSec || secs < pbs.bestTimeSec) nextPBs.bestTimeSec = secs;
    setPBs(nextPBs);
    savePBs(nextPBs);
  }

  function nextQuestion() {
    setQ(generateQuestion(settings));
    setInput("");
    setResult(null);
    setShowSteps(false);
    setSteps([]);
    startRef.current = performance.now();
    inputRef.current?.focus();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter") submit();
      if (e.key.toLowerCase() === "n") nextQuestion();
      if (e.key.toLowerCase() === "s" && result) setShowSteps((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const accuracy = count ? Math.round((100 * correct) / count) : 0;

  return (
    <div className="mt-6 grid md:grid-cols-[1fr,320px] gap-6">
      <CardBox>
        <div className="text-sm text-gray-500">Solve the problem. You can enter integers, fractions, or mixed numbers (e.g., 1 3/4, -2).</div>
        <div className="mt-4 text-3xl font-semibold flex items-center gap-4">
          <FractionText f={q.a} />
          <span>{q.op}</span>
          <FractionText f={q.b} />
          <span>=</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              // Allow: numbers, /, -, navigation, backspace, delete, enter, tab
              if (
                !(
                  (e.key >= '0' && e.key <= '9') ||
                  e.key === '/' ||
                  e.key === '-' ||
                  e.key === 'Backspace' ||
                  e.key === 'Delete' ||
                  e.key === 'ArrowLeft' ||
                  e.key === 'ArrowRight' ||
                  e.key === 'ArrowUp' ||
                  e.key === 'ArrowDown' ||
                  e.key === 'Tab' ||
                  e.key === 'Enter' ||
                  e.ctrlKey ||
                  e.metaKey
                )
              ) {
                e.preventDefault();
              }
            }}
            placeholder="e.g., 3/4 or 1 1/2 or -2"
            className="text-xl border rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-black/20"
            aria-label="Your answer"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={submit} className="px-4 py-2 rounded-xl bg-black text-white" aria-keyshortcuts="Enter">Check</button>
          <button onClick={nextQuestion} className="px-4 py-2 rounded-xl border" aria-keyshortcuts="N">Next</button>
          {result && <button onClick={() => setShowSteps((v) => !v)} className="px-4 py-2 rounded-xl border" aria-keyshortcuts="S">{showSteps ? "Hide steps" : "Show steps"}</button>}
        </div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="mt-4">
              {result.correct ? (
                <div className="p-3 rounded-xl bg-green-50 border border-green-200">✅ Correct!</div>
              ) : (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                  ❌ Not quite. Correct answer is <span className="font-semibold">{toPretty(q.answer)}</span>
                </div>
              )}
              {lastTime != null && (
                <div className="mt-2 text-sm text-gray-600">Time: {lastTime.toFixed(1)}s</div>
              )}
              {showSteps && steps.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-gray-50 border text-sm leading-relaxed">
                  <div className="font-semibold mb-1">Steps</div>
                  <ol className="list-decimal pl-5 space-y-1">
                    {steps.map((s, i) => <li key={i}>{s}</li>)}
                  </ol>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardBox>

      <aside className="flex flex-col gap-3">
        <Stat label="Answered" value={count} />
        <Stat label="Correct" value={`${correct}`} />
        <Stat label="Accuracy" value={`${accuracy}%`} />
        {lastTime != null && <Stat label="Last time" value={`${lastTime.toFixed(1)}s`} />}
        <Stat label="Streak" value={streak} />
        {pbs.bestStreak != null && <Stat label="Best Streak" value={pbs.bestStreak} />}
        {pbs.bestTimeSec != null && <Stat label="Best Time/Q" value={`${pbs.bestTimeSec.toFixed(2)}s`} />}
      </aside>
    </div>
  );
}

export function explainSteps(a: Fraction, b: Fraction, op: Operation): React.ReactNode[] {
  const lines: React.ReactNode[] = [];
  const sa = simplify(a.n, a.d); const sb = simplify(b.n, b.d);
  const Frac = ({ f }: { f: Fraction }) => <FractionText f={f} className="inline-flex align-middle" />;

  if (op === "×") {
    const prod = { n: sa.n * sb.n, d: sa.d * sb.d };
    const simp = simplify(prod.n, prod.d);
    lines.push(<span key="mul-msg">Multiply numerator by numerator and denominator by denominator.</span>);
    lines.push(
      <span key="mul-eq" className="inline-flex items-center gap-2">
        <Frac f={sa} /> <span>×</span> <Frac f={sb} /> <span>=</span> <Frac f={prod} />
      </span>
    );
    if (simp.n !== prod.n || simp.d !== prod.d) {
      lines.push(
        <span key="mul-simp" className="inline-flex items-center gap-2">
          <span>Simplify:</span> <Frac f={prod} /> <span>→</span> <Frac f={simp} />
        </span>
      );
    }
  } else {
    const rec = { n: sb.d, d: sb.n };
    const prod = { n: sa.n * rec.n, d: sa.d * rec.d };
    const simp = simplify(prod.n, prod.d);
    lines.push(
      <span key="div-recip" className="inline-flex items-center gap-2">
        <span>Division is multiply by reciprocal:</span> <Frac f={sa} /> <span>÷</span> <Frac f={sb} /> <span>=</span> <Frac f={sa} /> <span>×</span> <Frac f={rec} />
      </span>
    );
    lines.push(<span key="div-mul-msg">Now multiply numerator by numerator and denominator by denominator.</span>);
    lines.push(
      <span key="div-eq" className="inline-flex items-center gap-2">
        <Frac f={sa} /> <span>×</span> <Frac f={rec} /> <span>=</span> <Frac f={prod} />
      </span>
    );
    if (simp.n !== prod.n || simp.d !== prod.d) {
      lines.push(
        <span key="div-simp" className="inline-flex items-center gap-2">
          <span>Simplify:</span> <Frac f={prod} /> <span>→</span> <Frac f={simp} />
        </span>
      );
    }
  }
  return lines;
}

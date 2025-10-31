import React, { useEffect, useMemo, useRef, useState } from "react";
import { Settings, TestRecord, Question, Fraction } from "../types";
import { generateQuestion } from "../utils/random";
import { equalFrac, toPretty } from "../utils/fraction";
import { parseAnswer, formatTime } from "../utils/parse";
import { loadHistory, saveHistory } from "../utils/persist";
import { CardBox } from "../components/CardBox";
import { Stat } from "../components/Stat";
import { FractionText } from "../components/FractionText";
import { QuestionText } from "../components/QuestionText";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

// Type for recharts Tooltip formatter
interface TooltipFormatter {
  (value: number, name: string, props: unknown): [string, string];
}

export function TimedTest({ settings, resetToken }: { settings: Settings; resetToken: number }) {
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);
  const [items, setItems] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(Fraction | null)[]>([]);
  const [input, setInput] = useState("");
  const [start, setStart] = useState<number | null>(null);
  const [finishedAt, setFinishedAt] = useState<number | null>(null);
  const [nowTs, setNowTs] = useState<number>(performance.now());
  const [history, setHistory] = useState<TestRecord[]>(() => loadHistory());

  useEffect(() => {
    setHistory([]);
    setItems([]);
    setAnswers([]);
    setIdx(0);
    setInput("");
    setRunning(false);
    setStart(null);
    setFinishedAt(null);
    saveHistory([]);
  }, [resetToken]);

  const inputRef = useRef<HTMLInputElement>(null);

  const total = settings.testCount;

  const timeElapsed = useMemo(() => {
    const now = finishedAt ?? nowTs;
    if (!start) return 0;
    return (now - start) / 1000;
  }, [nowTs, finishedAt, start]);

  useEffect(() => {
    if (!running || finishedAt) return;
    let raf: number;
    const loop = () => {
      setNowTs(performance.now());
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running, finishedAt]);

  function startTest() {
    const qs = Array.from({ length: total }, () => generateQuestion(settings));
    setItems(qs);
    setAnswers(Array(total).fill(null));
    setIdx(0);
    setInput("");
    setRunning(true);
    const t = performance.now();
    setStart(t);
    setFinishedAt(null);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function submitAnswer() {
    const parsed = parseAnswer(input);
    if (!parsed) return;
    const next = [...answers];
    next[idx] = parsed;
    setAnswers(next);
    if (idx + 1 < total) {
      setIdx(idx + 1);
      setInput("");
      inputRef.current?.focus();
    } else {
      const end = performance.now();
      setFinishedAt(end);
      setRunning(false);
      const secs = (end - (start || end)) / 1000;
      const correct = next.reduce((acc, a, i) => acc + (a && items[i] && equalFrac(a, items[i].answer) ? 1 : 0), 0);
      const rec: TestRecord = { id: `${Date.now()}`, date: new Date().toISOString(), count: items.length, correct, secs };
      const newHist = [...history, rec];
      setHistory(newHist);
      saveHistory(newHist);
    }
  }

  const tooltipFormatter: TooltipFormatter = (v, n) => n === "pct" ? [`${v}%`, "Score"] : [`${formatTime(v)}`, "Time"];

  if (!running && items.length === 0) {
    return (
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-semibold">Timed Test</div>
            <div className="text-sm opacity-80">You will get {total} questions. Your time starts when you press Start.</div>
          </div>
          <div className="flex gap-2">
            <button onClick={startTest} className="px-4 py-2 rounded-xl bg-black text-white">Start Test</button>
          </div>
        </div>
        {history.length > 0 && (
          <div className="mt-5">
            <div className="text-sm font-semibold mb-2">Progress (past tests)</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={history.map((r, i) => ({ idx: i + 1, pct: Math.round((100 * r.correct) / r.count), secs: r.secs }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="idx" tickCount={Math.min(10, history.length)} />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="pct" name="Score %" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="secs" name="Time (s)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardBox>
    );
  }

  if (!running && items.length > 0 && finishedAt) {
    const secs = timeElapsed;
    const correctN = answers.reduce((acc, ans, i) => (ans && items[i] && equalFrac(ans, items[i].answer) ? 1 : 0) + acc, 0);
    const pct = Math.round((100 * correctN) / items.length);
    const beatTarget = settings.targetTimeSec != null ? secs <= settings.targetTimeSec : null;
    return (
      <div className="flex flex-col gap-4">
        <CardBox>
          <div className="flex flex-wrap gap-3 items-center">
            <Stat label="Questions" value={items.length} />
            <Stat label="Correct" value={`${correctN}`} />
            <Stat label="Score" value={`${pct}%`} />
            <Stat label="Time" value={`${formatTime(secs)}`} />
            {settings.targetTimeSec != null && (<Stat label="Target" value={`${formatTime(settings.targetTimeSec)}`} />)}
            {beatTarget != null && (<Stat label="Challenge" value={beatTarget ? "🏁 Beat it" : "⏳ Try again"} />)}
          </div>
        </CardBox>

        {history.length > 0 && (
          <CardBox>
            <div className="text-sm font-semibold mb-2">Progress (past tests)</div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={history.map((r, i) => ({ idx: i + 1, pct: Math.round((100 * r.correct) / r.count), secs: r.secs }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="idx" tickCount={Math.min(10, history.length)} />
                  <YAxis yAxisId="left" domain={[0, 100]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip formatter={tooltipFormatter} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="pct" name="Score %" strokeWidth={2} dot={false} />
                  <Line yAxisId="right" type="monotone" dataKey="secs" name="Time (s)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBox>
        )}

        <CardBox>
          <div className="text-lg font-semibold mb-3">Answer Review</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left opacity-80">
                  <th className="px-2">#</th>
                  <th className="px-2">Question</th>
                  <th className="px-2">Your Answer</th>
                  <th className="px-2">Correct Answer</th>
                  <th className="px-2">Result</th>
                </tr>
              </thead>
              <tbody>
                {items.map((q, i) => {
                  const ans = answers[i];
                  const ok = ans && equalFrac(ans, q.answer);
                  return (
                    <tr key={i} className="bg-gray-50">
                      <td className="px-2 py-2 font-mono">{i + 1}</td>
                      <td className="px-2 py-2"><QuestionText q={q} /></td>
                      <td className="px-2 py-2">{ans ? toPretty(ans) : <span className="opacity-50">—</span>}</td>
                      <td className="px-2 py-2">{toPretty(q.answer)}</td>
                      <td className="px-2 py-2">{ok ? "✅" : "❌"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardBox>

        <div className="flex gap-2">
          <button onClick={startTest} className="px-4 py-2 rounded-xl bg-black text-white">Retake Test</button>
          <button onClick={() => { setItems([]); setAnswers([]); setFinishedAt(null); }} className="px-4 py-2 rounded-xl border">Reset</button>
        </div>
      </div>
    );
  }

  const q = items[idx];

  if (!q) return null;

  return (
    <CardBox>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Stat label="Q" value={`${idx + 1}/${total}`} />
          <Stat label="Time" value={formatTime(timeElapsed)} />
        </div>
        <div className="text-sm opacity-80">Answer using <span className="font-mono">a/b</span>, integer <span className="font-mono">2</span>, or mixed <span className="font-mono">1 3/4</span>.</div>
      </div>

      <div className="mt-6 text-3xl font-semibold flex items-center gap-4">
        <FractionText f={q.a} />
        <span>{q.op}</span>
        <FractionText f={q.b} />
        <span>=</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); submitAnswer(); return; }
            // Allow: numbers, /, -, navigation, backspace, delete, tab
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
                e.ctrlKey ||
                e.metaKey
              )
            ) {
              e.preventDefault();
            }
          }}
          placeholder="e.g., 7/8 or -1 1/2"
          className="text-xl border rounded-lg px-3 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-black/20"
          aria-label="Your answer"
        />
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={submitAnswer} className="px-4 py-2 rounded-xl bg-black text-white">Submit</button>
      </div>
    </CardBox>
  );
}

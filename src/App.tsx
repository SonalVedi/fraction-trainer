import React, { useEffect, useState } from "react";
import { Settings } from "./types";
import { Pill } from "./components/Pill";
import { SettingsPanel } from "./panels/SettingsPanel";
import { Practice } from "./panels/Practice";
import { TimedTest } from "./panels/TimedTest";
import { runSelfTests } from "./utils/selfTest";

const DEFAULT_SETTINGS: Settings = {
  operations: ["×", "÷"],
  maxNumerator: 12,
  maxDenominator: 12,
  testCount: 20,
  allowMixed: false,
  allowNegatives: false,
  targetTimeSec: null,
};

const LS_SETTINGS = "fractionTrainer.settings";

export default function App() {
  const [tab, setTab] = useState<"practice" | "test">("practice");
  const [settings, setSettings] = useState<Settings>(() => {
    try {
      const raw = localStorage.getItem(LS_SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [resetToken, setResetToken] = useState(0);

  useEffect(() => { localStorage.setItem(LS_SETTINGS, JSON.stringify(settings)); }, [settings]);
  useEffect(() => { try { runSelfTests(); } catch {} }, []);

  function handleResetMetrics() {
    const ok = window.confirm("Reset all metrics (past tests, best streak, best time per question)? This cannot be undone.");
    if (!ok) return;
    try {
      localStorage.removeItem("fractionTrainer.tests");
      localStorage.removeItem("fractionTrainer.pbs");
      localStorage.setItem("fractionTrainer.tests", JSON.stringify([]));
      localStorage.setItem("fractionTrainer.pbs", JSON.stringify({}));
    } catch {}
    setResetToken((t) => t + 1);
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white text-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Fraction Practice & Test</h1>
          <div className="flex items-center gap-2">
            <Pill active={tab === "practice"} onClick={() => setTab("practice")}>Practice</Pill>
            <Pill active={tab === "test"} onClick={() => setTab("test")}>Timed Test</Pill>
            <button
              onClick={handleResetMetrics}
              className="ml-2 px-3 py-1 rounded-full border text-sm hover:bg-red-50 hover:border-red-300"
              title="Reset best streak, best time per question, and test history"
            >
              Reset metrics
            </button>
          </div>
        </header>

        <SettingsPanel settings={settings} setSettings={setSettings} />

        <main className="mt-6">
          {tab === "practice" ? (
            <Practice settings={settings} resetToken={resetToken} />
          ) : (
            <TimedTest settings={settings} resetToken={resetToken} />
          )}
        </main>

        <footer className="mt-10 text-center text-xs opacity-70">
          Tip: Press <kbd className="px-1 py-0.5 border rounded">Enter</kbd> to submit, <kbd className="px-1 py-0.5 border rounded">N</kbd> for next, <kbd className="px-1 py-0.5 border rounded">S</kbd> to toggle steps.
        </footer>
      </div>
    </div>
  );
}

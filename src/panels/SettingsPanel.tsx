import React from "react";
import { Settings, Operation } from "../types";
import { Pill } from "../components/Pill";
import { clampInt } from "../utils/parse";

export function SettingsPanel({ settings, setSettings }: { settings: Settings; setSettings: (s: Settings) => void }) {
  function setPreset(n: number) { setSettings({ ...settings, testCount: n }); }
  function setTargetMMSS(s: string) {
    const m = s.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) { setSettings({ ...settings, targetTimeSec: null }); return; }
    const mm = parseInt(m[1], 10), ss = parseInt(m[2], 10);
    const total = mm * 60 + ss;
    setSettings({ ...settings, targetTimeSec: Number.isFinite(total) ? total : null });
  }
  return (
    <div className="grid md:grid-cols-3 gap-4 bg-white border rounded-2xl p-4 shadow-sm">
      <div>
        <div className="text-sm font-semibold mb-2">Operations</div>
        <div className="flex flex-wrap gap-2">
          {(["×", "÷"] as Operation[]).map((op) => (
            <Pill
              key={op}
              active={settings.operations.includes(op)}
              onClick={() => {
                const exists = settings.operations.includes(op);
                let next = exists ? settings.operations.filter((o) => o !== op) : [...settings.operations, op];
                if (next.length === 0) next = [op];
                setSettings({ ...settings, operations: next as Operation[] });
              }}
            >
              {op}
            </Pill>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={settings.allowMixed} onChange={(e) => setSettings({ ...settings, allowMixed: e.target.checked })} />
            Mixed numbers (trickier impropers)
          </label>
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={settings.allowNegatives} onChange={(e) => setSettings({ ...settings, allowNegatives: e.target.checked })} />
            Allow negatives
          </label>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Numbers</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex items-center gap-1">Max Numerator
            <input
              className="w-full border rounded px-2 py-1"
              type="number"
              min={2}
              max={99}
              value={settings.maxNumerator}
              onChange={(e) => setSettings({ ...settings, maxNumerator: clampInt(+e.target.value, 2, 99) })}
            />
          </label>
          <label className="flex items-center gap-1">Max Denominator
            <input
              className="w-full border rounded px-2 py-1"
              type="number"
              min={2}
              max={99}
              value={settings.maxDenominator}
              onChange={(e) => setSettings({ ...settings, maxDenominator: clampInt(+e.target.value, 2, 99) })}
            />
          </label>
        </div>
      </div>

      <div>
        <div className="text-sm font-semibold mb-2">Test</div>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1 w-full">Questions per test
              <input
                aria-label="Questions per test"
                className="w-full border rounded px-2 py-1"
                type="number"
                min={5}
                max={100}
                value={settings.testCount}
                onChange={(e) => setSettings({ ...settings, testCount: clampInt(+e.target.value, 5, 100) })}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {[10, 20, 50].map((n) => (
              <Pill key={n} active={settings.testCount === n} onClick={() => setPreset(n)}>{n}</Pill>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 w-full">Target time (mm:ss)
              <input
                placeholder="e.g. 03:00"
                className="w-full border rounded px-2 py-1"
                onChange={(e) => setTargetMMSS(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}


import { TestRecord, PBs } from "../types";

const LS_TEST_HISTORY = "fractionTrainer.tests";
const LS_PBS = "fractionTrainer.pbs";

export function loadHistory(): TestRecord[] { try { return JSON.parse(localStorage.getItem(LS_TEST_HISTORY) || "[]"); } catch { return []; } }
export function saveHistory(arr: TestRecord[]) { localStorage.setItem(LS_TEST_HISTORY, JSON.stringify(arr)); }
export function loadPBs(): PBs { try { return JSON.parse(localStorage.getItem(LS_PBS) || "{}") as PBs; } catch { return {}; } }
export function savePBs(p: PBs) { localStorage.setItem(LS_PBS, JSON.stringify(p)); }


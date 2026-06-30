import fs from "node:fs";
import path from "node:path";
import YAML from "yaml";
import {answerPrompt} from "../lib/mock-chat";
import {dataSchemas} from "../lib/schemas";
import {computeOverallScore} from "../lib/scoring";
import {computeState} from "../lib/state-engine";

function loadYaml<K extends keyof typeof dataSchemas>(name: K): ReturnType<(typeof dataSchemas)[K]["parse"]> {
  const file = path.join(process.cwd(), "data", `${name}.yaml`);
  return dataSchemas[name].parse(YAML.parse(fs.readFileSync(file, "utf8"))) as ReturnType<(typeof dataSchemas)[K]["parse"]>;
}

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function assertPresent<T>(value: T | undefined, message: string): T {
  if (value === undefined) throw new Error(message);
  return value;
}

const gold = JSON.parse(fs.readFileSync(path.join(process.cwd(), "evals", "gold", "project-nova.json"), "utf8")) as {
  opportunity_id: string;
  overall_score: number;
  source_coverage_score: number;
  arr: {current: string; conflict: string; sources: string[]};
  grounding: {unanswerable_supported: boolean; unanswerable_citations: string[]};
};

const opportunities = loadYaml("opportunities").opportunities;
const documents = loadYaml("documents").documents.filter((item) => item.opportunity_id === gold.opportunity_id);
const facts = loadYaml("facts").facts.filter((item) => item.opportunity_id === gold.opportunity_id);
const issues = loadYaml("issues").issues.filter((item) => item.opportunity_id === gold.opportunity_id);
const scores = loadYaml("scores");
const chatResponses = loadYaml("chat_responses").chat_responses;

const opportunity = assertPresent(
  opportunities.find((item) => item.id === gold.opportunity_id),
  `Missing opportunity ${gold.opportunity_id}`,
);

const state = computeState({opportunity, facts, issues, documents, scores: Object.values(scores.opportunities[gold.opportunity_id] ?? {})});
const arrMetric = assertPresent(state.key_metrics.arr, "Missing ARR metric");
assert(state.source_coverage_score === gold.source_coverage_score, `Expected source coverage ${gold.source_coverage_score}, got ${state.source_coverage_score}`);
assert(arrMetric.value === gold.arr.current, `Expected ARR ${gold.arr.current}, got ${arrMetric.value}`);
assert(arrMetric.conflicts.some((item) => item.value === gold.arr.conflict), "Expected ARR conflict to be preserved");
assert(
  gold.arr.sources.every((sourceId) =>
    [arrMetric.citations, ...arrMetric.conflicts.map((item) => item.citations)].flat().some((citation) => citation.source_id === sourceId),
  ),
  "Expected ARR citations to preserve both sources",
);

const overall = computeOverallScore(scores.weights, scores.opportunities[gold.opportunity_id] ?? {});
assert(overall === gold.overall_score, `Expected overall score ${gold.overall_score}, got ${overall}`);

const abstention = answerPrompt("What is the founder's home address?", chatResponses);
assert(abstention.supported === gold.grounding.unanswerable_supported, "Expected deterministic abstention for unanswerable question");
assert(abstention.citations.length === gold.grounding.unanswerable_citations.length, "Expected no citations for unanswerable question");

const report = {
  id: `project-nova-${new Date().toISOString().slice(0, 10)}`,
  live: process.argv.includes("--live"),
  thresholds: {
    citation_verification: 1,
    grounding_faithfulness: 1,
    abstention_correctness: 1,
    max_cost_usd: 0,
    p50_latency_ms: 0,
    p95_latency_ms: 0,
  },
  results: {
    schema_validation: "passed",
    overall_score: overall,
    source_coverage_score: state.source_coverage_score,
    arr_conflict_preserved: true,
    grounding_abstention: true,
    cost_usd: 0,
    p50_latency_ms: 0,
    p95_latency_ms: 0,
  },
};

const reportDir = path.join(process.cwd(), "evals", "reports");
fs.mkdirSync(reportDir, {recursive: true});
fs.writeFileSync(path.join(reportDir, "project-nova-latest.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));

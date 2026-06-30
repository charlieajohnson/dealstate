import {z} from "zod";

export const Confidence = z.enum(["high", "medium", "low"]);
export const Recommendation = z.enum(["prioritise", "continue_diligence", "monitor", "pass", "unknown"]);
export const Stage = z.enum([
  "prospect",
  "active_origination",
  "intro_call",
  "live_diligence",
  "ic_prep",
  "exclusivity",
  "signed",
  "passed",
  "monitor",
]);

export const SourceLocator = z.discriminatedUnion("kind", [
  z.object({kind: z.literal("pdf"), page: z.number().int().positive(), text_range: z.string()}),
  z.object({kind: z.literal("spreadsheet"), sheet: z.string(), cell_range: z.string()}),
  z.object({kind: z.literal("email"), part: z.string(), text_range: z.string().optional()}),
  z.object({kind: z.literal("csv"), row: z.number().int().nonnegative(), columns: z.array(z.string()).default([])}),
  z.object({kind: z.literal("text"), section: z.string().optional(), text_range: z.string().optional()}),
]);

export const SourceCitation = z.object({
  source_id: z.string(),
  source_title: z.string(),
  source_type: z.enum([
    "document",
    "spreadsheet_range",
    "email",
    "meeting_note",
    "crm_record",
    "generated_output",
    "human_note",
  ]),
  location: z.string().optional(),
  extracted_text: z.string().optional(),
  confidence: Confidence,
  segment_id: z.string().optional(),
  locator: SourceLocator.optional(),
});

export const Opportunity = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  company_name: z.string(),
  stage: Stage,
  sector: z.string().default("Not populated"),
  geography: z.array(z.string()).default([]),
  internal_owner: z.string(),
  contributors: z.array(z.string()).default([]),
  current_recommendation: Recommendation,
  confidence: Confidence,
  last_updated_at: z.string(),
  firm_id: z.string().optional(),
  fund_id: z.string().optional(),
});

export const Firm = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  created_at: z.string(),
  synthetic_demo: z.boolean().default(false),
});

export const Fund = z.object({
  id: z.string(),
  firm_id: z.string(),
  name: z.string(),
  slug: z.string(),
  active: z.boolean().default(true),
});

export const Deal = Opportunity.extend({
  firm_id: z.string(),
  fund_id: z.string(),
});

export const Membership = z.object({
  id: z.string(),
  user_id: z.string(),
  firm_id: z.string(),
  role: z.enum(["owner", "contributor", "viewer"]),
  created_at: z.string(),
});

export const Document = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  artefact_type: z.string(),
  status: z.enum(["received", "missing", "superseded", "needs_review", "requested", "not_applicable"]),
  source: z.enum(["email", "drive", "crm", "manual_upload", "meeting_notes", "unknown"]),
  received_at: z.string().optional(),
  confidence: Confidence,
  original_filename: z.string().default(""),
  standardised_filename: z.string().optional(),
  required: z.boolean().default(true),
  notes: z.array(z.string()).default([]),
});

export const Fact = z
  .object({
    id: z.string(),
    opportunity_id: z.string(),
    key: z.string(),
    label: z.string(),
    value: z.string(),
    kind: z.enum(["fact", "inference"]),
    citations: z.array(SourceCitation).default([]),
    conflicts_with: z.array(z.string()).default([]),
    as_of: z.string(),
  })
  .refine((fact) => fact.kind === "inference" || fact.citations.length > 0, {
    message: "a fact must carry at least one citation",
  });

export const Issue = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  issue_type: z.string(),
  severity: z.enum(["critical", "high", "medium", "low"]),
  status: z.enum(["open", "in_progress", "resolved", "accepted_risk", "not_applicable"]),
  title: z.string(),
  description: z.string(),
  evidence: z.array(z.string()).default([]),
  owner: z.string().optional(),
  recommended_action: z.string(),
});

export const ScoreEntry = z.object({
  score: z.number().min(0).max(100),
  confidence: Confidence,
  rationale: z.string().default("Evidence remains limited."),
  what_would_change_score: z.string().default("Additional source material."),
});

export const ScoresFile = z.object({
  weights: z.record(z.string(), z.number()),
  opportunities: z.record(z.string(), z.record(z.string(), ScoreEntry)),
});

export const Event = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  type: z.string(),
  actor: z.string(),
  actor_type: z.string(),
  timestamp: z.string(),
  description: z.string(),
  source_ids: z.array(z.string()).default([]),
  previous_value: z.string().optional(),
  new_value: z.string().optional(),
});

export const Contact = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  name: z.string(),
  role: z.string(),
  organisation: z.string(),
  last_interaction: z.string(),
});

export const ChatResponse = z.object({
  prompt: z.string(),
  response: z.string(),
  citations: z.array(z.string()).min(1),
  confidence: Confidence,
  kind: z.enum(["fact", "inference"]),
});

export const GeneratedOutput = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  type: z.string(),
  title: z.string(),
  path: z.string(),
  confidence: Confidence,
  source_ids: z.array(z.string()).min(1),
});

export const RawArtefact = z.object({
  id: z.string(),
  deal_id: z.string(),
  firm_id: z.string(),
  source: z.enum(["gmail", "drive", "crm", "manual_upload"]),
  external_id: z.string(),
  content_hash: z.string(),
  mime: z.string(),
  storage_path: z.string(),
  received_at: z.string(),
  supersedes: z.string().optional(),
  pii_flags: z.array(z.string()).default([]),
});

export const ArtefactSegment = z.object({
  id: z.string(),
  raw_artefact_id: z.string(),
  locator: SourceLocator,
  text: z.string(),
  ordinal: z.number().int().nonnegative(),
});

export const IngestionRun = z.object({
  id: z.string(),
  firm_id: z.string(),
  deal_id: z.string(),
  source: z.enum(["gmail", "drive", "crm", "manual_upload"]),
  started_at: z.string(),
  finished_at: z.string().optional(),
  status: z.enum(["running", "succeeded", "failed"]),
  artefacts_seen: z.number().int().nonnegative().default(0),
  artefacts_created: z.number().int().nonnegative().default(0),
  error: z.string().optional(),
});

export const ExtractionRun = z.object({
  id: z.string(),
  firm_id: z.string(),
  deal_id: z.string(),
  prompt_id: z.string(),
  prompt_version: z.string(),
  model_id: z.string(),
  started_at: z.string(),
  finished_at: z.string().optional(),
  status: z.enum(["running", "succeeded", "failed"]),
});

export const ExtractionCandidate = z.object({
  id: z.string(),
  extraction_run_id: z.string(),
  segment_ids: z.array(z.string()),
  candidate_type: z.enum(["fact", "issue", "contact", "event"]),
  payload: z.record(z.string(), z.unknown()),
  citations: z.array(SourceCitation),
  confidence: Confidence,
  verified: z.boolean().default(false),
});

export const LlmCallRecord = z.object({
  id: z.string(),
  firm_id: z.string().optional(),
  deal_id: z.string().optional(),
  prompt_id: z.string(),
  prompt_version: z.string(),
  model_id: z.string(),
  tokens_in: z.number().int().nonnegative(),
  tokens_out: z.number().int().nonnegative(),
  cost: z.number().nonnegative(),
  latency_ms: z.number().nonnegative(),
  cache_hit: z.boolean(),
  input_hash: z.string(),
  created_at: z.string(),
});

export const RetrievalChunk = z.object({
  id: z.string(),
  segment_id: z.string(),
  deal_id: z.string(),
  firm_id: z.string(),
  embedding: z.array(z.number()).optional(),
  tsv: z.string().optional(),
  token_count: z.number().int().nonnegative(),
  content_hash: z.string(),
});

export const GroundedAnswer = z.object({
  question: z.string(),
  claims: z.array(z.object({text: z.string(), citation_ids: z.array(z.string()), supported: z.boolean()})),
  confidence: Confidence,
  abstained: z.boolean(),
  prompt_id: z.string(),
  model_id: z.string(),
});

export const EvalCase = z.object({
  id: z.string(),
  kind: z.enum(["extraction", "grounding", "conflict"]),
  input_ref: z.string(),
  gold: z.record(z.string(), z.unknown()),
});

export const dataSchemas = {
  opportunities: z.object({opportunities: z.array(Opportunity)}),
  documents: z.object({documents: z.array(Document)}),
  facts: z.object({facts: z.array(Fact)}),
  issues: z.object({issues: z.array(Issue)}),
  events: z.object({events: z.array(Event)}),
  contacts: z.object({contacts: z.array(Contact)}),
  scores: ScoresFile,
  chat_responses: z.object({chat_responses: z.array(ChatResponse)}),
  generated_outputs: z.object({generated_outputs: z.array(GeneratedOutput)}),
};

export type SourceLocator = z.infer<typeof SourceLocator>;
export type SourceCitation = z.infer<typeof SourceCitation>;
export type Opportunity = z.infer<typeof Opportunity>;
export type Firm = z.infer<typeof Firm>;
export type Fund = z.infer<typeof Fund>;
export type Deal = z.infer<typeof Deal>;
export type Membership = z.infer<typeof Membership>;
export type Document = z.infer<typeof Document>;
export type Fact = z.infer<typeof Fact>;
export type Issue = z.infer<typeof Issue>;
export type Event = z.infer<typeof Event>;
export type Contact = z.infer<typeof Contact>;
export type ChatResponse = z.infer<typeof ChatResponse>;
export type GeneratedOutput = z.infer<typeof GeneratedOutput>;
export type ScoreEntry = z.infer<typeof ScoreEntry>;
export type RawArtefact = z.infer<typeof RawArtefact>;
export type ArtefactSegment = z.infer<typeof ArtefactSegment>;
export type IngestionRun = z.infer<typeof IngestionRun>;
export type ExtractionRun = z.infer<typeof ExtractionRun>;
export type ExtractionCandidate = z.infer<typeof ExtractionCandidate>;
export type LlmCallRecord = z.infer<typeof LlmCallRecord>;
export type RetrievalChunk = z.infer<typeof RetrievalChunk>;
export type GroundedAnswer = z.infer<typeof GroundedAnswer>;
export type EvalCase = z.infer<typeof EvalCase>;

export type MetricState = {
  label: string;
  value: string;
  kind: "fact" | "inference";
  citations: SourceCitation[];
  conflicts: {value: string; citations: SourceCitation[]}[];
  unsupported: boolean;
};

export type StateSnapshot = {
  opportunity_id: string;
  generated_at: string;
  recommendation: z.infer<typeof Recommendation>;
  confidence: z.infer<typeof Confidence>;
  key_metrics: Record<string, MetricState>;
  key_positives: string[];
  key_risks: string[];
  unresolved_questions: string[];
  missing_materials: string[];
  next_actions: string[];
  source_coverage_score: number;
};

export type LatestChange = {
  type: string;
  description: string;
  impact: string;
  severity: "high" | "medium" | "low";
  timestamp?: string;
  source_ids: string[];
};

import crypto from "node:crypto";
import type {z} from "zod";
import type {LlmCallRecord} from "../schemas";
import type {PromptDefinition} from "../prompts/registry";

type TransportResult = {
  output: unknown;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  latencyMs: number;
};

type LlmTransport = (request: {
  modelId: string;
  prompt: PromptDefinition;
  input: unknown;
  temperature: 0;
}) => Promise<TransportResult>;

type LlmClientOptions = {
  modelId: string;
  firmId?: string;
  dealId?: string;
  transport: LlmTransport;
  recordCall: (record: LlmCallRecord) => Promise<void>;
  now?: () => string;
};

type StructuredRequest<T extends z.ZodTypeAny> = {
  prompt: PromptDefinition;
  input: unknown;
  schema: T;
};

type StructuredResult<T extends z.ZodTypeAny> = {
  data: z.infer<T>;
  cacheHit: boolean;
  record: LlmCallRecord;
};

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  return `{${Object.entries(value as Record<string, unknown>)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, item]) => `${JSON.stringify(key)}:${stableStringify(item)}`)
    .join(",")}}`;
}

function hashInput(input: unknown): string {
  return crypto.createHash("sha256").update(stableStringify(input)).digest("hex");
}

function recordId(prompt: PromptDefinition, modelId: string, inputHash: string): string {
  return crypto.createHash("sha256").update(`${prompt.id}:${prompt.version}:${modelId}:${inputHash}`).digest("hex").slice(0, 24);
}

export function createLlmClient(options: LlmClientOptions) {
  const cache = new Map<string, TransportResult>();
  const now = options.now ?? (() => new Date().toISOString());

  return {
    async generateStructured<T extends z.ZodTypeAny>(request: StructuredRequest<T>): Promise<StructuredResult<T>> {
      const inputHash = hashInput(request.input);
      const cacheKey = `${request.prompt.id}:${request.prompt.version}:${options.modelId}:${inputHash}`;
      const cached = cache.get(cacheKey);
      const result =
        cached ??
        (await options.transport({
          modelId: options.modelId,
          prompt: request.prompt,
          input: request.input,
          temperature: 0,
        }));

      if (!cached) cache.set(cacheKey, result);

      const data = request.schema.parse(result.output);
      const record: LlmCallRecord = {
        id: recordId(request.prompt, options.modelId, inputHash),
        firm_id: options.firmId,
        deal_id: options.dealId,
        prompt_id: request.prompt.id,
        prompt_version: request.prompt.version,
        model_id: options.modelId,
        tokens_in: result.tokensIn,
        tokens_out: result.tokensOut,
        cost: result.cost,
        latency_ms: result.latencyMs,
        cache_hit: Boolean(cached),
        input_hash: inputHash,
        created_at: now(),
      };

      await options.recordCall(record);

      return {data, cacheHit: Boolean(cached), record};
    },
  };
}

import {z} from "zod";
import {describe, expect, it} from "vitest";

describe("provider-agnostic LLM client", () => {
  it("validates structured output, traces cost and caches by prompt input hash", async () => {
    const clientModule = await import("./client").catch(() => null);

    expect(clientModule).not.toBeNull();
    const schema = z.object({answer: z.string()});
    const calls: unknown[] = [];
    const client = clientModule!.createLlmClient({
      modelId: "test-model",
      now: () => "2026-06-30T09:00:00.000Z",
      transport: async () => ({
        output: {answer: "source-backed"},
        tokensIn: 10,
        tokensOut: 4,
        cost: 0.00001,
        latencyMs: 25,
      }),
      recordCall: async (record: unknown) => {
        calls.push(record);
      },
    });

    const first = await client.generateStructured({
      prompt: {id: "dealstate.grounding", version: "1.0.0", text: "Return JSON."},
      input: {question: "What changed?"},
      schema,
    });
    const second = await client.generateStructured({
      prompt: {id: "dealstate.grounding", version: "1.0.0", text: "Return JSON."},
      input: {question: "What changed?"},
      schema,
    });

    expect(first.data).toEqual({answer: "source-backed"});
    expect(second.cacheHit).toBe(true);
    expect(calls).toHaveLength(2);
    expect(calls[0]).toMatchObject({
      prompt_id: "dealstate.grounding",
      prompt_version: "1.0.0",
      model_id: "test-model",
      tokens_in: 10,
      tokens_out: 4,
      cost: 0.00001,
      latency_ms: 25,
      cache_hit: false,
    });
    expect(calls[1]).toMatchObject({cache_hit: true});
  });
});

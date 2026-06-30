import {describe, expect, it} from "vitest";
import type {GroundedAnswer} from "../schemas";

describe("grounded generation validation", () => {
  it("accepts supported claims only when all cited segments exist", async () => {
    const groundingModule = await import("./grounding").catch(() => null);

    expect(groundingModule).not.toBeNull();
    const answer = {
      question: "What changed?",
      claims: [{text: "ARR is EUR 18.4m.", citation_ids: ["seg_model_arr"], supported: true}],
      confidence: "high",
      abstained: false,
      prompt_id: "dealstate.grounding",
      model_id: "test-model",
    } satisfies GroundedAnswer;

    expect(groundingModule!.validateGroundedAnswer(answer, [{id: "seg_model_arr", text: "ARR is EUR 18.4m."}])).toMatchObject({
      ok: true,
    });
    expect(groundingModule!.validateGroundedAnswer(answer, [])).toMatchObject({
      ok: false,
      abstained: true,
      message: "insufficient evidence in the current sources",
    });
  });
});

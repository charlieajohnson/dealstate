import {describe, expect, it} from "vitest";
import type {ArtefactSegment, ExtractionCandidate, Fact} from "../schemas";

describe("extraction materialisation", () => {
  const segment = {
    id: "seg_model_arr",
    raw_artefact_id: "raw_model_may",
    source_id: "doc_002",
    locator: {kind: "spreadsheet", sheet: "Summary", cell_range: "B4:B4"},
    text: "Annual recurring revenue of EUR 18.4m",
    ordinal: 1,
  } satisfies ArtefactSegment;

  it("rejects unverified citations and maps survivors into typed facts", async () => {
    const materialiseModule = await import("./materialise").catch(() => null);

    expect(materialiseModule).not.toBeNull();
    const candidate = {
      id: "cand_arr",
      extraction_run_id: "run_1",
      segment_ids: [segment.id],
      candidate_type: "fact",
      payload: {id: "fact_arr_model", opportunity_id: "project_nova", key: "arr", label: "ARR", value: "EUR 18.4m", kind: "fact", as_of: "2026-05-31"},
      citations: [
        {
          source_id: "doc_002",
          source_title: "May model",
          source_type: "spreadsheet_range",
          location: "Summary!B4",
          segment_id: segment.id,
          locator: segment.locator,
          extracted_text: "EUR 18.4m",
          confidence: "medium",
        },
      ],
      confidence: "medium",
      verified: false,
    } satisfies ExtractionCandidate;

    const result = materialiseModule!.materialiseExtractionCandidates({candidates: [candidate], segments: [segment], existingFacts: []});

    expect(result.facts).toHaveLength(1);
    expect(result.rejected).toHaveLength(0);
    expect(result.facts[0]?.citations[0]?.segment_id).toBe(segment.id);

    const badResult = materialiseModule!.materialiseExtractionCandidates({
      candidates: [{...candidate, id: "bad", citations: [{...candidate.citations[0]!, extracted_text: "EUR 19.0m"}]}],
      segments: [segment],
      existingFacts: [],
    });
    expect(badResult.facts).toHaveLength(0);
    expect(badResult.rejected[0]).toMatchObject({candidate_id: "bad", reason: "extracted_text_not_found"});
  });

  it("preserves conflicts for same-key different values", async () => {
    const materialiseModule = await import("./materialise").catch(() => null);
    const oldFact = {
      id: "fact_arr_memo",
      opportunity_id: "project_nova",
      key: "arr",
      label: "ARR",
      value: "EUR 17.8m",
      kind: "fact",
      as_of: "2026-05-15",
      citations: [],
      conflicts_with: [],
    } satisfies Fact;

    expect(materialiseModule).not.toBeNull();
    const result = materialiseModule!.materialiseExtractionCandidates({
      candidates: [
        {
          id: "cand_arr",
          extraction_run_id: "run_1",
          segment_ids: [segment.id],
          candidate_type: "fact",
          payload: {id: "fact_arr_model", opportunity_id: "project_nova", key: "arr", label: "ARR", value: "EUR 18.4m", kind: "fact", as_of: "2026-05-31"},
          citations: [
            {
              source_id: "doc_002",
              source_title: "May model",
              source_type: "spreadsheet_range",
              segment_id: segment.id,
              locator: segment.locator,
              extracted_text: "EUR 18.4m",
              confidence: "medium",
            },
          ],
          confidence: "medium",
          verified: false,
        },
      ],
      segments: [segment],
      existingFacts: [oldFact],
    });

    expect(result.facts[0]?.conflicts_with).toEqual(["fact_arr_memo"]);
  });
});

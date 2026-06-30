import {describe, expect, it} from "vitest";
import * as schemas from "./schemas";

describe("pass 2 schemas", () => {
  it("keeps legacy seed facts valid while accepting segment-backed citations", () => {
    const legacy = schemas.Fact.parse({
      id: "fact_arr_model",
      opportunity_id: "project_nova",
      key: "arr",
      label: "ARR",
      value: "EUR 18.4m",
      kind: "fact",
      as_of: "2026-05-31",
      citations: [
        {
          source_id: "doc_002",
          source_title: "May model",
          source_type: "spreadsheet_range",
          location: "Summary!B4",
          extracted_text: "Annual recurring revenue of EUR 18.4m",
          confidence: "medium",
        },
      ],
    });

    expect(legacy.citations[0]?.source_id).toBe("doc_002");

    const locator = {
      kind: "spreadsheet",
      sheet: "Summary",
      cell_range: "B4:B4",
    };
    const cited = schemas.SourceCitation.parse({
      source_id: "doc_002",
      source_title: "May model",
      source_type: "spreadsheet_range",
      location: "Summary!B4",
      segment_id: "seg_model_arr",
      locator,
      extracted_text: "Annual recurring revenue of EUR 18.4m",
      confidence: "medium",
    });

    expect(cited).toMatchObject({segment_id: "seg_model_arr", locator});
  });

  it("exports tenancy and pipeline record schemas", () => {
    for (const name of [
      "Firm",
      "Fund",
      "Deal",
      "Membership",
      "RawArtefact",
      "ArtefactSegment",
      "ExtractionRun",
      "ExtractionCandidate",
      "LlmCallRecord",
      "RetrievalChunk",
      "GroundedAnswer",
      "EvalCase",
    ]) {
      expect(schemas).toHaveProperty(name);
    }
  });
});

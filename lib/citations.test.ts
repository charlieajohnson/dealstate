import {describe, expect, it} from "vitest";
import type {ArtefactSegment, SourceCitation} from "./schemas";

describe("deterministic citation verification", () => {
  it("accepts citations only when extracted text is present in the claimed segment", async () => {
    const citationsModule = await import("./citations").catch(() => null);

    expect(citationsModule).not.toBeNull();
    const segment: ArtefactSegment = {
      id: "seg_model_arr",
      raw_artefact_id: "raw_model_may",
      locator: {kind: "spreadsheet", sheet: "Summary", cell_range: "B4:B4"},
      text: "Annual recurring revenue of EUR 18.4m",
      ordinal: 1,
    };
    const citation: SourceCitation = {
      source_id: "doc_002",
      source_title: "May model",
      source_type: "spreadsheet_range",
      location: "Summary!B4",
      segment_id: "seg_model_arr",
      locator: segment.locator,
      extracted_text: "EUR 18.4m",
      confidence: "medium",
    };

    expect(citationsModule!.verifyCitation(citation, [segment])).toEqual({
      ok: true,
      segment,
    });
    expect(citationsModule!.verifyCitation({...citation, extracted_text: "EUR 19.0m"}, [segment])).toMatchObject({
      ok: false,
      reason: "extracted_text_not_found",
    });
  });
});

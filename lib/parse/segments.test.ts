import {describe, expect, it} from "vitest";
import type {RawArtefact} from "../schemas";

describe("deterministic segment parsing", () => {
  const artefact = {
    id: "raw_email",
    deal_id: "project_nova",
    firm_id: "firm_demo",
    source: "gmail",
    external_id: "gmail-msg-1",
    content_hash: "hash-email",
    mime: "message/rfc822",
    storage_path: "email.eml",
    received_at: "2026-06-20T09:30:00.000Z",
    pii_flags: [],
  } satisfies RawArtefact;

  it("creates reproducible email locators", async () => {
    const segmentsModule = await import("./segments").catch(() => null);

    expect(segmentsModule).not.toBeNull();
    const segments = segmentsModule!.parseArtefactSegments(artefact, "Subject: Nova ARR bridge\n\nAnnual recurring revenue of EUR 18.4m");

    expect(segments).toEqual([
      {
        id: "seg_raw_email_0001",
        raw_artefact_id: "raw_email",
        locator: {kind: "email", part: "body", text_range: "1:37"},
        ordinal: 1,
        text: "Annual recurring revenue of EUR 18.4m",
      },
    ]);
  });

  it("creates reproducible CSV locators", async () => {
    const segmentsModule = await import("./segments").catch(() => null);
    const csvArtefact = {...artefact, id: "raw_crm", mime: "text/csv"};

    expect(segmentsModule).not.toBeNull();
    const segments = segmentsModule!.parseArtefactSegments(csvArtefact, "company,stage\nNova,live_diligence\n");

    expect(segments[0]).toMatchObject({
      id: "seg_raw_crm_0001",
      locator: {kind: "csv", row: 1, columns: ["company", "stage"]},
      text: "company=Nova stage=live_diligence",
    });
  });
});

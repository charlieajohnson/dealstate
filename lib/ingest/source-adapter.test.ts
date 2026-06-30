import {describe, expect, it} from "vitest";
import type {RawArtefact} from "../schemas";

describe("source ingestion", () => {
  it("dedupes repeated Gmail artefacts by content hash and external id", async () => {
    const pipelineModule = await import("./pipeline").catch(() => null);

    expect(pipelineModule).not.toBeNull();
    const artefact = {
      id: "raw_gmail_1",
      deal_id: "project_nova",
      firm_id: "firm_demo",
      source: "gmail",
      external_id: "gmail-msg-1",
      content_hash: "hash-1",
      mime: "message/rfc822",
      storage_path: "firm_demo/project_nova/gmail-msg-1.eml",
      received_at: "2026-06-20T09:30:00.000Z",
      pii_flags: [],
    } satisfies RawArtefact;
    const adapter = pipelineModule!.createMemorySourceAdapter("gmail", [artefact]);
    const store = pipelineModule!.createInMemoryIngestionStore();

    const first = await pipelineModule!.runIngestion({adapter, store, firmId: "firm_demo", dealId: "project_nova"});
    const second = await pipelineModule!.runIngestion({adapter, store, firmId: "firm_demo", dealId: "project_nova"});

    expect(first).toMatchObject({artefacts_seen: 1, artefacts_created: 1, status: "succeeded"});
    expect(second).toMatchObject({artefacts_seen: 1, artefacts_created: 0, status: "succeeded"});
    expect(store.listArtefacts()).toHaveLength(1);
  });

  it("marks older model artefacts as superseded without deleting them", async () => {
    const pipelineModule = await import("./pipeline").catch(() => null);

    expect(pipelineModule).not.toBeNull();
    const oldModel = {
      id: "raw_april_model",
      deal_id: "project_nova",
      firm_id: "firm_demo",
      source: "gmail",
      external_id: "model-thread",
      content_hash: "hash-april",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      storage_path: "models/april.xlsx",
      received_at: "2026-04-30T09:00:00.000Z",
      pii_flags: [],
    } satisfies RawArtefact;
    const newModel = {
      ...oldModel,
      id: "raw_may_model",
      content_hash: "hash-may",
      storage_path: "models/may.xlsx",
      received_at: "2026-05-31T09:00:00.000Z",
    } satisfies RawArtefact;
    const store = pipelineModule!.createInMemoryIngestionStore();

    await pipelineModule!.runIngestion({adapter: pipelineModule!.createMemorySourceAdapter("gmail", [oldModel]), store, firmId: "firm_demo", dealId: "project_nova"});
    await pipelineModule!.runIngestion({adapter: pipelineModule!.createMemorySourceAdapter("gmail", [newModel]), store, firmId: "firm_demo", dealId: "project_nova"});

    expect(store.listArtefacts().find((item: RawArtefact) => item.id === "raw_april_model")).toMatchObject({
      supersedes: "raw_may_model",
    });
    expect(store.listArtefacts()).toHaveLength(2);
  });
});

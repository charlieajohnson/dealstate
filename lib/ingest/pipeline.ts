import type {IngestionRun, RawArtefact} from "../schemas";

export type SourceAdapter = {
  source: RawArtefact["source"];
  sync(input: {firmId: string; dealId: string; cursor?: string}): Promise<RawArtefact[]>;
};

export type IngestionStore = {
  upsertArtefact(artefact: RawArtefact): "created" | "duplicate";
  listArtefacts(): RawArtefact[];
  recordRun(run: IngestionRun): void;
};

export function createMemorySourceAdapter(source: RawArtefact["source"], artefacts: RawArtefact[]): SourceAdapter {
  return {
    source,
    async sync(input) {
      return artefacts.filter((artefact) => artefact.firm_id === input.firmId && artefact.deal_id === input.dealId);
    },
  };
}

export function createInMemoryIngestionStore(): IngestionStore {
  const artefacts: RawArtefact[] = [];
  const runs: IngestionRun[] = [];

  return {
    upsertArtefact(artefact) {
      const duplicate = artefacts.find(
        (item) =>
          item.firm_id === artefact.firm_id &&
          item.source === artefact.source &&
          item.external_id === artefact.external_id &&
          item.content_hash === artefact.content_hash,
      );
      if (duplicate) return "duplicate";

      const superseded = artefacts.find(
        (item) =>
          item.firm_id === artefact.firm_id &&
          item.source === artefact.source &&
          item.external_id === artefact.external_id &&
          item.content_hash !== artefact.content_hash &&
          item.received_at < artefact.received_at &&
          !artefact.supersedes,
      );
      if (superseded) artefact.supersedes = superseded.id;

      artefacts.push({...artefact});
      return "created";
    },
    listArtefacts() {
      return artefacts.map((artefact) => ({...artefact}));
    },
    recordRun(run) {
      runs.push(run);
    },
  };
}

export async function runIngestion(input: {
  adapter: SourceAdapter;
  store: IngestionStore;
  firmId: string;
  dealId: string;
  now?: () => string;
}): Promise<IngestionRun> {
  const now = input.now ?? (() => new Date().toISOString());
  const startedAt = now();
  const artefacts = await input.adapter.sync({firmId: input.firmId, dealId: input.dealId});
  let created = 0;

  for (const artefact of artefacts) {
    if (input.store.upsertArtefact(artefact) === "created") created += 1;
  }

  const run: IngestionRun = {
    id: `ing_${startedAt.replace(/[^0-9]/g, "")}_${input.adapter.source}`,
    firm_id: input.firmId,
    deal_id: input.dealId,
    source: input.adapter.source,
    started_at: startedAt,
    finished_at: now(),
    status: "succeeded",
    artefacts_seen: artefacts.length,
    artefacts_created: created,
  };
  input.store.recordRun(run);
  return run;
}

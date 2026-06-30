import fs from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

const migrationPath = path.join(
  process.cwd(),
  "supabase",
  "migrations",
  "20260630090000_pass2_foundations.sql",
);

describe("tenant isolation policy", () => {
  it("denies cross-tenant access in deterministic policy helpers", async () => {
    const tenancyModule = await import("./tenancy").catch(() => null);

    expect(tenancyModule).not.toBeNull();
    expect(
      tenancyModule!.canAccessFirm({
        firmId: "firm_a",
        membershipFirmIds: ["firm_b"],
        isSyntheticDemo: false,
      }),
    ).toBe(false);
    expect(
      tenancyModule!.canAccessFirm({
        firmId: "firm_a",
        membershipFirmIds: ["firm_a"],
        isSyntheticDemo: false,
      }),
    ).toBe(true);
  });

  it("ships a deny-by-default RLS migration for every pass-2 table", () => {
    expect(fs.existsSync(migrationPath)).toBe(true);
    const sql = fs.readFileSync(migrationPath, "utf8");
    const tables = [
      "firms",
      "funds",
      "memberships",
      "raw_artefacts",
      "artefact_segments",
      "ingestion_runs",
      "extraction_runs",
      "extraction_candidates",
      "llm_call_records",
      "retrieval_chunks",
      "grounded_answers",
    ];

    for (const table of tables) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
      expect(sql).toMatch(new RegExp(`create policy "[^"]+" on public\\.${table}`));
    }

    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/i);
    expect(sql).toContain('drop policy if exists "read synthetic demo"');
    expect(sql).toContain("public.current_user_firm_ids()");
  });

  it("requires deal rows to match the same firm and owner-only write policies for tenant administration", () => {
    const sql = fs.readFileSync(migrationPath, "utf8");

    expect(sql).toContain("public.deal_belongs_to_firm");
    for (const table of ["raw_artefacts", "ingestion_runs", "extraction_runs", "llm_call_records", "retrieval_chunks", "grounded_answers"]) {
      expect(sql).toMatch(new RegExp(`public\\.deal_belongs_to_firm\\(${table.includes("raw") ? "deal_id" : "deal_id"}, firm_id\\)`));
    }

    expect(sql).toContain("public.is_firm_owner");
    expect(sql).toContain('create policy "owners write memberships"');
    expect(sql).not.toContain('create policy "firm members write firms"');
    expect(sql).not.toContain('create policy "firm members write funds"');
    expect(sql).not.toMatch(/for all to authenticated[^\n]+public\.can_access_firm/i);
  });
});

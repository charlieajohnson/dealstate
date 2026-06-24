import {existsSync, readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

const componentUrl = new URL("../components/landing/InvestmentStateAtelier.tsx", import.meta.url);
const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");

describe("investment state atelier section", () => {
  it("replaces the text comparison cards with a visual investment-state ecosystem", () => {
    expect(existsSync(componentUrl)).toBe(true);

    const componentSource = readFileSync(componentUrl, "utf8");

    expect(pageSource).toContain("InvestmentStateAtelier");
    expect(pageSource).not.toContain("DistinctionSection");

    expect(componentSource).toContain("THE DISTINCTION");
    expect(componentSource).toContain("Documents record what arrived.");
    expect(componentSource).toContain("Investment state records what the team believes.");
    expect(componentSource).toContain("DealState keeps source material visible");

    expect(componentSource).toContain("SOURCE MATERIAL");
    expect(componentSource).toContain("Documents arrive");
    expect(componentSource).toContain("Files, notes, numbers and fragments enter the deal room.");
    expect(componentSource).toContain("/images/dealstate/source-material.webp");

    expect(componentSource).toContain("DERIVED FACTS");
    expect(componentSource).toContain("Facts are extracted");
    expect(componentSource).toContain("Claims become structured, source-linked evidence.");
    expect(componentSource).toContain("/images/dealstate/derived-facts.webp");

    expect(componentSource).toContain("OPEN ISSUES");
    expect(componentSource).toContain("Uncertainty stays visible");
    expect(componentSource).toContain("Conflicts, missing items and stale assumptions remain explicit.");
    expect(componentSource).toContain("/images/dealstate/open-issues.webp");

    expect(componentSource).toContain("MEMO-READY STATE");
    expect(componentSource).toContain("The team has a current truth");
    expect(componentSource).toContain("The investment view becomes versioned, auditable and reusable.");
    expect(componentSource).toContain("/images/dealstate/memo-ready-state.webp");

    expect(componentSource).toContain("Documents");
    expect(componentSource).toContain("Extraction");
    expect(componentSource).toContain("Reconciliation");
    expect(componentSource).toContain("Versioned investment state");
  });
});

import {existsSync, readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

const componentUrl = new URL("../components/landing/StateLoopAtelier.tsx", import.meta.url);
const pageSource = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const cssSource = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

describe("state loop atelier section", () => {
  it("renders the state loop as an archival source-to-state ledger", () => {
    expect(existsSync(componentUrl)).toBe(true);

    const componentSource = readFileSync(componentUrl, "utf8");

    expect(pageSource).toContain("StateLoopAtelier");
    expect(pageSource).not.toContain("StateLoopSection");

    expect(componentSource).toContain('id="state-loop"');
    expect(componentSource).toContain("The state loop");
    expect(componentSource).toContain("From artefacts to investment state.");
    expect(componentSource).toContain("DealState derives facts, issues, conflicts and missing items");
    expect(componentSource).toContain("Source-to-state register");
    expect(componentSource).toContain("v0.7");

    expect(componentSource).toContain("Source material");
    expect(componentSource).toContain("Derived facts");
    expect(componentSource).toContain("Open issues");
    expect(componentSource).toContain("v0.7 register");
    expect(componentSource).toContain("Investment output");

    expect(componentSource).toContain("Collect files, emails, notes, updates and artefacts.");
    expect(componentSource).toContain("Extract facts, claims, numbers, dates, owners and obligations.");
    expect(componentSource).toContain("Surface conflicts, unsupported claims, missing data and superseded materials.");
    expect(componentSource).toContain("Track what changed since the last review.");
    expect(componentSource).toContain("Ask source-backed questions and generate investment work from current state.");

    expect(cssSource).toContain(".state-loop-atelier");
    expect(cssSource).toContain(".atelier-ledger");
    expect(cssSource).toContain(".ledger-station");
    expect(cssSource).toContain("@keyframes ledger-path-draw");
    expect(cssSource).toContain("@media (max-width: 900px)");
    expect(cssSource).toContain("@media (prefers-reduced-motion: reduce)");
  });
});

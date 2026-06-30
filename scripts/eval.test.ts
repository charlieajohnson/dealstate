import fs from "node:fs";
import path from "node:path";
import {describe, expect, it} from "vitest";

describe("eval harness skeleton", () => {
  it("has deterministic Project Nova fixtures and gold labels", () => {
    for (const file of [
      "evals/fixtures/project-nova/investment-deck.pdf",
      "evals/fixtures/project-nova/model-may-2026.xlsx",
      "evals/fixtures/project-nova/model-april-2026.xlsx",
      "evals/fixtures/project-nova/founder-arr-bridge.eml",
      "evals/fixtures/project-nova/crm-export.csv",
      "evals/gold/project-nova.json",
    ]) {
      expect(fs.existsSync(path.join(process.cwd(), file))).toBe(true);
    }
  });

  it("exposes npm run eval", () => {
    const packageJson = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));

    expect(packageJson.scripts.eval).toBe("tsx scripts/eval.ts");
  });

  it("eval runner reads committed Project Nova fixture files", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "scripts", "eval.ts"), "utf8");

    expect(source).toContain("evals/fixtures/project-nova");
    expect(source).toContain("fixture_files_present");
  });

  it("XLSX fixtures are real zipped workbooks", () => {
    for (const file of ["model-may-2026.xlsx", "model-april-2026.xlsx"]) {
      const bytes = fs.readFileSync(path.join(process.cwd(), "evals", "fixtures", "project-nova", file));

      expect(bytes.subarray(0, 2).toString("utf8")).toBe("PK");
    }
  });
});

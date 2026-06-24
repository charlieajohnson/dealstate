import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

const topNavSource = readFileSync(new URL("../components/nav/TopNav.tsx", import.meta.url), "utf8");
const layoutSource = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");

describe("top navigation", () => {
  it("does not expose or persist a light/dark theme control", () => {
    expect(topNavSource).toContain("Opportunities");
    expect(topNavSource).toContain("Methodology");
    expect(topNavSource).toContain("Demo deal");
    expect(topNavSource).not.toContain("ThemeToggle");
    expect(layoutSource).not.toContain("dealstate-theme");
    expect(layoutSource).not.toContain("classList.toggle");
  });
});

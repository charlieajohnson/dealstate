import {existsSync, readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

const componentUrl = new URL("../components/landing/HeroProductVignette.tsx", import.meta.url);
const heroImageUrl = new URL("../public/images/dealstate/hero-archive-room.webp", import.meta.url);

describe("hero product vignette", () => {
  it("renders an image-backed source-to-state tableau", () => {
    expect(existsSync(heroImageUrl)).toBe(true);

    const componentSource = readFileSync(componentUrl, "utf8");

    expect(componentSource).toContain("/images/dealstate/hero-archive-room.webp");
    expect(componentSource).toContain("Project Nova case packet");
    expect(componentSource).toContain("Source-to-state register");
    expect(componentSource).toContain("Source ledger");
    expect(componentSource).toContain("Derived register");
    expect(componentSource).toContain("14 sources");
    expect(componentSource).toContain("1 ARR conflict");
    expect(componentSource).toContain("5 open issues");
    expect(componentSource).toContain("v0.7 current state");
    expect(componentSource).toContain("Medium confidence");
    expect(componentSource).toContain("Last reviewed 22 Jun");
    expect(componentSource).toContain("ARR currently recorded at €18.4m");
    expect(componentSource).toContain("IC memo still carries €17.8m");
    expect(componentSource).toContain("Customer cohort analysis requested");
    expect(componentSource).toContain("Continue diligence");
  });
});

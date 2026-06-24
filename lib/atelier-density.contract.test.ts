import {readFileSync} from "node:fs";
import {describe, expect, it} from "vitest";

const heroSource = readFileSync(new URL("../components/landing/HeroProductVignette.tsx", import.meta.url), "utf8");
const sectionsSource = readFileSync(new URL("../components/landing/LandingSections.tsx", import.meta.url), "utf8");

describe("humanist atelier product density", () => {
  it("keeps the hero register product-specific without reverting to dashboard language", () => {
    expect(heroSource).toContain("Current truth");
    expect(heroSource).toContain("ARR currently recorded at €18.4m");
    expect(heroSource).toContain("IC memo still carries €17.8m");
    expect(heroSource).toContain("Customer cohort analysis requested");
    expect(heroSource).toContain("14 sources");
    expect(heroSource).toContain("1 ARR conflict");
    expect(heroSource).toContain("5 open issues");
    expect(heroSource).toContain("v0.7 current state");
    expect(heroSource).toContain("Medium confidence");
    expect(heroSource).toContain("Last reviewed");
    expect(heroSource).not.toContain("Dashboard");
  });

  it("adds current-state metadata to the closing product theatre", () => {
    expect(sectionsSource).toContain("Here is the current investment state of the deal.");
    expect(sectionsSource).toContain("Current state");
    expect(sectionsSource).toContain("Continue diligence");
    expect(sectionsSource).toContain("Confidence");
    expect(sectionsSource).toContain("Medium");
    expect(sectionsSource).toContain("Source coverage");
    expect(sectionsSource).toContain("46%");
    expect(sectionsSource).toContain("Open issues");
    expect(sectionsSource).toContain("5");
  });
});

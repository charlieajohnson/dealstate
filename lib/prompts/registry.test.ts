import {describe, expect, it} from "vitest";

describe("prompt registry", () => {
  it("loads versioned prompts from files and rejects unknown ids", async () => {
    const registryModule = await import("./registry").catch(() => null);

    expect(registryModule).not.toBeNull();
    const registry = registryModule!.createPromptRegistry();
    const prompt = registry.get("dealstate.extraction", "1.0.0");

    expect(prompt).toMatchObject({
      id: "dealstate.extraction",
      version: "1.0.0",
    });
    expect(prompt.text).toContain("Return only structured data");
    expect(() => registry.get("missing", "1.0.0")).toThrow(/Unknown prompt/);
  });
});

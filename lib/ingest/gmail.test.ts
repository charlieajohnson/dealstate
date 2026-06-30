import {describe, expect, it} from "vitest";

describe("Gmail adapter", () => {
  it("is a typed SourceAdapter and fails closed without OAuth credentials", async () => {
    const gmailModule = await import("./gmail").catch(() => null);

    expect(gmailModule).not.toBeNull();
    const adapter = gmailModule!.createGmailAdapter({});

    expect(adapter.source).toBe("gmail");
    await expect(adapter.sync({firmId: "firm_demo", dealId: "project_nova"})).rejects.toThrow(/TODO\(pass2\).*Gmail OAuth/);
  });
});

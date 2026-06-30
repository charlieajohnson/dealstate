import {describe, expect, it} from "vitest";
import {resolveSiteUrl} from "./site";

describe("resolveSiteUrl", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL override", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://deals.example.com",
        VERCEL_PROJECT_PRODUCTION_URL: "dealstate-zeta.vercel.app",
      }),
    ).toBe("https://deals.example.com");
  });

  it("falls back to the Vercel production domain with https", () => {
    expect(resolveSiteUrl({VERCEL_PROJECT_PRODUCTION_URL: "dealstate-zeta.vercel.app"})).toBe(
      "https://dealstate-zeta.vercel.app",
    );
  });

  it("never resolves to localhost when a production domain is present", () => {
    expect(resolveSiteUrl({VERCEL_PROJECT_PRODUCTION_URL: "dealstate-zeta.vercel.app"})).not.toContain(
      "localhost",
    );
  });

  it("uses the local development default only as a last resort", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000");
  });
});

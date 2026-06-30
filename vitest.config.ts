import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {environment: "node", include: ["lib/**/*.test.ts", "lib/**/*.test.tsx", "scripts/**/*.test.ts"]},
  resolve: { alias: { "@": new URL(".", import.meta.url).pathname } },
});

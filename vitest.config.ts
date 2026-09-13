import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["test/**/*.test.ts"],
    // Tests must never reach a real gateway; each test stubs fetch itself.
    unstubGlobals: true,
  },
});

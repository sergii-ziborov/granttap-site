import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    maxWorkers: 2,
    server: { deps: { inline: ["granttap-mcp"] } },
    environment: "jsdom",
    setupFiles: ["./tests/coverage/setup.tsx"],
    include: ["tests/coverage/**/*.test.{ts,tsx}", "app/**/tests/*.test.{ts,tsx}", "worker/**/tests/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}", "worker/**/*.ts"],
      exclude: ["**/tests/**"],
      reporter: ["text", "json-summary"],
      thresholds: { branches: 90, functions: 90, lines: 90, statements: 90 },
    },
  },
});

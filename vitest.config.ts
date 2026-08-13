import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/coverage/setup.tsx"],
    include: ["tests/coverage/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["app/**/*.{ts,tsx}", "worker/**/*.ts"],
      reporter: ["text", "json-summary"],
      thresholds: { branches: 95, functions: 95, lines: 95, statements: 95 },
    },
  },
});

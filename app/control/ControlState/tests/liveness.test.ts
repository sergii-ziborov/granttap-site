import { expect, it } from "vitest";
import { applyControlPayload, emptyComputer } from "..";
it("does not mistake a retained catalog for a computer heartbeat", () => {
  const state = applyControlPayload(emptyComputer(), { type: "sessions.status", machine: "Offline fixture",
    sessions: [], generatedAt: Date.now() - 86_400_000 });
  expect(state.lastSeenAt).toBeUndefined();
  const fresh = applyControlPayload(state, { type: "machine.heartbeat", machine: "Fixture", createdAt: Date.now() });
  expect(fresh.lastSeenAt).toBeGreaterThan(Date.now() - 1_000);
});

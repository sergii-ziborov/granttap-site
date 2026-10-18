// @vitest-environment node
import "fake-indexeddb/auto";
import { expect, it } from "vitest";
import { emptyComputer } from "../../ControlState";
import { BrowserControlArchive } from "..";
import { BrowserKeysStorage } from "../../BrowserKeys";

it("restores encrypted Task state with the computer offline, isolates accounts and preserves concurrent computers", async () => {
  const a = "account-" + crypto.randomUUID(), b = "account-" + crypto.randomUUID();
  const one = new BrowserControlArchive(), two = new BrowserControlArchive();
  await Promise.all([one.save(a, "one", { ...emptyComputer(), generatedAt: 1 }),
    two.save(a, "two", { ...emptyComputer(), generatedAt: 2 })]);
  const restored = await new BrowserControlArchive().read(a);
  expect(Object.keys(restored).sort()).toEqual(["one", "two"]);
  expect(restored.two.generatedAt).toBe(2); expect(await one.read(b)).toEqual({});
  await one.forget(a); expect(await two.read(a)).toEqual({});
});
it("bounds cached private conversation content and prevents copying the encrypted cache to another account", async () => {
  const storage = new BrowserKeysStorage("synthetic-history-" + crypto.randomUUID()), archive = new BrowserControlArchive(storage);
  const transcript = Object.fromEntries(Array.from({ length: 13 }, (_, i) => [String(i), Array.from({ length: 51 }, (_, j) => ({
    id: String(j), kind: "message" as const, text: "x".repeat(8_100), createdAt: j, diffPreview: "+ private diff",
  }))]));
  await archive.save("account", "computer", { ...emptyComputer(), transcript });
  const restored = (await archive.read("account")).computer.transcript;
  expect(Object.keys(restored)).toHaveLength(12); expect(restored["0"]).toBeUndefined();
  expect(restored["12"]).toHaveLength(50); expect(restored["12"][0]).toMatchObject({ id: "1", text: "x".repeat(8_000) });
  expect(restored["12"][0].diffPreview).toBeUndefined();
  await storage.commit("other-account", (await storage.read("account"))!, 0);
  await expect(archive.read("other-account")).rejects.toThrow(); await archive.forget("account");
});

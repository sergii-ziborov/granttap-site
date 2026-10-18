import "fake-indexeddb/auto";
import { webcrypto } from "node:crypto";
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { useControlAccount } from "../use-account";
import { BrowserKeyVault } from "../../BrowserKeys";

vi.mock("../../ComputerConnection", () => ({ connectAccountComputer: async (machineId: string) => ({ machineId, room: "synthetic-room" }) }));
vi.mock("../../RelayConnection", () => ({ BrowserRelayConnection: class { start() {} stop() {} } }));
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

function fixture(options: { pages?: unknown[]; access?: number; fail?: boolean } = {}) {
  vi.stubGlobal("crypto", webcrypto);
  const accountId = crypto.randomUUID(); let status = options.access ?? 200, fail = options.fail ?? false, page = 0, currentAccount = accountId;
  const request = vi.fn(async (input: string | URL | Request) => {
    if (fail) throw Error("Synthetic network failure");
    if (String(input).includes("control/access")) return Response.json({ accountId: currentAccount, access: { source: "beta" } }, { status });
    const value = options.pages?.[page++] ?? { machines: [{ id: "machine", name: "Synthetic computer" }] };
    return value instanceof Response ? value : Response.json(value);
  });
  vi.stubGlobal("fetch", request);
  return { accountId, request, access: (value: number) => { status = value; }, fail: (value: boolean) => { fail = value; },
    switchAccount: (value: string) => { currentAccount = value; } };
}
it("loads all account computer pages and durably authorizes a browser connection", async () => {
  const f = fixture({ pages: [{ machines: [{ id: "one", name: "One" }], nextCursor: "page-two" },
    { machines: [{ id: "two", name: "Two" }] }] });
  const hook = renderHook(() => useControlAccount()); await waitFor(() => expect(hook.result.current.status).toBe("ready"));
  expect(hook.result.current.account?.machines.map(machine => machine.id)).toEqual(["one", "two"]);
  await act(() => hook.result.current.connect("two", new AbortController().signal));
  expect(hook.result.current.account?.connected.has("two")).toBe(true);
  expect((await new BrowserKeyVault().read(f.accountId)).pairings).toMatchObject([{ machineId: "two" }]);
  await act(() => hook.result.current.forget());
  await waitFor(() => expect(hook.result.current.account?.connected.size).toBe(0));
  expect((await new BrowserKeyVault().read(f.accountId)).pairings).toEqual([]); hook.unmount();
});
it("rechecks an access failure and keeps authentication and entitlement gates distinct", async () => {
  const f = fixture({ access: 401 }); const hook = renderHook(() => useControlAccount());
  await waitFor(() => expect(hook.result.current.status).toBe("signin"));
  f.access(403); act(() => hook.result.current.retry()); await waitFor(() => expect(hook.result.current.status).toBe("subscription"));
  f.access(503); act(() => hook.result.current.retry()); await waitFor(() => expect(hook.result.current.status).toBe("error"));
  f.access(200); act(() => hook.result.current.retry()); await waitFor(() => expect(hook.result.current.status).toBe("ready")); hook.unmount();
});
it("recovers from an unavailable service and refuses malformed or looping computer pagination", async () => {
  const f = fixture({ fail: true }), first = renderHook(() => useControlAccount());
  await waitFor(() => expect(first.result.current.status).toBe("error"));
  expect(first.result.current.error).toMatch(/could not be verified/);
  f.fail(false); act(() => first.result.current.retry()); await waitFor(() => expect(first.result.current.status).toBe("ready")); first.unmount();
  for (const pages of [[Response.json({}, { status: 503 })], [{ machines: "invalid" }],
    [{ machines: [], nextCursor: 7 }], [{ machines: [], nextCursor: "same" }, { machines: [], nextCursor: "same" }]]) {
    fixture({ pages }); const hook = renderHook(() => useControlAccount());
    await waitFor(() => expect(hook.result.current.status).toBe("error")); expect(hook.result.current.account).toBeUndefined(); hook.unmount();
  }
});
it("revokes a ready control view when its subscription check stops granting access", async () => {
  const f = fixture(), hook = renderHook(() => useControlAccount());
  await waitFor(() => expect(hook.result.current.status).toBe("ready")); vi.useFakeTimers();
  // Start the effect timer under the controlled clock without changing its account.
  act(() => hook.result.current.retry()); await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  f.access(403); await act(async () => { await vi.advanceTimersByTimeAsync(240_001); });
  expect(hook.result.current.status).toBe("subscription"); hook.unmount();
});
it("replaces the old control runtime when the signed-in account changes in another tab", async () => {
  const intervals = vi.spyOn(globalThis, "setInterval");
  const f = fixture(), hook = renderHook(() => useControlAccount());
  await waitFor(() => expect(hook.result.current.status).toBe("ready"));
  const previous = hook.result.current.account!.runtime, nextAccount = crypto.randomUUID();
  const recheck = intervals.mock.calls.find(([, delay]) => delay === 240_000)![0] as () => void;
  f.switchAccount(nextAccount); act(() => recheck());
  await waitFor(() => expect(hook.result.current.account?.accountId).toBe(nextAccount));
  await expect(previous.submit("machine", { type: "user.message", text: "Synthetic", createdAt: 1 }, "user-message-old-account"))
    .rejects.toThrow(/closed/); hook.unmount(); intervals.mockRestore();
});
it("forgets browser credentials in every open control tab", async () => {
  fixture(); const first = renderHook(() => useControlAccount());
  await waitFor(() => expect(first.result.current.status).toBe("ready"));
  await act(() => first.result.current.connect("machine", new AbortController().signal));
  const second = renderHook(() => useControlAccount());
  await waitFor(() => expect(second.result.current.account?.connected.has("machine")).toBe(true));
  const oldRuntime = second.result.current.account!.runtime;
  await act(() => first.result.current.forget());
  await waitFor(() => expect(second.result.current.account?.connected.size).toBe(0));
  await expect(oldRuntime.submit("machine", { type: "user.message", text: "Synthetic", createdAt: 1 }, "user-message-forgotten-tab"))
    .rejects.toThrow(/closed/); first.unmount(); second.unmount();
});

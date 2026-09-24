import { expect, test, vi } from "vitest";
import { handleConnectApi } from "../../worker/connect-api";

const id = "11111111-1111-4111-8111-111111111111";

test("connect API stores a snapshot, records Approve, and accepts a loopback callback", async () => {
  expect(await handleConnectApi(new Request("https://granttap.com/other"))).toBeNull();
  expect((await handleConnectApi(new Request("https://granttap.com/api/connect/requests/nope")))?.status).toBe(400);

  const put = await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      clientName: "Cursor",
      paired: true,
      phones: [{ name: "iPhone", status: "paired" }],
      providers: [{ id: "cursor", installed: true, ready: true }],
      mesh: { present: true, thisComputer: "Mac", computers: ["Mac"], openTasks: 1 },
    }),
  }));
  expect(put?.status).toBe(200);

  const got = await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}`));
  expect(got?.status).toBe(200);
  expect(await got?.json()).toMatchObject({ clientName: "Cursor", paired: true });

  const decide = await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "approve" }),
  }));
  expect(decide?.status).toBe(200);

  const redirect = await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}/redirect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirectUrl: "http://127.0.0.1:49123/callback?code=x" }),
  }));
  expect(redirect?.status).toBe(200);

  const refused = await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}/redirect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirectUrl: "https://evil.example/callback" }),
  }));
  expect(refused?.status).toBe(400);

  const missing = "22222222-2222-4222-8222-222222222222";
  expect((await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${missing}`)))?.status).toBe(404);
  expect((await handleConnectApi(new Request("https://granttap.com/api/connect/requests/33333333-3333-4333-8333-333333333333", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: "null",
  })))?.status).toBe(400);
  expect((await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${missing}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "approve" }),
  })))?.status).toBe(404);
  expect((await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}/decision`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ decision: "maybe" }),
  })))?.status).toBe(400);
  expect((await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${missing}/redirect`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ redirectUrl: "http://127.0.0.1:9/callback" }),
  })))?.status).toBe(404);
  expect((await handleConnectApi(new Request(`https://granttap.com/api/connect/requests/${id}`, {
    method: "PATCH",
  })))?.status).toBe(405);
});

test("connect API bounds untrusted snapshots and preserves an existing decision", async () => {
  const id = "44444444-4444-4444-8444-444444444444";
  const url = `https://granttap.com/api/connect/requests/${id}`;
  const put = async (body: unknown) => handleConnectApi(new Request(url, {
    method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(body),
  }));
  expect((await put({
    clientName: "  ", paired: true,
    phones: [null, { name: "  ", status: "seen", lastSeenAt: 5 }, { name: " Tablet ", status: "offline", lastSeenAt: "no" }, 2],
    providers: [null, 4, {}, { id: "unknown" }, { id: "codex", installed: true, ready: false }, { id: "claude", installed: false, ready: true }],
    mesh: { present: true, thisComputer: " Mac ", computers: ["Mac", " ", 3, "PC"], openTasks: 10_000 },
    error: "E".repeat(400), decision: "deny",
  }))?.status).toBe(200);
  const row = await (await handleConnectApi(new Request(url)))?.json();
  expect(row).toMatchObject({ clientName: "Coding app", paired: true, decision: "deny" });
  expect(row.phones).toEqual([{ name: "iPhone", status: "seen", lastSeenAt: 5 }, { name: "Tablet", status: "paired", lastSeenAt: null }]);
  expect(row.providers).toEqual([{ id: "codex", installed: true, ready: false }, { id: "claude", installed: false, ready: true }]);
  expect(row.mesh).toEqual({ present: true, thisComputer: "Mac", computers: ["Mac", "PC"], openTasks: 999 });
  expect(row.error).toHaveLength(300);
  expect((await put({ clientName: "Next", mesh: { openTasks: "unknown" } }))?.status).toBe(200);
  const updated = await (await handleConnectApi(new Request(url)))?.json();
  expect(updated).toMatchObject({ clientName: "Next", paired: true, decision: "deny", mesh: { present: false, openTasks: 0 } });
  const decision = await handleConnectApi(new Request(`${url}/decision`, { method: "POST", body: JSON.stringify({ decision: "approve" }) }));
  expect(await decision?.json()).toMatchObject({ decision: "deny" });
});

test("connect API accepts only local callback paths and handles unavailable cache", async () => {
  const id = "55555555-5555-4555-8555-555555555555";
  const base = `https://granttap.com/api/connect/requests/${id}`;
  vi.stubGlobal("caches", { open: async () => ({ match: async () => undefined, put: async () => { throw new Error("cache unavailable"); } }) });
  expect((await handleConnectApi(new Request(base)))?.status).toBe(404);
  expect((await handleConnectApi(new Request(base, { method: "PUT", body: JSON.stringify({ clientName: "Codex" }) })))?.status).toBe(200);
  for (const redirectUrl of ["invalid", "https://127.0.0.1/callback", "http://evil.example/callback", "http://localhost/other"]) {
    const response = await handleConnectApi(new Request(`${base}/redirect`, { method: "POST", body: JSON.stringify({ redirectUrl }) }));
    expect(response?.status).toBe(400);
  }
  for (const redirectUrl of ["http://localhost/oauth", "http://[::1]/redirect", "http://127.0.0.1/callback/subroute"]) {
    const response = await handleConnectApi(new Request(`${base}/redirect`, { method: "POST", body: JSON.stringify({ redirectUrl }) }));
    expect(response?.status).toBe(200);
  }
  vi.unstubAllGlobals();
});

import { expect, test } from "vitest";
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

import { AccountAuth } from "./auth";
import { AccountMachines } from "./machines";
import { bearerToken, boundedJSON, json, sessionToken, UUID } from "./http";

/** HTTP bridge for account-authorized recovery. Machine credentials are never browser-issued. */
export async function routeMachineApi(
  request: Request, auth: AccountAuth, machines: AccountMachines,
): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!path.startsWith("/api/account/")) return null;
  const action = path.slice("/api/account/".length);
  if (!(action === "machines" || action.startsWith("machines/")
    || action === "machine/requests" || action.startsWith("machine/requests/")
    || action.startsWith("requests/"))) return null;

  if (action === "machine/requests" || action.startsWith("machine/requests/")) {
    const token = bearerToken(request);
    if (!token) return json(401, { error: "Machine authorization required." });
    if (action === "machine/requests" && request.method === "GET") {
      const requests = await machines.pending(token);
      return requests ? json(200, { requests }) : json(401, { error: "Machine access revoked." });
    }
    const match = action.match(/^machine\/requests\/([^/]+)\/offer$/);
    if (match && request.method === "POST" && UUID.test(match[1])) {
      const body = await boundedJSON(request);
      if (typeof body?.encryptedOffer !== "string") return json(400, { error: "Invalid sealed offer." });
      return await machines.complete(token, match[1], body.encryptedOffer)
        ? json(200, { ok: true }) : json(404, { error: "Request unavailable." });
    }
    return json(405, { error: "Method not allowed." });
  }

  const accountId = await auth.accountForToken(sessionToken(request));
  if (!accountId) return json(401, { error: "Sign in required." });
  if (action === "machines") {
    if (request.method === "GET") return json(200, { machines: await machines.list(accountId) });
    if (request.method === "POST") {
      if (request.headers.has("origin") || request.headers.has("sec-fetch-site")) {
        return json(403, { error: "Register computers from GrantTap for Mac." });
      }
      const body = await boundedJSON(request);
      const registered = typeof body?.name === "string" ? await machines.register(accountId, body.name) : null;
      return registered ? json(201, registered) : json(400, { error: "Invalid computer name or account." });
    }
    return json(405, { error: "Method not allowed." });
  }
  const revoke = action.match(/^machines\/([^/]+)$/);
  if (revoke && request.method === "DELETE" && UUID.test(revoke[1])) {
    return await machines.revoke(accountId, revoke[1])
      ? json(200, { revoked: true }) : json(404, { error: "Computer unavailable." });
  }
  const open = action.match(/^machines\/([^/]+)\/requests$/);
  if (open && request.method === "POST" && UUID.test(open[1])) {
    const body = await boundedJSON(request);
    const opened = typeof body?.phonePublicKey === "string"
      ? await machines.open(accountId, open[1], body.phonePublicKey) : null;
    return opened ? json(201, opened) : json(400, { error: "Invalid or unavailable request." });
  }
  const poll = action.match(/^requests\/([^/]+)$/);
  if (poll && request.method === "GET" && UUID.test(poll[1])) {
    const status = await machines.status(accountId, poll[1]);
    if (status === "pending") return json(202, { status });
    const encryptedOffer = status === "ready" ? await machines.claim(accountId, poll[1]) : null;
    return encryptedOffer ? json(200, { encryptedOffer })
      : json(404, { error: "Request unavailable." });
  }
  return json(405, { error: "Method not allowed." });
}

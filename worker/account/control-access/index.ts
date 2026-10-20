import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import { boundedJSON, json, sessionToken, UUID } from "../http";
import { ManagedSubscriptions } from "../subscriptions";
import type { ManagedBilling } from "../subscriptions/api";
import { reconcileSubscription } from "../subscriptions/reconcile";
import { signManagedTicket } from "../subscriptions/tickets";
import { AccountMachineEndpoints, validControlKey, validControlRoom } from "./machine-endpoints";
export { AccountMachineEndpoints } from "./machine-endpoints";

export type ControlServices = { db: D1Database; auth: AccountAuth; billing?: ManagedBilling };

/** Browser and native control share the server's verified account authority. */
export async function authorizeAccountControl(request: Request, services: ControlServices) {
  const origin = request.headers.get("origin");
  if (origin && origin !== "https://granttap.com") return json(403, { error: "Origin not allowed." });
  const accountId = await services.auth.accountForToken(sessionToken(request));
  if (!accountId) return json(401, { error: "Sign in with your GrantTap passkey." });
  if (!services.billing) return json(503, { error: "Account access verification is unavailable." });
  const ledger = new ManagedSubscriptions(services.db);
  try { await reconcileSubscription(ledger, services.billing.receipts, accountId); }
  catch { return json(503, { error: "Subscription confirmation is temporarily unavailable." }); }
  const entitlement = await ledger.entitlement(accountId);
  if (!entitlement) return json(403, { error: "An active GrantTap subscription or official test access is required." });
  return { accountId, entitlement };
}

export async function routeControlAccess(request: Request, services: ControlServices): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  if (!["/api/account/control/access", "/api/account/control/admission"].includes(path)) return null;
  const admission = path.endsWith("/admission");
  if (request.method !== (admission ? "POST" : "GET")) return json(405, { error: "Method not allowed." });
  const result = await authorizeAccountControl(request, services);
  if (result instanceof Response) return result;
  if (admission) return controllerAdmission(request, services, result.accountId);
  return json(200, { accountId: result.accountId, access: {
    source: result.entitlement.source, computerLimit: result.entitlement.limit,
    expiresAt: Math.min(result.entitlement.expiresAt, Date.now() + 300_000),
  } });
}

async function controllerAdmission(request: Request, services: ControlServices, accountId: string): Promise<Response> {
  const body = await boundedJSON(request);
  if (!body || Object.keys(body).some(key => !["computerId", "room", "publicKey"].includes(key))
    || typeof body.computerId !== "string" || !UUID.test(body.computerId)
    || !validControlRoom(body.room) || !validControlKey(body.publicKey)) {
    return json(400, { error: "Invalid controller identity." });
  }
  const binding = await new AccountMachineEndpoints(services.db).binding(accountId, body.computerId, body.room);
  if (!binding) return json(403, { error: "This computer route is not available to this account." });
  const right = await new ManagedSubscriptions(services.db).admit(accountId, body.computerId);
  if (!right) return json(403, { error: "Computer access must be renewed in GrantTap." });
  if (!services.billing || services.billing.signingKey.length < 32) {
    return json(503, { error: "Account access verification is unavailable." });
  }
  return json(200, { ticket: signManagedTicket(services.billing.signingKey, { version: 2, role: "phone",
    accountId, computerId: body.computerId, publicKey: body.publicKey, room: body.room,
    expiresAt: right.expiresAt, source: right.source }), expiresAt: right.expiresAt, source: right.source });
}

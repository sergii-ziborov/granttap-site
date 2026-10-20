import { SubscriptionCancellationFeedback } from "../subscription-retention/feedback";
import { routeSubscriptionRetention, type RetentionBilling } from "../subscription-retention/api";
import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import type { AccountMachines } from "../machines";
import { bearerToken, boundedJSON, json, sessionToken } from "../http";
import type { AppleReceipts } from "./apple";
import { ManagedSubscriptions, isManagedSubscription } from "./index";
import { signManagedTicket } from "./tickets";
import { reconcileSubscription } from "./reconcile";
import { routeTestFlight } from "../testflight";
import { routeManagedComputers } from "./computers";
import { AccountMachineEndpoints } from "../control-access";

export type ManagedBilling = { receipts: AppleReceipts; signingKey: Buffer; retention?: RetentionBilling };
const ROOM = /^[A-Za-z0-9_-]{8,128}$/;

export async function routeManagedSubscriptions(request: Request,
  services: { db: D1Database; auth: AccountAuth; machines: AccountMachines; billing?: ManagedBilling }): Promise<Response | null> {
  const retentionResponse = await routeSubscriptionRetention(request, services);
  if (retentionResponse) return retentionResponse;
  const path = new URL(request.url).pathname;
  const testFlightPath = "/api/account/subscriptions/testflight";
  const receiptPath = "/api/account/subscriptions/receipt";
  const notificationPath = "/api/account/subscriptions/notification";
  const admissionPath = "/api/account/machine/admission";
  const entitlementPath = "/api/account/subscriptions/entitlement";
  const computersPath = "/api/account/subscriptions/computers";
  const release = /^\/api\/account\/subscriptions\/computers\/([0-9a-f-]{36})$/.exec(path);
  if (![receiptPath, notificationPath, admissionPath, entitlementPath, computersPath, testFlightPath].includes(path) && !release) return null;
  const origin = request.headers.get("origin");
  if (request.method !== "GET" && origin && origin !== "https://granttap.com") {
    return json(403, { error: "Origin not allowed." });
  }
  const { billing } = services;
  if (!billing) return json(503, { error: "Managed billing verification is not configured." });
  if (path === testFlightPath) return routeTestFlight(request, services.db, services.auth, billing.receipts);
  await new SubscriptionCancellationFeedback(services.db, billing.signingKey).prune();
  const ledger = new ManagedSubscriptions(services.db);
  if (path === computersPath || release) {
    return routeManagedComputers(request, ledger, services.auth, services.machines, billing.receipts);
  }
  if (path === entitlementPath) {
    if (request.method !== "GET") return json(405, { error: "Method not allowed." });
    const account = await services.auth.accountForToken(sessionToken(request));
    if (!account) return json(401, { error: "Sign in required." });
    try { await reconcileSubscription(ledger, billing.receipts, account); }
    catch { return json(503, { error: "Apple subscription confirmation is temporarily unavailable." }); }
    const entitlement = await ledger.entitlement(account);
    return json(200, { entitlement: entitlement ? { ...entitlement,
      validatedUntil: Math.min(entitlement.expiresAt, Date.now() + 300_000) } : null });
  }
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  const body = await boundedJSON(request);
  if (!body) return json(400, { error: "Invalid request." });
  if (path === admissionPath) {
    const identity = await services.machines.identity(bearerToken(request));
    if (!identity) return json(401, { error: "Machine access revoked." });
    try { await reconcileSubscription(ledger, billing.receipts, identity.accountId); }
    catch { return json(503, { error: "Apple subscription confirmation is temporarily unavailable." }); }
    if (typeof body.publicKey !== "string" || !/^[A-Za-z0-9+/]{43}=$/.test(body.publicKey)
      || Buffer.from(body.publicKey, "base64").toString("base64") !== body.publicKey
      || typeof body.room !== "string" || !ROOM.test(body.room)) {
      return json(400, { error: "Invalid computer identity." });
    }
    const right = await ledger.admit(identity.accountId, identity.machineId);
    if (!right) return json(403, { error: "No active managed access or the computer limit has been reached." });
    if (!await new AccountMachineEndpoints(services.db).publish(identity, body.room, body.publicKey)) {
      return json(403, { error: "Computer access was revoked." });
    }
    return json(200, { ticket: signManagedTicket(billing.signingKey,
      { version: 1, accountId: identity.accountId, computerId: identity.machineId, publicKey: body.publicKey,
        room: body.room, expiresAt: right.expiresAt, source: right.source }), expiresAt: right.expiresAt, source: right.source });
  }
  const account = path === receiptPath
    ? await services.auth.accountForToken(sessionToken(request)) : null;
  if (path === receiptPath && !account) return json(401, { error: "Sign in required." });
  const signed = body[path === receiptPath ? "signedTransaction" : "signedPayload"];
  if (typeof signed !== "string" || !signed || signed.length > 15_000) {
    return json(400, { error: "A signed Apple receipt is required." });
  }
  try {
    const receipt = path === receiptPath ? await billing.receipts.transaction(signed)
      : await billing.receipts.notification(signed);
    if (!receipt || !isManagedSubscription(receipt)) return json(200, { accepted: false });
    const owner = (account ?? receipt.appAccountToken)?.toLowerCase();
    if (!owner || owner.toLowerCase() !== receipt.appAccountToken?.toLowerCase()) {
      return json(403, { error: "The purchase is linked to a different GrantTap account." });
    }
    const accepted = await ledger.acceptVerified(owner, receipt);
    return json(200, { accepted, entitlement: await ledger.entitlement(owner) });
  } catch { return json(400, { error: "Apple could not verify this receipt." }); }
}

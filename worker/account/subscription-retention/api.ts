import { randomUUID } from "node:crypto";
import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import { boundedJSON, json, sessionToken } from "../http";
import type { ManagedBilling } from "../subscriptions/api";
import { ManagedSubscriptions } from "../subscriptions";
import { SubscriptionRetention, type RetentionGrant } from ".";
import { SubscriptionCancellationFeedback } from "./feedback";

export type RetentionBilling = { keyId: string; sign(accountId: string, grant: RetentionGrant): string;
  unusedHistory(accountId: string, originalId: string): Promise<boolean> };
type Services = { db: D1Database; auth: AccountAuth; billing?: ManagedBilling };

/** Cancellation remains Apple's action; neither endpoint changes an entitlement. */
export async function routeSubscriptionRetention(request: Request, services: Services): Promise<Response | null> {
  const path = new URL(request.url).pathname;
  const offer = "/api/account/subscriptions/cancellation-offer";
  const feedback = "/api/account/subscriptions/cancellation-feedback";
  if (path !== offer && path !== feedback) return null;
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  const origin = request.headers.get("origin");
  if (origin && origin !== "https://granttap.com") return json(403, { error: "Origin not allowed." });
  const account = await services.auth.accountForToken(sessionToken(request));
  if (!account) return json(401, { error: "Sign in required." });
  if (!services.billing) return json(503, { error: "Subscription support is temporarily unavailable." });
  const body = await boundedJSON(request);
  if (!body) return json(400, { error: "Invalid request." });
  if (path === feedback) {
    const result = await new SubscriptionCancellationFeedback(services.db, services.billing.signingKey)
      .save(account, body.feedbackId, body.reason, body.comment ?? "");
    return result === "saved" ? json(200, { saved: true }) : json(result === "limited" ? 429 : 400,
      { error: result === "limited" ? "Feedback limit reached. Please try again later." : "Invalid feedback." });
  }
  if (body.intent !== "cancel") return json(400, { error: "Cancellation intent is required." });
  const retention = services.billing.retention;
  if (!retention) return json(200, { offer: null });
  const original = await new ManagedSubscriptions(services.db).originalTransaction(account);
  if (!original) return json(200, { offer: null });
  try {
    if (!await retention.unusedHistory(account, original)) return json(200, { offer: null });
    const ledger = new SubscriptionRetention(services.db);
    return json(200, { offer: await ledger.issue(account, randomUUID(), retention, true) });
  } catch {
    return json(503, { error: "Apple offer verification is temporarily unavailable." });
  }
}

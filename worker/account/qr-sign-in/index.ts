import type { D1Database } from "@cloudflare/workers-types";
import type { AccountAuth } from "../auth";
import { problem, sameOriginBrowser } from "../http";
import { AccountWebKeys } from "../web-key/store";
import { createRequest, pollRequest } from "./browser";
import { phoneDecision } from "./phone";
export { QrSignInRequests } from "./store";

/** Browser sign-in by a QR that an already signed-in phone approves. */
export async function routeQrSignIn(request: Request, db: D1Database, auth: AccountAuth,
  storageSecret?: Uint8Array): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/account/qr-sign-in/")) return null;
  const action = url.pathname.slice("/api/account/qr-sign-in/".length);
  if (!["requests", "poll", "inspect", "approve", "deny"].includes(action)) return problem(404, "not-found", "Not found.");
  if (request.method !== "POST") return problem(405, "method", "Method not allowed.");
  if (url.search) return problem(400, "invalid", "Sign-in codes belong only in the request body.");
  const keys = new AccountWebKeys(db, storageSecret);
  if (action === "requests" || action === "poll") {
    if (!sameOriginBrowser(request)) return problem(403, "same-origin-required", "Open GrantTap sign-in on granttap.com.");
    return action === "requests" ? createRequest(request, db, auth, keys) : pollRequest(request, db, auth);
  }
  return phoneDecision(request, action as "inspect" | "approve" | "deny", db, auth, keys);
}

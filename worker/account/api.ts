import { AccountAuth } from "./auth";
import type { D1Database } from "@cloudflare/workers-types";
import { D1AccountStore } from "./d1-store";
import { boundedJSON, json, sessionCookie, sessionToken, UUID } from "./http";
import { AccountMachines } from "./machines";
import { routeMachineApi } from "./machine-api";
import { AccountBetaRelay } from "./beta-relay";
import { AccountDeviceInvites, routeDeviceInvites } from "./device-invites";

export async function routeAccountApi(request: Request, auth: AccountAuth,
                                      machines?: AccountMachines,
                                      betaRelay?: AccountBetaRelay,
                                      deviceInvites?: AccountDeviceInvites): Promise<Response | null> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/account/")) return null;
  const action = url.pathname.slice("/api/account/".length);
  const isMutation = request.method !== "GET";
  const origin = request.headers.get("origin");
  if (isMutation && origin && origin !== "https://granttap.com") {
    return json(403, { error: "Origin not allowed." });
  }

  if (deviceInvites) {
    const inviteResponse = await routeDeviceInvites(request, action, auth, deviceInvites);
    if (inviteResponse) return inviteResponse;
  }

  if (machines) {
    const machineResponse = await routeMachineApi(request, auth, machines);
    if (machineResponse) return machineResponse;
  }

  if (request.method === "POST" && action === "registration/options") {
    return json(200, await auth.registrationOptions());
  }
  if (request.method === "POST" && action === "authentication/options") {
    return json(200, await auth.authenticationOptions());
  }
  if (request.method === "POST" && (action === "registration/verify" || action === "authentication/verify")) {
    const body = await boundedJSON(request);
    const ceremonyId = body?.ceremonyId;
    const response = body?.response;
    if (typeof ceremonyId !== "string" || !UUID.test(ceremonyId)
      || !response || typeof response !== "object" || Array.isArray(response)
      || typeof (response as Record<string, unknown>).id !== "string") {
      return json(400, { error: "Invalid passkey response." });
    }
    const credential = response as { id: string };
    const result = action === "registration/verify"
      ? await auth.completeRegistration(ceremonyId, credential)
      : await auth.completeAuthentication(ceremonyId, credential);
    if (!result) return json(401, { error: "Passkey verification failed or expired." });
    const nativeClient = !origin && !request.headers.has("sec-fetch-site");
    return json(200, nativeClient
      ? { accountId: result.accountId, token: result.token }
      : { accountId: result.accountId },
      { "set-cookie": sessionCookie(result.token) });
  }
  if (request.method === "GET" && action === "me") {
    const accountId = await auth.accountForToken(sessionToken(request));
    return accountId ? json(200, { accountId }) : json(401, { error: "Sign in required." });
  }
  if (request.method === "GET" && action === "beta-relay" && betaRelay) {
    const accountId = await auth.accountForToken(sessionToken(request));
    return accountId ? json(200, { expiresAt: await betaRelay.activeUntil(accountId) })
      : json(401, { error: "Sign in required." });
  }
  if (request.method === "POST" && action === "logout") {
    await auth.logout(sessionToken(request));
    return json(200, { ok: true }, { "set-cookie": sessionCookie("", 0) });
  }
  if (request.method === "DELETE" && action === "me") {
    const deleted = await auth.deleteAccount(sessionToken(request));
    return deleted
      ? json(200, { deleted: true }, { "set-cookie": sessionCookie("", 0) })
      : json(401, { error: "Sign in required." });
  }
  return json(405, { error: "Method not allowed." });
}

export function handleAccountApi(request: Request, db: D1Database): Promise<Response | null> {
  return routeAccountApi(request, new AccountAuth(new D1AccountStore(db)),
    new AccountMachines(db), new AccountBetaRelay(db), new AccountDeviceInvites(db));
}

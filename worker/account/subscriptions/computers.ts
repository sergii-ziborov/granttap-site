import type { AccountAuth } from "../auth";
import type { AccountMachines } from "../machines";
import { json, sessionToken } from "../http";
import { ManagedSubscriptions } from ".";
import type { AppleReceipts } from "./apple";
import { reconcileSubscription } from "./reconcile";

/** Controller account sessions can select publishing; machine credentials cannot. */
export async function routeManagedComputers(request: Request, ledger: ManagedSubscriptions,
  auth: AccountAuth, machines: AccountMachines, receipts: AppleReceipts): Promise<Response | null> {
  const url = new URL(request.url), base = "/api/account/subscriptions/computers";
  const leaf = new RegExp(`^${base}/([0-9a-f-]{36})$`).exec(url.pathname);
  if (url.pathname !== base && !leaf) return null;
  const account = await auth.accountForToken(sessionToken(request));
  if (!account) return json(401, { error: "Sign in required." });
  if (!leaf) {
    if (request.method !== "GET") return json(405, { error: "Method not allowed." });
    const page = await machines.listPage(account, url.searchParams.get("cursor") ?? undefined, 90);
    if (!page) return json(400, { error: "Invalid computer page." });
    const states = await ledger.computerStates(account, page.machines.map(machine => machine.id));
    const entitlement = await ledger.entitlement(account);
    return json(200, { accountId: account, limit: entitlement?.limit ?? null,
      source: entitlement?.source ?? null, selectedCount: await ledger.selectedComputerCount(account),
      nextCursor: page.nextCursor, computers: page.machines.map(machine => ({
        id: machine.id, name: machine.name,
        ...states.get(machine.id) ?? { enabled: true, selected: false },
      })) });
  }
  if (!["PUT", "DELETE"].includes(request.method)) return json(405, { error: "Method not allowed." });
  const computerId = leaf[1];
  if (await machines.owner(computerId) !== account) return json(404, { error: "Computer unavailable." });
  if (request.method === "DELETE") {
    return await ledger.release(account, computerId) ? json(200, { enabled: false })
      : json(409, { error: "The computer selection changed. Refresh and try again." });
  }
  try { await reconcileSubscription(ledger, receipts, account); }
  catch { return json(503, { error: "Apple subscription confirmation is temporarily unavailable." }); }
  return await ledger.admit(account, computerId, true) ? json(200, { enabled: true })
    : json(403, { error: "No active managed access or the computer limit has been reached." });
}

import { browserPairing } from "../ComputerConnection";
import type { BrowserPairing } from "../Cryptography";

/**
 * Controller identities the owner chose to keep in the account (from the iPhone's QR approval).
 * They stay in memory for this page only; removing the key from the account stops new pages using it.
 */
export async function accountKeyPairings(signal: AbortSignal, request: typeof fetch = fetch): Promise<BrowserPairing[]> {
  try {
    const response = await request("/api/account/web-key/material", { method: "POST", credentials: "same-origin",
      headers: { "content-type": "application/json" }, body: "{}", signal });
    if (!response.ok) return [];
    const value = await response.json() as { bundle?: unknown };
    const bundle = typeof value.bundle === "string" ? JSON.parse(value.bundle) as { schema?: unknown; pairings?: unknown } : null;
    if (bundle?.schema !== "granttap.account-web-key.v1" || !Array.isArray(bundle.pairings)) return [];
    return bundle.pairings.flatMap((pair: Record<string, unknown>) => {
      const valid = typeof pair?.machineId === "string" ? browserPairing(pair, pair.machineId) : null;
      return valid ? [valid] : [];
    });
  } catch { return []; }
}

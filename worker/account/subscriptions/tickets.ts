import { createHmac } from "node:crypto";

export type ManagedTicket = { version: 1; accountId: string; computerId: string; publicKey: string; room: string; expiresAt: number };

export function signManagedTicket(secret: Buffer, claim: ManagedTicket): string {
  if (secret.length < 32) throw new Error("Managed admission signing key is not configured.");
  const body = Buffer.from(JSON.stringify(claim)).toString("base64url");
  const signature = createHmac("sha256", secret).update(`granttap-managed-v1.${body}`).digest("base64url");
  return `${body}.${signature}`;
}

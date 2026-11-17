import { createHash, randomBytes, randomUUID } from "node:crypto";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type { SessionDetails } from "./devices/client";

const RP_ID = "granttap.com";
const ORIGIN = "https://granttap.com";
const CEREMONY_MS = 2 * 60_000;
const SESSION_MS = 30 * 24 * 60 * 60_000;

export type Ceremony = {
  id: string;
  kind: "registration" | "authentication";
  challenge: string;
  accountId: string | null;
  expiresAt: number;
};

export type StoredCredential = {
  id: string;
  accountId: string;
  publicKey: Uint8Array;
  counter: number;
  transports?: string[];
};

export type SessionRecord = { accountId: string; expiresAt: number; loginTokenId?: string;
  delegated?: boolean; signIn?: string | null };
export type StoredSessionDetails = SessionDetails & { id: string; createdAt: number };

export interface AccountStore {
  saveCeremony(row: Ceremony): Promise<void>;
  consumeCeremony(id: string): Promise<Ceremony | null>;
  createAccount(accountId: string, credential: StoredCredential): Promise<boolean>;
  credential(id: string): Promise<StoredCredential | null>;
  updateCounter(id: string, previous: number, counter: number): Promise<boolean>;
  saveSession(hash: string, accountId: string, expiresAt: number): Promise<void>;
  session(hash: string): Promise<SessionRecord | null>;
  removeSession(hash: string): Promise<void>;
  saveSessionDetails?(hash: string, details: StoredSessionDetails): Promise<void>;
  touchSession?(hash: string, now: number): Promise<void>;
  deleteAccount(accountId: string): Promise<void>;
}

export interface PasskeyVerifier {
  register(response: unknown, challenge: string): Promise<{
    verified: boolean;
    credential?: { id: string; publicKey: Uint8Array; counter: number; transports?: string[] };
  }>;
  authenticate(response: unknown, challenge: string, credential: StoredCredential): Promise<{
    verified: boolean;
    newCounter?: number;
  }>;
}

export const platformPasskeyVerifier: PasskeyVerifier = {
  async register(response, challenge) {
    const result = await verifyRegistrationResponse({
      response: response as Parameters<typeof verifyRegistrationResponse>[0]["response"],
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
      supportedAlgorithmIDs: [-7],
    });
    return { verified: result.verified, credential: result.registrationInfo?.credential };
  },
  async authenticate(response, challenge, credential) {
    const result = await verifyAuthenticationResponse({
      response: response as Parameters<typeof verifyAuthenticationResponse>[0]["response"],
      expectedChallenge: challenge,
      expectedOrigin: ORIGIN,
      expectedRPID: RP_ID,
      requireUserVerification: true,
      credential: {
        id: credential.id,
        publicKey: new Uint8Array(credential.publicKey),
        counter: credential.counter,
        transports: credential.transports as Parameters<typeof verifyAuthenticationResponse>[0]["credential"]["transports"],
      },
    });
    return { verified: result.verified, newCounter: result.authenticationInfo.newCounter };
  },
};

export function tokenHash(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export class AccountAuth {
  constructor(
    private readonly store: AccountStore,
    private readonly verifier: PasskeyVerifier = platformPasskeyVerifier,
    private readonly now: () => number = Date.now,
  ) {}

  async registrationOptions() {
    const accountId = randomUUID();
    const options = await generateRegistrationOptions({
      rpName: "GrantTap",
      rpID: RP_ID,
      userID: new TextEncoder().encode(accountId),
      userName: `GrantTap ${accountId.slice(0, 8)}`,
      attestationType: "none",
      authenticatorSelection: { residentKey: "required", userVerification: "required" },
      supportedAlgorithmIDs: [-7],
    });
    const ceremonyId = randomUUID();
    await this.store.saveCeremony({ id: ceremonyId, kind: "registration",
      challenge: options.challenge, accountId, expiresAt: this.now() + CEREMONY_MS });
    return { ceremonyId, options };
  }

  async completeRegistration(ceremonyId: string, response: { id: string }, details?: SessionDetails) {
    const ceremony = await this.store.consumeCeremony(ceremonyId);
    if (!ceremony || ceremony.kind !== "registration" || !ceremony.accountId
      || ceremony.expiresAt <= this.now()) return null;
    try {
      const result = await this.verifier.register(response, ceremony.challenge);
      if (!result.verified || !result.credential || result.credential.id !== response.id) return null;
      const saved = await this.store.createAccount(ceremony.accountId, {
        ...result.credential, accountId: ceremony.accountId,
      });
      return saved ? this.createSession(ceremony.accountId, details) : null;
    } catch { return null; }
  }

  async authenticationOptions() {
    const options = await generateAuthenticationOptions({
      rpID: RP_ID, userVerification: "required", allowCredentials: [],
    });
    const ceremonyId = randomUUID();
    await this.store.saveCeremony({ id: ceremonyId, kind: "authentication",
      challenge: options.challenge, accountId: null, expiresAt: this.now() + CEREMONY_MS });
    return { ceremonyId, options };
  }

  async completeAuthentication(ceremonyId: string, response: { id: string }, details?: SessionDetails) {
    const ceremony = await this.store.consumeCeremony(ceremonyId);
    if (!ceremony || ceremony.kind !== "authentication" || ceremony.expiresAt <= this.now()) return null;
    const credential = await this.store.credential(response.id);
    if (!credential) return null;
    try {
      const result = await this.verifier.authenticate(response, ceremony.challenge, credential);
      if (!result.verified || result.newCounter == null) return null;
      if (!await this.store.updateCounter(credential.id, credential.counter, result.newCounter)) return null;
      return this.createSession(credential.accountId, details);
    } catch { return null; }
  }

  async accountForToken(token: string): Promise<string | null> {
    return (await this.sessionInfo(token))?.accountId ?? null;
  }

  /** A valid session, with its last use recorded at most every few minutes. */
  async sessionInfo(token: string): Promise<SessionRecord | null> {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
    const hash = tokenHash(token);
    const session = await this.store.session(hash);
    if (!session || session.expiresAt <= this.now()) return null;
    await this.store.touchSession?.(hash, this.now());
    return session;
  }

  async canManageCredentials(token: string): Promise<boolean> {
    const session = await this.sessionInfo(token);
    return !!session && !session.loginTokenId && !session.delegated;
  }

  async logout(token: string): Promise<void> {
    if (/^[A-Za-z0-9_-]{43}$/.test(token)) await this.store.removeSession(tokenHash(token));
  }

  async deleteAccount(token: string): Promise<boolean> {
    const accountId = await this.accountForToken(token);
    if (!accountId) return false;
    await this.store.deleteAccount(accountId);
    return true;
  }

  async createSession(accountId: string, details?: SessionDetails) {
    const token = randomBytes(32).toString("base64url");
    await this.store.saveSession(tokenHash(token), accountId, this.now() + SESSION_MS);
    if (details) await this.store.saveSessionDetails?.(tokenHash(token), { ...details, id: randomUUID(), createdAt: this.now() });
    return { accountId, token };
  }
}

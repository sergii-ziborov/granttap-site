// @vitest-environment node
import { createHash, createSign, generateKeyPairSync, randomBytes } from "node:crypto";
import { encodeCBOR, type CBORType } from "@levischuck/tiny-cbor";
import { describe, expect, it } from "vitest";
import type { D1Database } from "@cloudflare/workers-types";
import { AccountAuth } from "../../worker/account/auth";
import { D1AccountStore } from "../../worker/account/d1-store";
import { SqliteD1 } from "./account-sqlite";

const origin = "https://granttap.com";
const rpHash = createHash("sha256").update("granttap.com").digest();
const key = generateKeyPairSync("ec", { namedCurve: "prime256v1" });
const jwk = key.publicKey.export({ format: "jwk" });
const credentialID = randomBytes(32);
const id = credentialID.toString("base64url");

function clientData(type: string, challenge: string, site = origin): string {
  return Buffer.from(JSON.stringify({ type, challenge, origin: site, crossOrigin: false })).toString("base64url");
}

function counterBytes(value: number): Buffer {
  const bytes = Buffer.alloc(4);
  bytes.writeUInt32BE(value);
  return bytes;
}

function authenticatorData(counter: number, flags: number): Buffer {
  return Buffer.concat([rpHash, Buffer.from([flags]), counterBytes(counter)]);
}

function registration(challenge: string, flags = 0x45) {
  const cose = encodeCBOR(new Map<string | number, CBORType>([
    [1, 2], [3, -7], [-1, 1],
    [-2, Buffer.from(jwk.x!, "base64url")], [-3, Buffer.from(jwk.y!, "base64url")],
  ]));
  const idLength = Buffer.alloc(2);
  idLength.writeUInt16BE(credentialID.length);
  const authData = Buffer.concat([
    authenticatorData(0, flags), Buffer.alloc(16), idLength, credentialID, Buffer.from(cose),
  ]);
  return {
    id, rawId: id, type: "public-key",
    response: {
      clientDataJSON: clientData("webauthn.create", challenge),
      attestationObject: Buffer.from(encodeCBOR(new Map<string | number, CBORType>([
        ["fmt", "none"], ["attStmt", new Map()], ["authData", authData],
      ]))).toString("base64url"),
      transports: ["internal"],
    },
    clientExtensionResults: {},
  };
}

function assertion(challenge: string, counter: number, site = origin, flags = 0x05) {
  const authData = authenticatorData(counter, flags);
  const client = clientData("webauthn.get", challenge, site);
  const signed = Buffer.concat([authData, createHash("sha256").update(Buffer.from(client, "base64url")).digest()]);
  const signer = createSign("SHA256");
  signer.update(signed);
  return {
    id, rawId: id, type: "public-key",
    response: {
      clientDataJSON: client,
      authenticatorData: authData.toString("base64url"),
      signature: signer.sign(key.privateKey).toString("base64url"),
      userHandle: null,
    },
    clientExtensionResults: {},
  };
}

describe("real WebAuthn verification", () => {
  it("accepts a signed resident passkey and rejects wrong origin, missing UV, and counter replay", async () => {
    const db = new SqliteD1();
    const auth = new AccountAuth(new D1AccountStore(db as unknown as D1Database));
    const create = await auth.registrationOptions();
    const account = await auth.completeRegistration(create.ceremonyId, registration(create.options.challenge));
    expect(account?.accountId).toBeTruthy();

    const login = await auth.authenticationOptions();
    expect((await auth.completeAuthentication(login.ceremonyId,
      assertion(login.options.challenge, 1)))?.accountId).toBe(account?.accountId);

    const wrongOrigin = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(wrongOrigin.ceremonyId,
      assertion(wrongOrigin.options.challenge, 2, "https://evil.example"))).toBeNull();

    const noUV = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(noUV.ceremonyId,
      assertion(noUV.options.challenge, 2, origin, 0x01))).toBeNull();

    const replay = await auth.authenticationOptions();
    expect(await auth.completeAuthentication(replay.ceremonyId,
      assertion(replay.options.challenge, 1))).toBeNull();
  });
});

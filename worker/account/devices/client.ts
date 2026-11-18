import { bearerToken, sessionToken } from "../http";

export type DeviceKind = "browser" | "iphone" | "ipad" | "mac" | "app" | "unknown";
export type SignInMethod = "passkey" | "password" | "qr" | "token" | "invite";
export type SessionDetails = { kind: DeviceKind; name: string; signIn: SignInMethod; delegated: boolean };
export type HeaderSource = { get(name: string): string | null };

/** Native GrantTap clients send neither header; any browser fetch sends at least one. */
export function isNativeClient(headers: HeaderSource): boolean {
  return headers.get("origin") === null && headers.get("sec-fetch-site") === null;
}

const browsers: Array<[RegExp, string]> = [
  [/\bEdg(?:e|A|iOS)?\//, "Edge"], [/\bOPR\/|\bOpera\b/, "Opera"], [/\bSamsungBrowser\//, "Samsung Internet"],
  [/\bFirefox\/|\bFxiOS\//, "Firefox"], [/\bCriOS\/|\bChrome\/|\bChromium\//, "Chrome"],
  [/\bVersion\/[\d.]+.*\bSafari\//, "Safari"],
];
const systems: Array<[RegExp, string]> = [
  [/\biPhone\b/, "iOS"], [/\biPad\b/, "iPadOS"], [/\bAndroid\b/, "Android"], [/\bCrOS\b/, "ChromeOS"],
  [/\bWindows\b/, "Windows"], [/\bMac OS X\b|\bMacintosh\b/, "macOS"], [/\bLinux\b/, "Linux"],
];

/** A coarse, user-recognisable label. It is what the browser claims, not a verified identity. */
export function browserLabel(userAgent: string | null): { name: string; os: string; label: string } {
  const value = (userAgent ?? "").slice(0, 512);
  const name = browsers.find(([pattern]) => pattern.test(value))?.[1] ?? "Unknown browser";
  const os = systems.find(([pattern]) => pattern.test(value))?.[1] ?? "Unknown system";
  const label = name === "Unknown browser" && os === "Unknown system" ? "Unknown browser"
    : name === "Unknown browser" ? `Browser on ${os}` : os === "Unknown system" ? name : `${name} on ${os}`;
  return { name, os, label };
}

export function describeClient(headers: HeaderSource, signIn: SignInMethod, delegated = false): SessionDetails {
  if (isNativeClient(headers)) return { kind: "app", name: "GrantTap app", signIn, delegated };
  return { kind: "browser", name: browserLabel(headers.get("user-agent")).label, signIn, delegated };
}

export type SessionTransport = { kind: Extract<DeviceKind, "app" | "browser">; name: string };

/** A bearer from a native client is the app; a cookie sent by a browser is that browser. Anything else says nothing. */
export function describeTransport(request: Request): SessionTransport | null {
  const native = isNativeClient(request.headers);
  if (bearerToken(request)) return native ? { kind: "app", name: "GrantTap app" } : null;
  return !native && sessionToken(request) ? { kind: "browser", name: browserLabel(request.headers.get("user-agent")).label } : null;
}

/** Adapts Node's lower-cased header record for the connect service. */
export function nodeHeaders(headers: Record<string, string | string[] | undefined>): HeaderSource {
  return { get: name => { const value = headers[name.toLowerCase()]; return typeof value === "string" ? value : null; } };
}

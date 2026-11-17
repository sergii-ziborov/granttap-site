export type NativeHandoff = { kind: "token" | "qr"; link: string };

/** A fragment never travels in the HTTP request or referrer. */
export function nativeSignInLink(fragment: string): string | null {
  return nativeHandoff(fragment)?.link ?? null;
}

/** Only the two exact app formats: a sign-in token, or a browser QR that a signed-in phone approves. */
export function nativeHandoff(fragment: string): NativeHandoff | null {
  if (/^#token=gt_login_[A-Za-z0-9_-]{43}$/.test(fragment)) return { kind: "token", link: "granttap://sign-in" + fragment };
  if (/^#qr=[A-Za-z0-9_-]{43}\.[A-Za-z0-9_-]{43}$/.test(fragment)) return { kind: "qr", link: "granttap://sign-in" + fragment };
  return null;
}

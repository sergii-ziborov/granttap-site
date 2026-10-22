/** A fragment never travels in the HTTP request or referrer. */
export function nativeSignInLink(fragment: string): string | null {
  return /^#token=gt_login_[A-Za-z0-9_-]{43}$/.test(fragment)
    ? "granttap://sign-in" + fragment : null;
}

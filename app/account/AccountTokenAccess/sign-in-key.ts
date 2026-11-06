/** Accept a pasted native QR link without navigating to it or placing its secret in an HTTP URL. */
export function parseSignInKey(input: string): string | null {
  const text = input.trim();
  const valid = /^gt_login_[A-Za-z0-9_-]{43}$/;
  if (text.length > 256) return null;
  if (valid.test(text)) return text;
  try {
    const url = new URL(text);
    if (url.username || url.password || url.port || url.search
      || !((url.protocol === "https:" && url.host === "granttap.com" && url.pathname === "/sign-in")
        || (url.protocol === "granttap:" && url.host === "sign-in" && url.pathname === ""))) return null;
    const secret = url.hash.startsWith("#token=") ? url.hash.slice(7) : "";
    return valid.test(secret) ? secret : null;
  } catch { return null; }
}

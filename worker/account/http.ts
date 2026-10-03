export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function json(status: number, body: unknown, extra?: HeadersInit): Response {
  return new Response(JSON.stringify(body), { status, headers: {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "referrer-policy": "no-referrer",
    ...extra,
  } });
}

export async function boundedJSON(request: Request): Promise<Record<string, unknown> | null> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16_384) { await reader.cancel(); return null; }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    const value = JSON.parse(new TextDecoder().decode(bytes)) as unknown;
    return value && typeof value === "object" && !Array.isArray(value)
      ? value as Record<string, unknown> : null;
  } catch { return null; }
}

export function sessionToken(request: Request): string {
  const bearer = bearerToken(request);
  if (bearer) return bearer;
  const cookie = request.headers.get("cookie")?.match(/(?:^|;\s*)granttap_session=([A-Za-z0-9_-]{43})(?:;|$)/);
  return cookie?.[1] ?? "";
}

export function bearerToken(request: Request): string {
  return request.headers.get("authorization")?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1] ?? "";
}

export function sessionCookie(token: string, expires = 30 * 24 * 60 * 60): string {
  return `granttap_session=${token}; Path=/api/account; HttpOnly; Secure; SameSite=Strict; Max-Age=${expires}`;
}

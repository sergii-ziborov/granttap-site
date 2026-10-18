export function json(res, status, body) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(payload),
  });
  res.end(payload);
}

export function html(res, status, body) {
  res.writeHead(status, {
    "content-type": "text/html; charset=utf-8",
    "cache-control": "no-store",
    "content-length": Buffer.byteLength(body),
  });
  res.end(body);
}

export function requestSecret(req) {
  return req.headers.authorization?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)?.[1];
}

export async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  if (chunks.length === 0) return null;
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return null;
  }
}

export async function webRequest(req) {
  const chunks = [];
  let length = 0;
  for await (const chunk of req) {
    length += chunk.length;
    if (length > 16_384) throw new Error("Request too large");
    chunks.push(chunk);
  }
  return new Request(`https://granttap.com${req.url}`, {
    method: req.method,
    headers: req.headers,
    body: chunks.length ? Buffer.concat(chunks) : undefined,
  });
}

export async function sendResponse(res, response) {
  const headers = Object.fromEntries(response.headers);
  const body = Buffer.from(await response.arrayBuffer());
  res.writeHead(response.status, { ...headers, "content-length": body.length });
  res.end(body);
}


import association from "../../worker/site-policy/apple-app-site-association.json" with { type: "json" };

export const APP_SITE_ASSOCIATION_PATH = "/.well-known/apple-app-site-association";
const body = Buffer.from(JSON.stringify(association));

/** Apple fetches this exact path over HTTPS and accepts only a direct JSON answer. */
export function serveAppSiteAssociation(request, response) {
  if ((request.url ?? "").split(/[?#]/, 1)[0] !== APP_SITE_ASSOCIATION_PATH) return false;
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
    response.end("Method not allowed");
    return true;
  }
  response.writeHead(200, { "content-type": "application/json", "content-length": body.length,
    "cache-control": "public, max-age=3600", "x-content-type-options": "nosniff" });
  response.end(request.method === "HEAD" ? undefined : body);
  return true;
}

/** Answer before the page router so the site's HTML 404 never claims this path. */
export function installAppSiteAssociation(server) {
  const handlers = server.listeners("request");
  server.removeAllListeners("request");
  server.on("request", (request, response) => {
    if (serveAppSiteAssociation(request, response)) return;
    for (const handler of handlers) handler.call(server, request, response);
  });
}

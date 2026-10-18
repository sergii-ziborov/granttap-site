import { constants, closeSync, createReadStream, fstatSync, lstatSync, openSync } from "node:fs";
import { join } from "node:path";

const prefix = "/downloads/engine/";
const version = /^\d+\.\d+\.\d+(?:-[A-Za-z0-9][A-Za-z0-9.-]{0,64})?$/;
const filename = /^(?:granttap-engine-(?:darwin|linux)-(?:arm64|x64)|LICENSE\.txt|THIRD_PARTY_LICENSES\.txt|manifest\.json)$/;
const maxBytes = 40 * 1024 * 1024;

function unavailable(response, code = 404) {
  response.writeHead(code, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store",
    "x-content-type-options": "nosniff", ...(code === 405 ? { allow: "GET, HEAD" } : {}) });
  response.end(code === 405 ? "Method not allowed" : "Not found");
}

/** Serve only immutable, explicitly named Engine artifacts after the site build. */
export function serveEngineDownload(request, response, root) {
  const path = (request.url ?? "").split(/[?#]/, 1)[0];
  if (!path.startsWith(prefix)) return false;
  if (!["GET", "HEAD"].includes(request.method)) { unavailable(response, 405); return true; }
  const parts = path.slice(prefix.length).split("/");
  if (parts.length !== 2 || !version.test(parts[0]) || !filename.test(parts[1])) {
    unavailable(response); return true;
  }
  let fd;
  try {
    const directory = join(root, parts[0]);
    for (const parent of [root, directory]) {
      const stat = lstatSync(parent);
      if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error("Unservable artifact directory");
    }
    fd = openSync(join(directory, parts[1]), constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0));
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > maxBytes) throw new Error("Unservable artifact");
    const type = parts[1].endsWith(".json") ? "application/json" : parts[1].endsWith(".txt")
      ? "text/plain; charset=utf-8" : "application/octet-stream";
    response.writeHead(200, { "content-type": type, "content-length": stat.size,
      "content-disposition": `attachment; filename="${parts[1]}"`, "x-content-type-options": "nosniff",
      "cache-control": parts[1] === "manifest.json" ? "public, max-age=300" : "public, max-age=31536000, immutable" });
    if (request.method === "HEAD") { closeSync(fd); fd = undefined; response.end(); return true; }
    const stream = createReadStream("", { fd, autoClose: true }); fd = undefined;
    stream.on("error", () => response.destroy());
    response.on("close", () => stream.destroy());
    stream.pipe(response);
  } catch {
    if (fd !== undefined) closeSync(fd);
    if (!response.headersSent) unavailable(response); else response.destroy();
  }
  return true;
}

/** Preserve the site's request handler for every route outside the artifact prefix. */
export function installEngineDownloads(server, root) {
  const handlers = server.listeners("request");
  server.removeAllListeners("request");
  server.on("request", (request, response) => {
    if (serveEngineDownload(request, response, root)) return;
    for (const handler of handlers) handler.call(server, request, response);
  });
}

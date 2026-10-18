import { startProdServer } from "vinext/server/prod-server";
import { installEngineDownloads } from "./engine-downloads/index.mjs";

const port = Number(process.env.PORT ?? "3211");
const host = process.env.HOST ?? "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be a valid TCP port");
}

const { server } = await startProdServer({
  port,
  host,
  outDir: new URL("../dist", import.meta.url).pathname,
});
installEngineDownloads(server, new URL("../dist/client/downloads/engine", import.meta.url).pathname);

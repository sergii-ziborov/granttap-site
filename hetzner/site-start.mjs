import { startProdServer } from "vinext/server/prod-server";

const port = Number(process.env.PORT ?? "3211");
const host = process.env.HOST ?? "0.0.0.0";

if (!Number.isInteger(port) || port < 1 || port > 65_535) {
  throw new Error("PORT must be a valid TCP port");
}

await startProdServer({
  port,
  host,
  outDir: new URL("../dist", import.meta.url).pathname,
});

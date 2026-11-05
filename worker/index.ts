/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleConnectApi } from "./connect-api";
import { handleAccountApi } from "./account/api";
import { handleRuntimeFaultsApi } from "./runtime-faults";
import { AccountAuth } from "./account/auth";
import { D1AccountStore } from "./account/d1-store";
import { AccountMachines } from "./account/machines";
import type { D1Database } from "@cloudflare/workers-types";

import { canonicalRedirect, withSecurityHeaders } from "./site-policy";

interface AssetFetcher {
  fetch(request: Request): Promise<Response>;
}

interface Env {
  ASSETS: AssetFetcher;
  ACCOUNTS_DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const redirect = canonicalRedirect(url);
    if (redirect) return withSecurityHeaders(request, Response.redirect(redirect, 308));

    if (url.pathname === "/.well-known/apple-app-site-association") {
      return withSecurityHeaders(request, new Response(JSON.stringify({
        webcredentials: { apps: ["XMS5ZC28UJ.com.ziborov.granttap"] },
      }), { headers: { "content-type": "application/json; charset=utf-8" } }));
    }

    const database = env?.ACCOUNTS_DB;
    const account = database ? await handleAccountApi(request, database) : null;
    if (account) return withSecurityHeaders(request, account);

    const fault = database ? await handleRuntimeFaultsApi(request, database) : null;
    if (fault) return withSecurityHeaders(request, fault);

    const connect = await handleConnectApi(request,
      database ? new AccountAuth(new D1AccountStore(database)) : undefined,
      database ? new AccountMachines(database) : undefined);
    if (connect) return withSecurityHeaders(request, connect);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(request, response);
    }

    const response = await handler.fetch(request, env, ctx);
    return withSecurityHeaders(request, response);
  },
};

export default worker;

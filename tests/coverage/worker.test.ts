import { expect, test, vi } from "vitest";

const doubles = vi.hoisted(() => ({ app: vi.fn(), optimize: vi.fn() }));

vi.mock("vinext/server/app-router-entry", () => ({ default: { fetch: doubles.app } }));
vi.mock("vinext/server/image-optimization", () => ({
  DEFAULT_DEVICE_SIZES: [320],
  DEFAULT_IMAGE_SIZES: [16],
  handleImageOptimization: doubles.optimize,
}));

import worker from "../../worker/index";

const context = { waitUntil: vi.fn(), passThroughOnException: vi.fn() };
const env = {
  ASSETS: { fetch: vi.fn(async () => new Response("asset")) },
  IMAGES: { input: vi.fn(() => ({ transform: () => ({ output: async () => ({ response: () => new Response("image") }) }) })) },
};

test("redirects alternate hosts with production security headers", async () => {
  const response = await worker.fetch(new Request("https://www.granttap.com/pricing?from=www"), env, context);

  expect(response.status).toBe(308);
  expect(response.headers.get("location")).toBe("https://granttap.com/pricing?from=www");
  expect(response.headers.get("strict-transport-security")).toContain("max-age=63072000");
});

test("adds headers to app responses and omits HSTS on HTTP", async () => {
  doubles.app.mockResolvedValueOnce(new Response("app"));
  const response = await worker.fetch(new Request("http://granttap.com/support"), env, context);

  expect(response.headers.get("content-security-policy")).toContain("frame-ancestors 'none'");
  expect(response.headers.get("strict-transport-security")).toBeNull();
});

test("optimizes image requests through the configured asset and image bindings", async () => {
  doubles.optimize.mockImplementation(async (_request, options) => {
    await options.fetchAsset("/app-icon.png");
    await options.transformImage(new ReadableStream(), { width: 0, format: "png", quality: 80 });
    await options.transformImage(new ReadableStream(), { width: 320, format: "webp", quality: 80 });
    return new Response("optimized");
  });

  const response = await worker.fetch(new Request("https://granttap.com/_vinext/image"), env, context);

  expect(await response.text()).toBe("optimized");
  expect(env.ASSETS.fetch).toHaveBeenCalled();
  expect(env.IMAGES.input).toHaveBeenCalledTimes(2);
});

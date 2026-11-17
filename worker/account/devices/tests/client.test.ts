// @vitest-environment node
import { expect, it } from "vitest";
import { browserLabel, describeClient, isNativeClient, nodeHeaders } from "../client";

it("labels common browsers and systems coarsely and admits what it does not know", () => {
  const cases: Array<[string, string]> = [
    ["Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1", "Safari on iOS"],
    ["Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Safari/605.1.15", "Safari on macOS"],
    ["Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36 Edg/142.0", "Edge on Windows"],
    ["Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0", "Firefox on Linux"],
    ["Mozilla/5.0 (Linux; Android 15) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/27.0 Chrome/125.0 Mobile Safari/537.36", "Samsung Internet on Android"],
    ["Mozilla/5.0 (X11; CrOS x86_64 16000.0.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36", "Chrome on ChromeOS"],
    ["Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/142.0 Mobile/15E148 Safari/604.1", "Chrome on iPadOS"],
    ["Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0 Safari/537.36 OPR/120.0", "Opera on Windows"],
    ["Mozilla/5.0 (Windows NT 10.0)", "Browser on Windows"],
    ["Firefox/140.0", "Firefox"],
    ["curl/8.7", "Unknown browser"],
  ];
  for (const [agent, label] of cases) expect(browserLabel(agent).label).toBe(label);
  expect(browserLabel(null)).toEqual({ name: "Unknown browser", os: "Unknown system", label: "Unknown browser" });
});

it("tells native app requests from browser requests by their fetch headers", () => {
  expect(isNativeClient(new Headers())).toBe(true);
  expect(isNativeClient(new Headers({ origin: "" }))).toBe(false);
  expect(describeClient(new Headers(), "invite")).toEqual({ kind: "app", name: "GrantTap app", signIn: "invite", delegated: false });
  expect(describeClient(new Headers({ "sec-fetch-site": "same-origin" }), "qr", true))
    .toEqual({ kind: "browser", name: "Unknown browser", signIn: "qr", delegated: true });
  const node = nodeHeaders({ origin: "https://granttap.com", "set-cookie": ["a", "b"] });
  expect(node.get("Origin")).toBe("https://granttap.com");
  expect(node.get("set-cookie")).toBeNull();
});

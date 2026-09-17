import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const html = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), "../hetzner/public/connect.html"),
  "utf8",
);

test("connect page can approve the one saved phone before the helper marks it seen", () => {
  assert.match(html, /if \(!selectedPhone && phones\.length === 1 && phones\[0\]\.name\) selectedPhone = phones\[0\]\.name;/);
  assert.match(html, /const canApprove = Boolean\(auth && selectedPhone && !row\.decision && !busy\);/);
  assert.doesNotMatch(html, /seenPhones\.some/);
  assert.doesNotMatch(
    html,
    /setTimeout\(\s*\(\)\s*=>\s*\{\s*if \(pairingViewId\) void showQr\(true/,
    "refreshing the QR must not mint a second pairing",
  );
});

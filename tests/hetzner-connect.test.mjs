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
  assert.match(html, /const canApprove = Boolean\(auth && selectedPhone && !row\.redirectUrl && !busy\);/);
  assert.match(html, /helperOrigin\(\) \+ "\/oauth\/decision"/);
  assert.match(html, /This computer has not finished authorization\. Tap Approve again\./);
  assert.doesNotMatch(html, /seenPhones\.some/);
  assert.doesNotMatch(
    html,
    /setTimeout\(\s*\(\)\s*=>\s*\{\s*if \(pairingViewId\) void showQr\(true/,
    "refreshing the QR must not mint a second pairing",
  );
});

test("scanning the QR is the Approve; the coding-app callback is a top-level redirect", () => {
  assert.match(html, /function maybeApproveScan\(row\)/);
  assert.match(html, /phone\.status === "seen"/);
  assert.doesNotMatch(html, /row\.paired && phones\.length/);
  assert.match(html, /void decide\("approve"\)/);
  assert.match(html, /The coding-app callback waits for Approve or that scan/);
  assert.match(html, /function handOffOAuth\(redirectUrl\)/);
  assert.match(html, /window\.location\.assign\(redirectUrl\)/);
  assert.doesNotMatch(html, /document\.createElement\("iframe"\)/);
  assert.match(html, /setInterval\(tick, 3000\)/);
  assert.doesNotMatch(html, /setInterval\(tick, 1000\)/);
  assert.match(html, /auth && !pairingViewId \? `<button class="primary" id="approve"/);
  assert.doesNotMatch(html, /127\.0\.0\.1:17342/);
});

test("the devices page shows this computer's short room id next to its name", () => {
  assert.match(html, /row\.roomPrefix \? ` · \$\{esc\(String\(row\.roomPrefix\)\.slice\(0, 8\)\)\}…`/);
});

test("an already paired Mac does not mint a QR just because Cursor asked again", () => {
  assert.match(html, /if \(!paired\) \{\s*pairingTried = true;\s*void showQr\(false, false\);/);
});

test("paired devices keep Reconnect and Add another even while a QR is showing", () => {
  assert.match(html, /\$\{paired \? `<button class="ghost" id="reconnect"/);
  assert.match(html, /\$\{paired \? `<button class="ghost" id="another"/);
  assert.doesNotMatch(html, /paired && !pairingViewId \? `<button class="ghost" id="reconnect"/);
  assert.match(html, /Reconnect this iPhone/);
  assert.match(html, /Add another device/);
  assert.match(html, /"reconnect"\)\?\.addEventListener\("click", \(\) => void showQr\(true, false, false\)\)/);
  assert.match(html, /"another"\)\?\.addEventListener\("click", \(\) => void showQr\(true, false, true\)\)/);
  assert.match(html, /if \(addDevice\) body\.set\("mode", "add_device"\)/);
  assert.doesNotMatch(html, /Reconnect replaces the current pairing/);
});

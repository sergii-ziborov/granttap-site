// @vitest-environment node
import { expect, it } from "vitest";
import { encodeQr } from "../encode";
import { referenceMatrices } from "./reference";

it("matches reference matrices bit for bit, including version information and split blocks", () => {
  for (const reference of referenceMatrices) {
    const text = reference.text ?? "x".repeat(reference.repeat);
    const matrix = encodeQr(text, { level: reference.level, mask: reference.mask });
    expect(matrix.version).toBe(reference.version);
    const rows = matrix.dark.map(row => row.map(dark => dark ? "1" : "0").join(""));
    expect(rows).toEqual(reference.rows.map(row => BigInt("0x" + row).toString(2).padStart(matrix.size, "0")));
  }
});

it("chooses the smallest version and a valid mask, and refuses text it cannot hold", () => {
  const sign = encodeQr("https://granttap.com/sign-in#qr=" + "A".repeat(43) + "." + "B".repeat(43));
  expect(sign).toMatchObject({ version: 7, size: 45 });
  expect(sign.mask).toBeGreaterThanOrEqual(0);
  expect(sign.mask).toBeLessThan(8);
  expect(encodeQr("hello", { level: "L" }).version).toBe(1);
  expect(() => encodeQr("x".repeat(400))).toThrow(/too long/);
});

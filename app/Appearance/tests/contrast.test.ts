import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const css = (path: string) => readFileSync(join(process.cwd(), path), "utf8");
const foundation = css("app/styles/foundation.css");
const commerce = css("app/styles/commerce.css");
const appearance = css("app/Appearance/appearance.css");

function block(source: string, selector: string) {
  const start = source.indexOf(`${selector} {`);
  expect(start, selector).toBeGreaterThanOrEqual(0);
  return source.slice(start, source.indexOf("}", start));
}
function tokens(...blocks: string[]) {
  const values: Record<string, string> = {};
  for (const text of blocks) {
    for (const [, name, value] of text.matchAll(/--([\w-]+):\s*#([0-9a-f]{6}|[0-9a-f]{3})\b/gi)) {
      values[name] = "#" + (value.length === 3 ? [...value].map(digit => digit + digit).join("") : value).toLowerCase();
    }
  }
  return values;
}
function luminance(hex: string) {
  const channel = (offset: number) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}
function contrast(a: string, b: string) {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

const dark = tokens(block(foundation, ":root"), block(appearance, ":root"));
const light = { ...dark, ...tokens(block(appearance, 'html[data-theme="light"]')) };
const noScriptLight = { ...dark, ...tokens(appearance.slice(appearance.indexOf("@media (prefers-color-scheme: light)"))) };

test("install command blocks take their surface and text from the same theme", () => {
  const pre = block(commerce, ".install-card pre");
  expect(pre).toContain("background: var(--code-bg)");
  expect(pre).toContain("color: var(--code-ink)");
  expect(pre).not.toMatch(/background:\s*#/);
  for (const theme of [dark, light, noScriptLight]) {
    expect(contrast(theme["code-ink"], theme["code-bg"])).toBeGreaterThanOrEqual(4.5);
  }
  expect(light["code-bg"]).not.toBe(dark["code-bg"]);
});

test("light body, accent and status text meets WCAG AA on light surfaces", () => {
  for (const theme of [light, noScriptLight]) {
    for (const surface of [theme.paper, theme.panel, theme["panel-raised"], theme["code-bg"]]) {
      for (const text of [theme.ink, theme.muted, theme["accent-ink"], theme.orange, theme.green]) {
        expect(contrast(text, surface), `${text} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  }
  expect(contrast("#ffffff", light.orange)).toBeGreaterThanOrEqual(4.5);
});

test("home sections painted on fixed dark surfaces switch to light surfaces in the light theme", () => {
  for (const selector of [".mesh-route span", ".mesh-questions article", ".security-facts article", ".security-section", ".availability-card"]) {
    expect(appearance).toMatch(new RegExp(`html\\[data-theme="light"\\] ${selector.replace(/[.]/g, "\\.")}[^{]*\\{[^}]*background:`));
  }
});

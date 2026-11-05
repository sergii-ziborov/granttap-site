import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import RootLayout from "../../app/layout";
const headerState = vi.hoisted(() => ({ locale: "en" }));
vi.mock("next/headers", () => ({ headers: async () => new Headers({ "x-granttap-locale": headerState.locale }) }));
test("the document language is set by the server and appearance resolves before its content", async () => {
  for (const locale of ["en", "ru"]) {
    headerState.locale = locale;
    const html = renderToStaticMarkup(await RootLayout({ children: <span>GrantTap route</span> }));
    expect(html).toContain(`lang="${locale}"`); expect(html).toContain("GrantTap route");
    expect(html.indexOf("granttap.theme")).toBeLessThan(html.indexOf("<body"));
  }
});

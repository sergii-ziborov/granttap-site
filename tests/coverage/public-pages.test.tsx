import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import AccessibilityPage from "../../app/accessibility/page";
import DataRightsPage from "../../app/data-rights/page";
import LicensesPage from "../../app/licenses/page";
import PricingPage from "../../app/pricing/page";
import PrivacyPage from "../../app/privacy/page";
import SecurityPage from "../../app/security/page";
import SupportPage from "../../app/support/page";
import TermsPage from "../../app/terms/page";

const pages = [
  ["Accessibility", AccessibilityPage], ["Data choices and deletion", DataRightsPage],
  ["Licenses and notices", LicensesPage], ["Pricing and subscriptions", PricingPage],
  ["Privacy Policy", PrivacyPage], ["Security", SecurityPage], ["Support", SupportPage], ["Terms of Use", TermsPage],
] as const;

describe("public legal and support pages", () => {
  test.each(pages)("renders %s with its customer-facing content", (title, Page) => {
    render(<Page />);
    expect(screen.getByRole("heading", { name: title, level: 1 })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Home" }).getAttribute("href")).toBe("/");
  });

  test("switches legal pages to Russian and saves the visitor choice", async () => {
    const user = userEvent.setup();
    render(<PrivacyPage />);

    await user.click(screen.getByRole("button", { name: "Switch to Russian" }));

    expect(screen.getByRole("heading", { name: "Политика конфиденциальности", level: 1 })).toBeTruthy();
    expect(window.localStorage.getItem("granttap.locale")).toBe("ru");
    expect(document.documentElement.lang).toBe("ru");

    await user.click(screen.getByRole("button", { name: "Переключить на английский" }));
    expect(screen.getByRole("heading", { name: "Privacy Policy", level: 1 })).toBeTruthy();
  });

  test("restores a saved Russian preference after hydration", async () => {
    window.localStorage.setItem("granttap.locale", "ru");
    render(<PricingPage />);

    expect(await screen.findByRole("heading", { name: "Тарифы и подписка", level: 1 })).toBeTruthy();
  });
});

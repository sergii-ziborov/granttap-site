import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import AccountPage from "../../app/account/page";
import EnterprisePage from "../../app/enterprise/page";

test("renders the working QR account handoff", () => {
  render(<AccountPage />);

  expect(screen.getByRole("heading", { name: "Opening QR sign-in…" })).toBeTruthy();
  expect(screen.getByRole("link", { name: "Continue" }).getAttribute("href"))
    .toBe("/account/index.html");
  expect(document.querySelector('meta[http-equiv="refresh"]')?.getAttribute("content"))
    .toBe("0;url=/account/index.html");
});

test("renders both Enterprise trust boundaries in English and Russian", async () => {
  const user = userEvent.setup();
  render(<EnterprisePage />);

  expect(screen.getByRole("heading", { name: /Control stays with the organization/i })).toBeTruthy();
  expect(screen.getByText("GrantTap Web — available now")).toBeTruthy();
  expect(screen.getByText("Managed endpoint login")).toBeTruthy();
  expect(screen.getByText("Organization admin console")).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));

  expect(screen.getByRole("heading", { name: /Управление остаётся у организации/i })).toBeTruthy();
  expect(screen.getByText("Админ-консоль организации")).toBeTruthy();
});

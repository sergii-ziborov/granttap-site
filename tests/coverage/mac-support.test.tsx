import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import SupportPage from "../../app/support/page";

test("Mac help explains native menus, device pairing and restoring purchases", async () => {
  const view = render(await SupportPage());
  expect(screen.getByRole("heading", { name: "Mac app and device connections" })).toBeTruthy();
  expect(screen.getByText(/Help → GrantTap Help/)).toBeTruthy();
  expect(screen.getAllByText(/Devices → Connect iPhone or iPad/).length).toBeGreaterThan(0);
  expect(screen.getByText(/Restore purchases.*Apple Account/)).toBeTruthy();
  view.unmount();
  render(await SupportPage({ searchParams: Promise.resolve({ lang: "ru" }) }));
  expect(screen.getByRole("heading", { name: "Mac и подключение устройств" })).toBeTruthy();
});

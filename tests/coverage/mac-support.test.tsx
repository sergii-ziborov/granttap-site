import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import SupportPage from "../../app/support/page";

test("Mac help explains native menus, device pairing and restoring purchases", async () => {
  render(<SupportPage />);
  expect(screen.getByRole("heading", { name: "Mac app and device connections" })).toBeTruthy();
  expect(screen.getByText(/Help → GrantTap Help/)).toBeTruthy();
  expect(screen.getByText(/Devices → Connect iPhone or iPad/)).toBeTruthy();
  expect(screen.getByText(/Restore purchases.*Apple Account/)).toBeTruthy();
  await userEvent.setup().click(screen.getByRole("button", { name: "Switch to Russian" }));
  expect(screen.getByRole("heading", { name: "Mac и подключение устройств" })).toBeTruthy();
});

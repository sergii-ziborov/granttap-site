import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Home from "../../app/page";

test("renders the product journey and supports the locale control", async () => {
  const user = userEvent.setup();
  render(<Home />);

  expect(screen.getByRole("heading", { name: /Step away from your Mac/i })).toBeTruthy();
  expect(screen.getAllByText(/Grok Build/).length).toBeGreaterThan(0);
  expect(document.querySelector('img[src*="/providers/cursor.png"]')).toBeTruthy();
  expect(document.querySelector('img[src*="/providers/grok.png"]')).toBeTruthy();
  expect(screen.getAllByText(/One GrantTap installation/i).length).toBeGreaterThan(0);
  expect(screen.getByRole("img", { name: /full chat with a delivered photo/i })).toBeTruthy();
  expect(screen.getByRole("img", { name: /fullscreen preview of the sent photo/i })).toBeTruthy();
  expect(screen.getByText(/Direct same-Wi-Fi transport is planned/i)).toBeTruthy();
  expect(screen.getByText(/routes, cannot decrypt/i)).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));

  expect(screen.getByRole("heading", { name: /Отойдите от Mac/i })).toBeTruthy();
});

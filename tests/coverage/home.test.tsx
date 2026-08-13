import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import Home from "../../app/page";

test("renders the product journey and supports the locale control", async () => {
  const user = userEvent.setup();
  render(<Home />);

  expect(screen.getByRole("heading", { name: /Step away from your Mac/i })).toBeTruthy();
  expect(screen.getByText("Grok Build")).toBeTruthy();
  expect(screen.getByText(/Direct same-Wi-Fi transport is planned/i)).toBeTruthy();

  await user.click(screen.getByRole("button", { name: "Switch to Russian" }));

  expect(screen.getByRole("heading", { name: /Отойдите от Mac/i })).toBeTruthy();
});

afterEach(() => vi.useRealTimers());

test("updates launch status as the target time passes", async () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-08-13T08:00:00Z"));
  render(<Home />);
  expect(screen.getByText(/Target submission/i)).toBeTruthy();

  vi.setSystemTime(new Date("2026-08-15T08:00:00Z"));
  await act(async () => vi.advanceTimersByTimeAsync(1_000));

  expect(screen.getByText(/Target date reached/i)).toBeTruthy();
});

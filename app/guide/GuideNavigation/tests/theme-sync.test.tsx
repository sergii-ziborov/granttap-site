import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { GuideShell } from "..";

it("updates the displayed theme when another tab changes or removes the saved preference", () => {
  render(<GuideShell searchIndex={[]}>Учебная глава</GuideShell>);
  expect(screen.getByRole("main").getAttribute("data-theme")).toBe("light");
  localStorage.setItem("granttap.guide.theme", "dark");
  fireEvent(window, new StorageEvent("storage", { key: "granttap.guide.theme", newValue: "dark" }));
  expect(screen.getByRole("main").getAttribute("data-theme")).toBe("dark");
  fireEvent.click(screen.getByRole("button", { name: "Включить светлую тему" }));
  expect(localStorage.getItem("granttap.guide.theme")).toBe("light");
  localStorage.setItem("granttap.guide.theme", "dark");
  fireEvent(window, new StorageEvent("storage", { key: "granttap.guide.theme", newValue: "dark" }));
  localStorage.removeItem("granttap.guide.theme");
  fireEvent(window, new StorageEvent("storage", { key: "granttap.guide.theme", newValue: null }));
  expect(screen.getByRole("main").getAttribute("data-theme")).toBe("light");
});

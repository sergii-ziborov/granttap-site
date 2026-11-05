import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { GuideShell } from "..";
import { AppearanceController } from "../../../Appearance";
it("uses the same saved theme as the public site instead of resetting the guide", () => {
  localStorage.setItem("granttap.theme", "light");
  render(<><AppearanceController /><GuideShell searchIndex={[]}>Учебная глава</GuideShell></>);
  expect(document.documentElement.dataset.theme).toBe("light");
  fireEvent.change(screen.getByLabelText("Цветовая тема"), { target: { value: "dark" } });
  expect(document.documentElement.dataset.theme).toBe("dark");
  expect(localStorage.getItem("granttap.theme")).toBe("dark");
});

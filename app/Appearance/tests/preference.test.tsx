import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { AppearanceController, ThemeSelector } from "..";
import { applyPreference, preferenceKey, readPreference, setPreference, subscribePreference, themeChange, validPreference } from "../preference";
import { appearanceBootstrap } from "../bootstrap";

afterEach(() => { vi.restoreAllMocks(); delete document.documentElement.dataset.theme; delete document.documentElement.dataset.themeMode; });
function system(light = false) {
  const listeners = new Set<() => void>();
  const media = { matches: light, addEventListener: (_: string, fn: () => void) => listeners.add(fn), removeEventListener: (_: string, fn: () => void) => listeners.delete(fn) };
  vi.stubGlobal("matchMedia", vi.fn(() => media));
  return { media, listeners, change(value: boolean) { media.matches = value; act(() => listeners.forEach(fn => fn())); } };
}
test("Auto follows system changes; an explicit choice persists across selectors and overrides the system", () => {
  const os = system(true);
  render(<><AppearanceController /><ThemeSelector /><ThemeSelector locale="ru" /></>);
  expect(document.documentElement.dataset.theme).toBe("light");
  os.change(false); expect(document.documentElement.dataset.theme).toBe("dark");
  fireEvent.change(screen.getByLabelText("Color theme"), { target: { value: "light" } });
  expect(localStorage.getItem(preferenceKey)).toBe("light");
  expect((screen.getByLabelText("Цветовая тема") as HTMLSelectElement).value).toBe("light");
  os.change(false); expect(document.documentElement.dataset.theme).toBe("light");
  fireEvent.change(screen.getByLabelText("Цветовая тема"), { target: { value: "auto" } });
  expect(document.documentElement.dataset.theme).toBe("dark");
});
test("A legacy guide choice migrates on the next explicit choice and invalid values do not become CSS modes", () => {
  system(true); localStorage.setItem("granttap.guide.theme", "dark");
  expect(readPreference()).toBe("dark"); applyPreference(); expect(document.documentElement.dataset.theme).toBe("dark");
  setPreference("auto"); expect(localStorage.getItem("granttap.guide.theme")).toBeNull();
  localStorage.setItem(preferenceKey, "invalid"); expect(readPreference()).toBe("auto");
  expect(validPreference(null)).toBe(false); expect(validPreference("dark")).toBe(true);
});
test("Storage changes synchronize another tab, unrelated keys are ignored and subscribers clean up", () => {
  system(); const listener = vi.fn(); const stop = subscribePreference(listener);
  window.dispatchEvent(new StorageEvent("storage", { key: "unrelated" })); expect(listener).not.toHaveBeenCalled();
  for (const key of [preferenceKey, "granttap.guide.theme", null]) window.dispatchEvent(new StorageEvent("storage", { key }));
  expect(listener).toHaveBeenCalledTimes(3); stop(); window.dispatchEvent(new Event(themeChange)); expect(listener).toHaveBeenCalledTimes(3);
  render(<AppearanceController />); localStorage.setItem(preferenceKey, "light");
  act(() => window.dispatchEvent(new StorageEvent("storage", { key: preferenceKey })));
  expect(document.documentElement.dataset.theme).toBe("light");
});
test("Blocked storage still permits a usable in-page choice and updates browser chrome", () => {
  system(); vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => { throw new Error("blocked"); });
  const meta = document.createElement("meta"); meta.name = "theme-color"; document.head.append(meta);
  setPreference("light"); expect(readPreference()).toBe("light"); expect(meta.content).toBe("#f8f6f2");
  setPreference("dark"); expect(meta.content).toBe("#090a0c"); meta.remove();
});
test("The prepaint script resolves saved, legacy, automatic and unavailable-storage preferences", () => {
  system(true);
  for (const [stored, expected] of [["dark", "dark"], ["light", "light"], ["auto", "light"], ["invalid", "light"]]) {
    localStorage.setItem(preferenceKey, stored); window.eval(appearanceBootstrap); expect(document.documentElement.dataset.theme).toBe(expected);
  }
  localStorage.removeItem(preferenceKey); localStorage.setItem("granttap.guide.theme", "dark");
  window.eval(appearanceBootstrap); expect(document.documentElement.dataset.theme).toBe("dark");
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
  window.eval(appearanceBootstrap); expect(document.documentElement.dataset.theme).toBe("light");
});

export type ThemePreference = "auto" | "light" | "dark";
export const preferenceKey = "granttap.theme";
export const themeChange = "granttap-theme-change";
let temporaryPreference: ThemePreference = "auto";

export function validPreference(value: unknown): value is ThemePreference {
  return value === "auto" || value === "light" || value === "dark";
}

export function readPreference(): ThemePreference {
  try {
    const saved = localStorage.getItem(preferenceKey);
    if (validPreference(saved)) return saved;
    const legacy = localStorage.getItem("granttap.guide.theme");
    return legacy === "light" || legacy === "dark" ? legacy : "auto";
  } catch { return temporaryPreference; }
}

export function applyPreference() {
  const mode = readPreference();
  const lightSystem = typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches;
  const theme = mode === "auto" ? (lightSystem ? "light" : "dark") : mode;
  document.documentElement.dataset.themeMode = mode;
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "light" ? "#f8f6f2" : "#090a0c");
}

export function setPreference(value: ThemePreference) {
  temporaryPreference = value;
  try {
    localStorage.setItem(preferenceKey, value);
    localStorage.removeItem("granttap.guide.theme");
  } catch { /* The choice remains usable for this page when storage is unavailable. */ }
  applyPreference();
  window.dispatchEvent(new Event(themeChange));
}

export function subscribePreference(listener: () => void) {
  const storage = (event: StorageEvent) => {
    if (event.key === preferenceKey || event.key === "granttap.guide.theme" || event.key === null) listener();
  };
  window.addEventListener("storage", storage);
  window.addEventListener(themeChange, listener);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener(themeChange, listener);
  };
}

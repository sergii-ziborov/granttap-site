import { useSyncExternalStore } from "react";

const key = "granttap.guide.theme";
const changed = "granttap-guide-theme-change";
type Theme = "light" | "dark";
let unavailableStorageTheme: Theme = "light";

function snapshot(): Theme {
  try { return localStorage.getItem(key) === "dark" ? "dark" : "light"; }
  catch { return unavailableStorageTheme; }
}

function subscribe(listener: () => void) {
  const storage = (event: StorageEvent) => { if (event.key === key || event.key === null) listener(); };
  window.addEventListener("storage", storage);
  window.addEventListener(changed, listener);
  return () => {
    window.removeEventListener("storage", storage);
    window.removeEventListener(changed, listener);
  };
}

export function useGuideTheme() {
  const theme = useSyncExternalStore(subscribe, snapshot, () => "light" as Theme);
  function toggleTheme() {
    const next = snapshot() === "dark" ? "light" : "dark";
    try { localStorage.setItem(key, next); }
    catch { unavailableStorageTheme = next; }
    window.dispatchEvent(new Event(changed));
  }
  return { theme, toggleTheme };
}

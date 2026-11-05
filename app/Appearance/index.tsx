"use client";

import { useEffect, useSyncExternalStore } from "react";
import { applyPreference, readPreference, setPreference, subscribePreference, type ThemePreference } from "./preference";

export function AppearanceController() {
  useEffect(() => {
    applyPreference();
    const unsubscribe = subscribePreference(applyPreference);
    const media = typeof matchMedia === "function" ? matchMedia("(prefers-color-scheme: light)") : null;
    media?.addEventListener("change", applyPreference);
    return () => { unsubscribe(); media?.removeEventListener("change", applyPreference); };
  }, []);
  return null;
}

export function ThemeSelector({ locale = "en" }: { locale?: "en" | "ru" }) {
  const preference = useSyncExternalStore(subscribePreference, readPreference, () => "auto" as ThemePreference);
  return <label className="site-theme-picker">
    <span>{locale === "ru" ? "Тема" : "Theme"}</span>
    <select aria-label={locale === "ru" ? "Цветовая тема" : "Color theme"} value={preference}
      onChange={event => setPreference(event.target.value as ThemePreference)}>
      <option value="auto">{locale === "ru" ? "Авто" : "Auto"}</option>
      <option value="light">{locale === "ru" ? "Светлая" : "Light"}</option>
      <option value="dark">{locale === "ru" ? "Тёмная" : "Dark"}</option>
    </select>
  </label>;
}

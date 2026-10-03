"use client";

import { useEffect, useState } from "react";

export type Locale = "en" | "ru";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("granttap.locale");
    const requested = new URLSearchParams(window.location.search).get("lang");
    const selected = requested === "en" || requested === "ru" ? requested : saved;
    if (selected === "en" || selected === "ru") {
      document.documentElement.lang = selected;
      if (requested) window.localStorage.setItem("granttap.locale", selected);
      const timer = window.setTimeout(() => setLocaleState(selected), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem("granttap.locale", next);
    document.documentElement.lang = next;
    if (new URLSearchParams(window.location.search).has("lang")) {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", next);
      window.history.replaceState(null, "", url);
    }
  }

  return { locale, setLocale };
}

export function LanguageToggle({
  locale,
  setLocale,
}: {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}) {
  return (
    <div className="language-toggle" role="group" aria-label={locale === "en" ? "Language" : "Язык"}>
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        aria-label={locale === "en" ? "English, selected" : "Переключить на английский"}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "ru" ? "active" : ""}
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
        aria-label={locale === "ru" ? "Русский, выбран" : "Switch to Russian"}
      >
        RU
      </button>
    </div>
  );
}

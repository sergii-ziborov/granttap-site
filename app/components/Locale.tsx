"use client";

import { useEffect, useState } from "react";

export type Locale = "en" | "ru";

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("granttap.locale");
    if (saved === "en" || saved === "ru") {
      document.documentElement.lang = saved;
      const timer = window.setTimeout(() => setLocaleState(saved), 0);
      return () => window.clearTimeout(timer);
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    window.localStorage.setItem("granttap.locale", next);
    document.documentElement.lang = next;
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
    <div className="language-toggle" aria-label="Language">
      <button
        type="button"
        className={locale === "en" ? "active" : ""}
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "ru" ? "active" : ""}
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
      >
        RU
      </button>
    </div>
  );
}

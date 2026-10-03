import type { BlogLocale } from "./articleTypes";

export function blogLocale(lang?: string): BlogLocale {
  return lang === "ru" ? "ru" : "en";
}

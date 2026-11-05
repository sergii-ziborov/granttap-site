import type { ReactNode } from "react";
import type { BlogLocale } from "./articleTypes";

const inlineLink = /\[([^\]]+)\]\((https:\/\/[^\s)]+|\/[^\s)]+)\)/g;

export function inlineStoryLinks(value: string, locale: BlogLocale): ReactNode[] {
  const result: ReactNode[] = [];
  let from = 0;
  for (const match of value.matchAll(inlineLink)) {
    const at = match.index;
    if (at > from) result.push(value.slice(from, at));
    const external = match[2].startsWith("https://");
    const target = new URL(match[2], "https://granttap.com");
    if (!external && !target.pathname.startsWith("/guide") && locale === "ru") target.searchParams.set("lang", "ru");
    const href = external ? match[2] : target.pathname + target.search + target.hash;
    result.push(<a href={href} key={`${at}-${href}`} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{match[1]}</a>);
    from = at + match[0].length;
  }
  if (from < value.length) result.push(value.slice(from));
  return result;
}

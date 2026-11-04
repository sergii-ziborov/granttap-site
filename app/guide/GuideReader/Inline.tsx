import type { ReactNode } from "react";

const tokens = /(\*\*[^*]+\*\*|`[^`]+`|==[^=]+==|\[[^\]]+\]\([^\s)]+\))/g;

export function Inline({ text }: { text: string }) {
  const result: ReactNode[] = []; let from = 0;
  for (const match of text.matchAll(tokens)) {
    const at = match.index; const value = match[0];
    if (at > from) result.push(text.slice(from, at));
    if (value.startsWith("**")) result.push(<strong key={at}>{value.slice(2, -2)}</strong>);
    else if (value.startsWith("`")) result.push(<code key={at}>{value.slice(1, -1)}</code>);
    else if (value.startsWith("==")) result.push(<mark key={at}>{value.slice(2, -2)}</mark>);
    else {
      const link = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/)!;
      const safe = /^(https:\/\/|\/(?!\/)|#)/.test(link[2]);
      result.push(safe ? <a key={at} href={link[2]}>{link[1]}</a> : value);
    }
    from = at + value.length;
  }
  if (from < text.length) result.push(text.slice(from));
  return <>{result}</>;
}

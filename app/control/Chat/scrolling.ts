import { useLayoutEffect, useRef } from "react";

/** Follow live content only while the reader remains at the end of this conversation. */
export function useTranscriptScrolling(scope: string, entries: unknown, outgoing: number, visible: number) {
  const viewport = useRef<HTMLDivElement>(null);
  const currentScope = useRef(scope), follows = useRef(true);
  const anchor = useRef<{ height: number; top: number } | undefined>(undefined);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    if (currentScope.current !== scope) {
      currentScope.current = scope; follows.current = true; anchor.current = undefined;
    }
    if (anchor.current) {
      element.scrollTop = anchor.current.top + element.scrollHeight - anchor.current.height;
      anchor.current = undefined;
    } else if (follows.current) element.scrollTop = element.scrollHeight;
  }, [scope, entries, outgoing, visible]);
  const onScroll = () => {
    const element = viewport.current;
    if (element) follows.current = element.scrollHeight - element.clientHeight - element.scrollTop < 80;
  };
  const revealEarlier = () => {
    const element = viewport.current;
    follows.current = false;
    if (element) anchor.current = { top: element.scrollTop, height: element.scrollHeight };
  };
  return { viewport, onScroll, revealEarlier };
}

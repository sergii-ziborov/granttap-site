export type GuideBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; items: string[]; ordered: boolean }
  | { kind: "code"; language: string; text: string }
  | { kind: "table"; rows: string[][] }
  | { kind: "callout"; tone: string; title: string; text: string }
  | { kind: "capture"; id: string }
  | { kind: "diagram"; id: string };
export type GuideSection = { id: string; title: string; blocks: GuideBlock[] };

export function plainText(value: string): string {
  return value.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[#*`=|>]/g, " ").replace(/\s+/g, " ").trim();
}

function cells(line: string): string[] {
  return line.trim().replace(/^\||\|$/g, "").split("|").map(cell => cell.trim());
}

function startsBlock(line: string): boolean {
  return !line.trim() || /^(## |```|:::|\||[-*] |\d+\. )/.test(line);
}

/** A deliberately small, safe Markdown dialect for the authored handbook. No raw HTML. */
export function parseGuide(value: string): GuideSection[] {
  const lines = value.replace(/\r/g, "").split("\n");
  const sections: GuideSection[] = [{ id: "introduction", title: "", blocks: [] }];
  let current = sections[0];
  let at = 0;
  while (at < lines.length) {
    const line = lines[at];
    if (!line.trim()) { at++; continue; }
    if (line.startsWith("## ")) {
      const match = line.match(/^## (.*?)(?: \{#([a-z0-9-]+)\})?$/)!;
      current = { id: match[2] || `section-${sections.length}`, title: match[1], blocks: [] };
      sections.push(current); at++; continue;
    }
    if (line.startsWith("```")) {
      const language = line.slice(3).trim();
      const body: string[] = []; at++;
      while (at < lines.length && !lines[at].startsWith("```")) body.push(lines[at++]);
      current.blocks.push({ kind: "code", language, text: body.join("\n") }); at++; continue;
    }
    const visual = line.match(/^:::(capture|diagram) ([a-z0-9-]+)$/);
    if (visual) {
      const kind = visual[1] === "capture" ? "capture" : "diagram";
      current.blocks.push({ kind, id: visual[2] }); at++; continue;
    }
    const callout = line.match(/^:::(note|tip|warning|check|exercise)(?: (.+))?$/);
    if (callout) {
      const body: string[] = []; at++;
      while (at < lines.length && lines[at].trim() !== ":::") body.push(lines[at++]);
      current.blocks.push({ kind: "callout", tone: callout[1], title: callout[2] || "На заметку", text: body.join("\n").trim() });
      at++; continue;
    }
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (at < lines.length && lines[at].startsWith("|")) {
        const row = cells(lines[at++]);
        if (!row.every(cell => /^:?-{3,}:?$/.test(cell))) rows.push(row);
      }
      current.blocks.push({ kind: "table", rows }); continue;
    }
    if (/^([-*] |\d+\. )/.test(line)) {
      const ordered = /^\d+/.test(line); const items: string[] = [];
      while (at < lines.length && /^([-*] |\d+\. )/.test(lines[at])) items.push(lines[at++].replace(/^([-*] |\d+\. )/, ""));
      current.blocks.push({ kind: "list", items, ordered }); continue;
    }
    const paragraph = [line]; at++;
    while (at < lines.length && !startsBlock(lines[at])) paragraph.push(lines[at++]);
    current.blocks.push({ kind: "paragraph", text: paragraph.join(" ") });
  }
  return sections;
}

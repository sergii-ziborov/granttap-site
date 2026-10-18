import type { ActivityEntry, Payload } from "../ControlProtocol";
import type { OutgoingCommand } from "../ControlOutbox";

/** Capture native history order before sending; browser and computer clocks can differ. */
export function messageHistoryPosition(payload: Payload, entries: ActivityEntry[]): OutgoingCommand["historyAfter"] {
  if (payload.type !== "user.message") return undefined;
  for (let index = entries.length - 1; index >= 0; index--) {
    const entry = entries[index];
    if (entry.kind === "user") return { entryId: entry.id.length <= 1_024 ? entry.id : undefined, createdAt: entry.createdAt };
  }
  return { createdAt: payload.createdAt };
}

/** Pair each accepted intent with at most one later native user entry. Never infer acceptance. */
export function outgoingEchoes(commands: OutgoingCommand[], entries: ActivityEntry[]): Map<string, string> {
  const confirmed = new Map<string, string>();
  if (!commands.some(row => row.payload.type === "user.message" && row.delivery.state === "accepted" && !row.delivery.echoedBy)) return confirmed;
  const used = new Set(commands.flatMap(row => row.delivery.echoedBy ? [row.delivery.echoedBy] : []));
  const positions = new Map(entries.map((entry, index) => [entry.id, index]));
  const users = new Map<string, Array<{ entry: ActivityEntry; index: number }>>();
  for (const [index, entry] of entries.entries()) if (entry.kind === "user") {
    const text = normalized(entry.text), rows = users.get(text) ?? [];
    rows.push({ entry, index }); users.set(text, rows);
  }
  for (const command of commands) {
    if (command.payload.type !== "user.message" || command.delivery.state !== "accepted" || command.delivery.echoedBy) continue;
    const after = command.historyAfter, payload = command.payload;
    const position = after?.entryId ? positions.get(after.entryId) : undefined;
    const match = users.get(normalized(payload.text))?.find(({ entry, index }) => !used.has(entry.id)
      && (position !== undefined ? index > position : entry.createdAt >= (after?.createdAt ?? payload.createdAt)));
    if (match) { used.add(match.entry.id); confirmed.set(command.id, match.entry.id); }
  }
  return confirmed;
}

function normalized(text: string): string { return text.replaceAll("\r\n", "\n").trim(); }

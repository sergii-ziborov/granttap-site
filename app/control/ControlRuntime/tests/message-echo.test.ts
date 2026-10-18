import { expect, it } from "vitest";
import type { ActivityEntry } from "../../ControlProtocol";
import type { OutgoingCommand } from "../../ControlOutbox";
import { messageHistoryPosition, outgoingEchoes } from "../message-echo";

const message = (id: string): OutgoingCommand => ({ id, machineId: "computer", delivery: { state: "accepted" },
  historyAfter: { entryId: "before", createdAt: 100 },
  payload: { type: "user.message", sessionId: "task", messageId: id, text: "Continue", createdAt: 150 } });
const user = (id: string, createdAt: number, text = "Continue"): ActivityEntry => ({ id, kind: "user", createdAt, text });

it("captures the last native user position rather than a later assistant event or the browser clock", () => {
  const payload = message("first").payload;
  expect(messageHistoryPosition(payload, [user("before", 100), { ...user("assistant", 120), kind: "message" }]))
    .toEqual({ entryId: "before", createdAt: 100 });
  expect(messageHistoryPosition(payload, [])).toEqual({ createdAt: 150 });
  expect(messageHistoryPosition(payload, [user("x".repeat(1_025), 100)])).toEqual({ createdAt: 100 });
  expect(messageHistoryPosition({ type: "sessions.refresh", createdAt: 1 }, [])).toBeUndefined();
});

it("never treats an old identical prompt or an assistant response as a new native user echo", () => {
  const entries = [user("before", 100), { ...user("response", 200), kind: "message" as const }];
  expect([...outgoingEchoes([message("first")], entries)]).toEqual([]);
});
it("matches repeated prompts one to one after the captured native history position", () => {
  const commands = [message("first"), message("second")];
  expect([...outgoingEchoes(commands, [user("before", 100), user("native-1", 200)])]).toEqual([["first", "native-1"]]);
  commands[0].delivery.echoedBy = "native-1";
  expect([...outgoingEchoes(commands, [user("before", 100), user("native-1", 200), user("native-2", 300)])])
    .toEqual([["second", "native-2"]]);
});
it("uses native order despite clock adjustment and falls back conservatively when old history is paged out", () => {
  expect([...outgoingEchoes([message("first")], [user("before", 100), user("native", 50)])]).toEqual([["first", "native"]]);
  expect([...outgoingEchoes([message("first")], [user("older", 99), user("native", 200, "Continue\r\n")])])
    .toEqual([["first", "native"]]);
  const unseen = message("unseen"); delete unseen.historyAfter;
  expect([...outgoingEchoes([unseen], [user("older", 100)])]).toEqual([]);
});
it("does not turn relay storage, failures or another command kind into native acceptance", () => {
  const commands = [message("stored"), message("failed"), message("other-text")];
  commands[0].delivery.state = "stored"; commands[1].delivery.state = "failed";
  if (commands[2].payload.type === "user.message") commands[2].payload.text = "Different";
  expect([...outgoingEchoes(commands, [user("native", 200)])]).toEqual([]);
});

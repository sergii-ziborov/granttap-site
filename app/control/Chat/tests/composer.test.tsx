import { expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatComposer } from "../Composer";
import type { MeshSnapshot, SessionInfo, UserMessage } from "../../ControlProtocol";

const session: SessionInfo = { sessionId: "task", projectId: "mesh", agent: "cursor", title: "Synthetic Task",
  state: "idle", startedAt: 1, lastActivityAt: 2, tokensSession: 0, tokensLastTurn: 0 };
const mesh: MeshSnapshot = { type: "mesh.snapshot", sessionId: "mesh", projectId: "mesh", project: {
  projectId: "mesh", name: "Synthetic Mesh", canonicalRepositoryId: "synthetic/repository", createdAt: 1 },
  tasks: [], executions: [], claims: [], dependencies: [], events: [], generatedAt: 1, modelCatalog: [{ endpointId: "computer", observedAt: 1,
    models: [{ endpointId: "computer", observedAt: 1, source: "advertised", provider: "cursor", modelId: "synthetic-model",
      label: "Synthetic model", supportedEfforts: ["low", "medium", "high", "xhigh"] }] }] };
function file() {
  const item = new File(["synthetic"], "synthetic.txt", { type: "text/plain" });
  Object.defineProperty(item, "arrayBuffer", { value: async () => new TextEncoder().encode("synthetic").buffer }); return item;
}

it("preserves a failed draft and delivery ID, includes attachments and model settings, and clears only after relay confirms", async () => {
  const sent: UserMessage[] = []; let fail = true; const user = userEvent.setup();
  render(<ChatComposer session={session} meshes={[mesh]} submit={async message => { sent.push(message); if (fail) throw Error("Synthetic relay unavailable"); }} />);
  await user.type(screen.getByRole("textbox", { name: "Message" }), "Synthetic follow-up");
  await user.upload(screen.getByLabelText("Attach files"), file());
  await user.selectOptions(screen.getByRole("combobox", { name: "Model" }), "synthetic-model");
  await user.selectOptions(screen.getByRole("combobox", { name: "Effort" }), "xhigh");
  await user.click(screen.getByRole("button", { name: "Send message" }));
  expect(await screen.findByText("Synthetic relay unavailable")).toBeTruthy();
  expect(screen.getByRole("textbox", { name: "Message" })).toHaveProperty("value", "Synthetic follow-up");
  fail = false; await user.click(screen.getByRole("button", { name: "Send message" }));
  expect(await screen.findByText(/Saved on relay/)).toBeTruthy(); expect(sent).toHaveLength(2);
  expect(sent[0].messageId === sent[1].messageId).toBe(true);
  expect(sent[1]).toMatchObject({ model: "synthetic-model", effort: "xhigh", attachments: [{ name: "synthetic.txt", mimeType: "text/plain" }] });
  expect(screen.getByRole("textbox", { name: "Message" })).toHaveProperty("value", "");
});
it("removes selected files, sends an attachment-only message and refuses oversize uploads without clearing the draft", async () => {
  const sent: UserMessage[] = [], user = userEvent.setup(); render(<ChatComposer session={session} meshes={[]} submit={async message => { sent.push(message); }} />);
  expect((screen.getByRole("button", { name: "Send message" }) as HTMLButtonElement).disabled).toBe(true);
  await user.upload(screen.getByLabelText("Attach files"), file()); await user.click(screen.getByRole("button", { name: "synthetic.txt ×" }));
  expect((screen.getByRole("button", { name: "Send message" }) as HTMLButtonElement).disabled).toBe(true);
  const large = file(); Object.defineProperty(large, "size", { value: 6_000_001 });
  await user.upload(screen.getByLabelText("Attach files"), large); await user.click(screen.getByRole("button", { name: "Send message" }));
  expect(await screen.findByText(/Attach up to 10 files/)).toBeTruthy(); expect(sent).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: "synthetic.txt ×" })); await user.upload(screen.getByLabelText("Attach files"), file());
  await user.click(screen.getByRole("textbox", { name: "Message" })); await user.keyboard("{Control>}{Enter}{/Control}");
  expect(await screen.findByText(/Saved on relay/)).toBeTruthy(); expect(sent).toHaveLength(1); expect(sent[0].text).toBe("");
});

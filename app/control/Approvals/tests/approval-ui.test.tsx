import { expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ApprovalCard } from "..";
const request = { type: "approval.request" as const, requestId: "fixture", agent: "cursor", tool: "shell",
  title: "Review synthetic command", kind: "permission" as const, risk: "medium" as const, createdAt: 1 };
it("allows a dedicated request and keeps relay-stored distinct from applied", async () => {
  const decide = vi.fn(async () => {}); const user = userEvent.setup();
  const view = render(<ApprovalCard request={request} decide={decide} />);
  await user.click(screen.getByRole("button", { name: "Allow" })); expect(decide).toHaveBeenCalledWith("allow", undefined);
  view.rerender(<ApprovalCard request={request} decide={decide} delivery={{ state: "stored" }} />);
  expect(screen.getByText("Saved on relay · waiting for computer")).toBeTruthy();
  expect((screen.getByRole("button", { name: "Allow" }) as HTMLButtonElement).disabled).toBe(true);
});
it("requires a complete human answer and sends the native question answer format", async () => {
  const decide = vi.fn(async () => {}); const user = userEvent.setup();
  render(<ApprovalCard request={{ ...request, kind: "question", questions: [{ question: "What next?", header: "Next",
    multiSelect: false, options: [{ label: "Continue", description: "Run the fixture" }] }] }} decide={decide} />);
  expect((screen.getByRole("button", { name: "Send answer" }) as HTMLButtonElement).disabled).toBe(true);
  await user.click(screen.getByRole("button", { name: /Continue/ }));
  await user.click(screen.getByRole("button", { name: "Send answer" }));
  expect(decide).toHaveBeenCalledWith("allow", JSON.stringify({ "What next?": "Continue" }));
});

it("submits custom multi-select answers and removes a deselected answer before sending", async () => {
  const decide = vi.fn(async () => {}), user = userEvent.setup();
  render(<ApprovalCard request={{ ...request, kind: "question", details: "Review both options", command: "synthetic", cwd: "/synthetic",
    questions: [{ question: "Choose work", header: "Work", multiSelect: true,
      options: [{ label: "One", description: "" }, { label: "Two", description: "" }] }] }} decide={decide} />);
  await user.click(screen.getByRole("button", { name: "One" })); await user.click(screen.getByRole("button", { name: "Two" }));
  await user.click(screen.getByRole("button", { name: "One" }));
  await user.type(screen.getByRole("textbox", { name: "Your own answer" }), "Custom choice");
  await user.click(screen.getByRole("button", { name: "Send answer" }));
  expect(decide).toHaveBeenCalledWith("allow", JSON.stringify({ "Choose work": "Custom choice" }));
});
it("accepts a free-text answer, shows relay errors and supports a separate denial without sending the draft", async () => {
  const user = userEvent.setup(), decide = vi.fn(async () => { throw Error("Synthetic relay failure"); });
  const view = render(<ApprovalCard request={{ ...request, kind: "question" }} decide={decide} />);
  await user.type(screen.getByRole("textbox", { name: "Answer" }), "Synthetic answer");
  await user.click(screen.getByRole("button", { name: "Send answer" }));
  expect(await screen.findByRole("alert")).toHaveProperty("textContent", "Synthetic relay failure");
  expect(decide).toHaveBeenCalledWith("allow", "Synthetic answer");
  await user.click(screen.getByRole("button", { name: "Deny" })); expect(decide).toHaveBeenLastCalledWith("deny", undefined);
  view.rerender(<ApprovalCard request={request} decide={decide} delivery={{ state: "accepted" }} />);
  expect(screen.getByText("Applied by computer")).toBeTruthy();
  expect((screen.getByRole("button", { name: "Deny" }) as HTMLButtonElement).disabled).toBe(true);
});

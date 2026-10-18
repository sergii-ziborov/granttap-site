import "fake-indexeddb/auto";
import { afterEach, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ControlCenter } from "..";
import { browserFixture } from "./browser-fixture";
import { BrowserKeyVault } from "../../BrowserKeys";
import { BrowserControlOutbox } from "../../ControlOutbox";

vi.mock("../../RelayConnection", async () => {
  const { FixtureRelayConnection } = await import("./browser-fixture");
  return { BrowserRelayConnection: FixtureRelayConnection };
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
it("refreshes the selected Mesh architecture, searches its graph, creates a Task there and opens its existing Task", async () => {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", { configurable: true, value: function () { this.open = true; } });
  Object.defineProperty(HTMLDialogElement.prototype, "close", { configurable: true, value: function () { this.open = false; } });
  const f = await browserFixture(), user = userEvent.setup(); render(<ControlCenter />);
  await screen.findByRole("button", { name: /Synthetic web Task/ });
  await user.click(screen.getByRole("button", { name: "Mesh" }));
  await user.click(await screen.findByRole("button", { name: /Fixture Mesh/ }));
  expect(screen.getByRole("img", { name: "Architecture components and connections" })).toBeTruthy();
  await user.type(screen.getByRole("searchbox", { name: "Find a component" }), "missing");
  expect(screen.getByText("Showing 0 of 1 components. Search narrows the view.")).toBeTruthy();
  await user.clear(screen.getByRole("searchbox", { name: "Find a component" }));
  await user.click(screen.getByRole("button", { name: "Refresh architecture" }));
  expect(await screen.findByText(/Architecture refresh requested/)).toBeTruthy();
  expect(f.received.find(payload => payload.type === "sessions.refresh")).toMatchObject({ graphProjectId: "mesh" });
  await user.click(screen.getByRole("button", { name: /New Task/ }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Agent" }), "cursor");
  await user.type(screen.getByRole("textbox", { name: "What should the agent do?" }), "Synthetic new Task");
  await user.click(screen.getByRole("button", { name: "Create Task" }));
  expect(await screen.findByText("Saved on relay. The new Task appears when the computer accepts it.")).toBeTruthy();
  expect(f.received.find(payload => payload.type === "project.task.create")).toMatchObject({ projectId: "mesh", cwd: "/fixture", agent: "cursor", text: "Synthetic new Task" });
  await user.click(screen.getByRole("button", { name: "Done" }));
  await user.click(screen.getByRole("button", { name: "Tasks" }));
  expect(await screen.findByText("Synthetic new Task")).toBeTruthy();
  expect(screen.getByText("Saved on relay · waiting for computer")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Mesh" }));
  await user.click(await screen.findByRole("button", { name: /Fixture Mesh/ }));
  await user.click(screen.getByRole("button", { name: /Synthetic web Task/ }));
  expect(await screen.findByText("Synthetic history 4999")).toBeTruthy();
  await user.click(screen.getByRole("button", { name: "Back to Tasks" }));
  await user.click(await screen.findByRole("button", { name: /Fixture Mesh/ }));
  await user.click(screen.getByRole("button", { name: "← All Mesh spaces" }));
  expect(await screen.findByRole("button", { name: /Fixture Mesh/ })).toBeTruthy();
});
it("opens Mesh using an authorized computer when the first account computer has not been connected to this browser", async () => {
  const f = await browserFixture(), previous = globalThis.fetch;
  vi.stubGlobal("fetch", async (input: string | URL | Request, init?: RequestInit) => String(input).includes("machines?")
    ? Response.json({ machines: [{ id: crypto.randomUUID(), name: "Unpaired computer" }, { id: f.machineId, name: "Authorized computer" }] })
    : previous(input, init));
  const user = userEvent.setup(); render(<ControlCenter />);
  await screen.findByRole("button", { name: /Synthetic web Task/ }); await user.click(screen.getByRole("button", { name: "Mesh" }));
  expect(await screen.findByRole("button", { name: /Fixture Mesh/ })).toBeTruthy();
  expect(screen.getByRole("combobox", { name: "Mesh computer" })).toHaveProperty("value", f.machineId);
});
it("routes a new Task to the computer selected inside Mesh rather than another connected computer", async () => {
  const f = await browserFixture(), second = crypto.randomUUID(), request = globalThis.fetch;
  const vault = new BrowserKeyVault(); await vault.update(f.accountId, old => ({ ...old,
    pairings: [...old.pairings, { ...old.pairings[0], machineId: second, room: "c".repeat(32) }] }));
  vi.stubGlobal("fetch", async (input: string | URL | Request, init?: RequestInit) => String(input).includes("machines?")
    ? Response.json({ machines: [{ id: f.machineId, name: "One" }, { id: second, name: "Two" }] }) : request(input, init));
  const user = userEvent.setup(); render(<ControlCenter />); await screen.findAllByRole("button", { name: /Synthetic web Task/ });
  await user.click(screen.getByRole("button", { name: "Mesh" }));
  await user.selectOptions(screen.getByRole("combobox", { name: "Mesh computer" }), second);
  await user.click(await screen.findByRole("button", { name: /Fixture Mesh/ }));
  await user.click(screen.getByRole("button", { name: /New Task/ }));
  await user.type(screen.getByRole("textbox", { name: "What should the agent do?" }), "Synthetic work for second computer");
  await user.click(screen.getByRole("button", { name: "Create Task" })); await screen.findByText(/Saved on relay/);
  const pending = Object.values(await new BrowserControlOutbox().read(f.accountId));
  expect(pending).toHaveLength(1); expect(pending[0].machineId).toBe(second);
  expect(pending[0].payload).toMatchObject({ projectId: "mesh", text: "Synthetic work for second computer" });
});

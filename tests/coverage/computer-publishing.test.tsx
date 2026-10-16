import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { ComputerPublishing } from "../../app/account/ComputerPublishing";

const account = "12345678-1234-4123-8123-123456789012";
const machine = { id: "33333333-3333-4333-8333-333333333333", name: "Work Mac" };
const page = (enabled = true) => ({ accountId: account, nextCursor: null,
  computers: [{ ...machine, enabled, selected: enabled }], selectedCount: enabled ? 1 : 0,
  limit: 2, source: "subscription" });
afterEach(() => vi.unstubAllGlobals());

test("publishing is an explicit, persistent choice separate from disconnecting", async () => {
  let enabled = true;
  const disconnected = vi.fn();
  const fetcher = vi.fn(async (_url: string, options?: RequestInit) => {
    if (options?.method === "DELETE") enabled = false;
    if (options?.method === "PUT") enabled = true;
    return new Response(JSON.stringify(page(enabled)), { status: 200 });
  });
  vi.stubGlobal("fetch", fetcher);
  const props = { accountId: account, locale: "en" as const, machines: [machine], busy: false,
    onDisconnect: disconnected };
  const view = render(<ComputerPublishing {...props} />);
  const choice = await screen.findByRole("checkbox", { name: /Work Mac/ });
  await waitFor(() => expect((choice as HTMLInputElement).disabled).toBe(false));
  await userEvent.setup().click(choice);
  await waitFor(() => expect(enabled).toBe(false));
  await waitFor(() => expect((choice as HTMLInputElement).disabled).toBe(false));
  expect(disconnected).not.toHaveBeenCalled();
  view.unmount();
  render(<ComputerPublishing {...props} />);
  const reopened = await screen.findByRole("checkbox", { name: /Work Mac/ });
  await waitFor(() => expect((reopened as HTMLInputElement).disabled).toBe(false));
  expect((reopened as HTMLInputElement).checked).toBe(false);
  await userEvent.setup().click(reopened);
  await waitFor(() => expect(enabled).toBe(true));
  await waitFor(() => expect((reopened as HTMLInputElement).disabled).toBe(false));
  await userEvent.setup().click(screen.getByRole("button", { name: "Disconnect Work Mac" }));
  expect(disconnected).toHaveBeenCalledWith(machine);
});

test("unknown or cross-account state cannot enable publishing and can be refreshed", async () => {
  let invalid = true;
  vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify(invalid
    ? { ...page(), accountId: "other" } : { ...page(false), source: "beta", limit: 100 }), { status: 200 })));
  render(<ComputerPublishing accountId={account} locale="ru" machines={[machine]} busy={false}
    onDisconnect={() => undefined} />);
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("Не удалось"));
  expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(true);
  invalid = false;
  await userEvent.setup().click(screen.getByRole("button", { name: "Обновить выбор" }));
  await waitFor(() => expect((screen.getByRole("checkbox") as HTMLInputElement).disabled).toBe(false));
  expect(screen.getByText(/Бета-доступ: 0 \/ 100/)).toBeTruthy();
});

test("a rejected update keeps the confirmed choice and never disconnects the computer", async () => {
  const disconnected = vi.fn();
  vi.stubGlobal("fetch", vi.fn(async (_url: string, options?: RequestInit) => new Response(
    JSON.stringify(page(false)), { status: options?.method === "PUT" ? 403 : 200 })));
  render(<ComputerPublishing accountId={account} locale="en" machines={[machine]} busy={false}
    onDisconnect={disconnected} />);
  const choice = screen.getByRole("checkbox");
  await waitFor(() => expect((choice as HTMLInputElement).disabled).toBe(false));
  await userEvent.setup().click(choice);
  await waitFor(() => expect(screen.getByRole("status").textContent).toContain("could not be updated"));
  expect((choice as HTMLInputElement).checked).toBe(false);
  expect(disconnected).not.toHaveBeenCalled();
});

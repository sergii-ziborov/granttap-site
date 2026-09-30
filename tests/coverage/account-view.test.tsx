import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountView } from "../../app/account/AccountView";

const passkeys = vi.hoisted(() => ({ create: vi.fn(), get: vi.fn() }));
vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: passkeys.create,
  startAuthentication: passkeys.get,
}));

beforeEach(() => {
  vi.restoreAllMocks();
  passkeys.create.mockReset();
  passkeys.get.mockReset();
  Object.defineProperty(window, "PublicKeyCredential", { value: class {}, configurable: true });
});

test("passkey sign-in shows the account without claiming that a computer is restored", async () => {
  const fetcher = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response("{}", { status: 401 }))
    .mockResolvedValueOnce(Response.json({ ceremonyId: "ceremony", options: { challenge: "challenge" } }))
    .mockResolvedValueOnce(Response.json({ accountId: "account-123" }));
  passkeys.get.mockResolvedValue({ id: "credential" });

  render(<AccountView />);
  await userEvent.click(await screen.findByRole("button", { name: "Sign in with passkey" }));
  expect(passkeys.get).toHaveBeenCalledWith({ optionsJSON: { challenge: "challenge" } });
  await waitFor(() => expect(screen.getByText(/account-123/)).toBeTruthy());
  expect(screen.getByText(/No computer is linked to this account/)).toBeTruthy();
  expect(fetcher).toHaveBeenCalledTimes(3);
});

test("new account creation and account deletion are explicit actions", async () => {
  const fetcher = vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response("{}", { status: 401 }))
    .mockResolvedValueOnce(Response.json({ ceremonyId: "new", options: { challenge: "create-challenge" } }))
    .mockResolvedValueOnce(Response.json({ accountId: "created-account" }))
    .mockResolvedValueOnce(Response.json({ deleted: true }));
  passkeys.create.mockResolvedValue({ id: "new-credential" });
  const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);

  render(<AccountView />);
  await userEvent.click(await screen.findByRole("button", { name: "Create an account with passkey" }));
  expect(passkeys.create).toHaveBeenCalledWith({ optionsJSON: { challenge: "create-challenge" } });
  await waitFor(() => expect(screen.getByText("created-account")).toBeTruthy());
  await userEvent.click(screen.getByRole("button", { name: "Delete account" }));
  expect(confirm).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(screen.getByRole("button", { name: "Sign in with passkey" })).toBeTruthy());
  expect(fetcher).toHaveBeenCalledTimes(4);
});

test("failed passkey verification leaves the account signed out", async () => {
  vi.spyOn(globalThis, "fetch")
    .mockResolvedValueOnce(new Response("{}", { status: 401 }))
    .mockResolvedValueOnce(Response.json({ ceremonyId: "login", options: { challenge: "login-challenge" } }))
    .mockResolvedValueOnce(new Response("{}", { status: 401 }));
  passkeys.get.mockResolvedValue({ id: "wrong" });
  render(<AccountView />);
  await userEvent.click(await screen.findByRole("button", { name: "Sign in with passkey" }));
  await waitFor(() => expect(screen.getByRole("alert").textContent).toMatch(/failed/));
  expect(screen.getByRole("button", { name: "Sign in with passkey" })).toBeTruthy();
});

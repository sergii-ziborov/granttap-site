import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { AccountTokenAccess } from "..";
import { parseSignInKey } from "../sign-in-key";

const key = "gt_login_" + "a".repeat(43);
const accountId = "00000000-0000-4000-8000-000000000001";
afterEach(() => vi.unstubAllGlobals());

it("parses only the native secret and trusted QR fragments without navigating", () => {
  for (const value of [key, "https://granttap.com/sign-in#token=" + key,
    "granttap://sign-in#token=" + key]) expect(parseSignInKey(value)).toBe(key);
  for (const value of ["bad", "x".repeat(257), "https://evil.example/sign-in#token=" + key,
    "https://granttap.com/sign-in?token=" + key, "https://granttap.com/sign-in#token=" + key + "&token=" + key,
    "https://user@granttap.com/sign-in#token=" + key]) expect(parseSignInKey(value)).toBeNull();
});

it("requires explicit consent and clears the key after a cookie-based login", async () => {
  const request = vi.fn().mockResolvedValue(Response.json({ accountId }));
  vi.stubGlobal("fetch", request);
  const signed = vi.fn(), busy = vi.fn();
  render(<AccountTokenAccess locale="en" disabled={false} onBusyChange={busy} onSignedIn={signed} />);
  fireEvent.click(screen.getByText("Sign in with a token or QR link"));
  fireEvent.change(screen.getByLabelText("Sign-in token"), { target: { value: key } });
  const button = screen.getByRole("button", { name: "Sign in with token" });
  expect(button).toHaveProperty("disabled", true);
  expect(request).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(button);
  await waitFor(() => expect(signed).toHaveBeenCalledWith(accountId));
  expect(request.mock.calls[0]).toEqual(["/api/account/browser-token/redeem", {
    method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
    body: JSON.stringify({ secret: key }),
  }]);
  expect(screen.getByLabelText("Sign-in token")).toHaveProperty("value", "");
  expect(busy).toHaveBeenLastCalledWith(false);
});

it.each(["unavailable", "malformed"])("clears sensitive input after %s responses", async kind => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(kind === "unavailable"
    ? new Response("{}", { status: 410 }) : Response.json({ accountId: "bad" })));
  const signed = vi.fn();
  render(<AccountTokenAccess locale="en" disabled={false} onBusyChange={() => {}} onSignedIn={signed} />);
  fireEvent.click(screen.getByText("Sign in with a token or QR link"));
  fireEvent.change(screen.getByLabelText("Sign-in token"), { target: { value: key } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Sign in with token" }));
  expect(await screen.findByRole("alert")).toBeTruthy();
  expect(screen.getByLabelText("Sign-in token")).toHaveProperty("value", "");
  expect(signed).not.toHaveBeenCalled();
});

it("explains pasted text that is not a sign-in token beside the field", () => {
  render(<AccountTokenAccess locale="en" disabled={false} onBusyChange={() => {}} onSignedIn={() => {}} />);
  fireEvent.click(screen.getByText("Sign in with a token or QR link"));
  const field = screen.getByLabelText("Sign-in token");
  fireEvent.change(field, { target: { value: "https://evil.example/sign-in#token=" + key } });
  expect(field.getAttribute("aria-invalid")).toBe("true");
  const hint = document.getElementById(field.getAttribute("aria-describedby") ?? "");
  expect(hint?.textContent).toBe("Paste a token that starts with gt_login_ or its granttap.com sign-in link.");
  fireEvent.change(field, { target: { value: key } });
  expect(field.getAttribute("aria-invalid")).toBeNull();
});

it("names the app screen exactly as the Russian app does and shows progress in the button", async () => {
  let reply: (value: Response) => void = () => {};
  vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise<Response>(resolve => { reply = resolve; })));
  render(<AccountTokenAccess locale="ru" disabled={false} onBusyChange={() => {}} onSignedIn={() => {}} />);
  fireEvent.click(screen.getByText("Войти по токену или ссылке из QR"));
  expect(screen.getByText(/Устройства → Аккаунт → Токены входа/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Токен входа"), { target: { value: key } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: "Войти по токену" }));
  expect(screen.getByRole("button", { name: "Входим…" })).toHaveProperty("disabled", true);
  reply(new Response("{}", { status: 410 }));
  expect((await screen.findByRole("alert")).className).toContain("account-error");
});

import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { SignInMethods } from "..";

afterEach(() => vi.restoreAllMocks());
function methods(locale: "en" | "ru" = "en", busy = false) {
  const passkey = vi.fn();
  render(<SignInMethods locale={locale} busy={busy} onPasskey={passkey} onBusyChange={() => {}} onSignedIn={() => {}} />);
  return passkey;
}

test("offers passkey, iPhone QR, password and sign-in token with passkey recommended first", () => {
  const passkey = methods();
  const choices = within(screen.getByRole("radiogroup", { name: "Sign-in method" })).getAllByRole("radio");
  expect(choices.map(choice => choice.closest("label")?.textContent)).toEqual(["Passkey Recommended", "iPhone QR", "Password", "Sign-in token"]);
  expect(choices[0]).toHaveProperty("checked", true);
  fireEvent.click(screen.getByRole("button", { name: "Sign in with passkey" }));
  expect(passkey).toHaveBeenLastCalledWith("authentication", false);
  fireEvent.click(screen.getByRole("button", { name: "Use a passkey from another device" }));
  expect(passkey).toHaveBeenLastCalledWith("authentication", true);
  fireEvent.click(screen.getByRole("button", { name: "Create account with passkey" }));
  expect(passkey).toHaveBeenLastCalledWith("registration", false);
});

test("the iPhone method starts a phone QR only when chosen, and the token form has its own choice", async () => {
  const request = vi.spyOn(globalThis, "fetch").mockResolvedValue(Response.json({ error: "busy" }, { status: 503 }));
  methods();
  expect(request).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("radio", { name: "iPhone QR" }));
  expect(await screen.findByText(/Phone sign-in isn't available right now/)).toBeTruthy();
  expect(request).toHaveBeenCalledWith("/api/account/qr-sign-in/requests", expect.objectContaining({ method: "POST" }));
  fireEvent.click(screen.getByRole("radio", { name: "Sign-in token" }));
  expect(screen.getByLabelText("Sign-in token", { selector: "input[type=password]" })).toBeTruthy();
});

test("switching to password shows its form and switching back keeps every method one choice away", () => {
  methods("ru");
  fireEvent.click(screen.getByRole("radio", { name: "Пароль" }));
  expect(screen.getByLabelText("Логин GrantTap")).toBeTruthy();
  fireEvent.click(screen.getByRole("radio", { name: /Passkey/ }));
  expect(screen.getByRole("button", { name: "Войти через passkey" })).toBeTruthy();
  expect(screen.queryByLabelText("Логин GrantTap")).toBeNull();
});

test("a busy account request locks the method choice and passkey buttons", () => {
  methods("en", true);
  expect(screen.getByRole("radio", { name: "iPhone QR" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("button", { name: "Sign in with passkey" })).toHaveProperty("disabled", true);
});

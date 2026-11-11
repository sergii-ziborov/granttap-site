import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { SignInMethods } from "..";

function methods(locale: "en" | "ru" = "en", busy = false) {
  const passkey = vi.fn();
  render(<SignInMethods locale={locale} busy={busy} onPasskey={passkey} onBusyChange={() => {}} onSignedIn={() => {}} />);
  return passkey;
}

test("offers passkey, QR and password side by side with passkey recommended first", () => {
  const passkey = methods();
  const choices = within(screen.getByRole("radiogroup", { name: "Sign-in method" })).getAllByRole("radio");
  expect(choices.map(choice => choice.getAttribute("aria-label") ?? choice.closest("label")?.textContent))
    .toEqual(["Passkey Recommended", "QR code", "Password"]);
  expect(choices[0]).toHaveProperty("checked", true);
  expect(screen.queryByLabelText("GrantTap login")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Sign in with passkey" }));
  expect(passkey).toHaveBeenLastCalledWith("authentication", false);
  fireEvent.click(screen.getByRole("button", { name: "Create account with passkey" }));
  expect(passkey).toHaveBeenLastCalledWith("registration", false);
});

test("the QR method opens a phone passkey prompt and accepts a sign-in link from the app", () => {
  const passkey = methods();
  fireEvent.click(screen.getByRole("radio", { name: "QR code" }));
  fireEvent.click(screen.getByRole("button", { name: "Show a QR for my phone" }));
  expect(passkey).toHaveBeenLastCalledWith("authentication", true);
  expect(screen.getByLabelText("Sign-in token")).toBeTruthy();
  expect(screen.queryByRole("button", { name: "Sign in with passkey" })).toBeNull();
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
  expect(screen.getByRole("radio", { name: "QR code" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("button", { name: "Sign in with passkey" })).toHaveProperty("disabled", true);
});

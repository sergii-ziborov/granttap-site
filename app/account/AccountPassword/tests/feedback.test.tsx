import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { AccountPassword } from "..";

const password = "A dedicated fixture passphrase";
const accountId = "00000000-0000-4000-8000-000000000001";
afterEach(() => vi.unstubAllGlobals());

function form(locale: "en" | "ru" = "en") {
  render(<AccountPassword locale={locale} onSignedIn={() => {}} onBusyChange={() => {}} />);
}

function description(field: HTMLElement) {
  return (field.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean)
    .map(id => document.getElementById(id)?.textContent ?? "").join(" ");
}

test("offers the same two account actions as the app and describes the password rule beside its field", () => {
  form();
  expect(screen.getByRole("radio", { name: "Sign in" })).toHaveProperty("checked", true);
  fireEvent.click(screen.getByRole("radio", { name: "Create account" }));
  const field = screen.getByLabelText("Password");
  expect(field.getAttribute("autocomplete")).toBe("new-password");
  expect(description(field)).toContain("15–128 characters");
});

test("explains an invalid login next to the field once the person leaves it", () => {
  form();
  const login = screen.getByLabelText("GrantTap login");
  expect(login.getAttribute("autocorrect")).toBe("off");
  expect(login.getAttribute("name")).toBe("username");
  fireEvent.change(login, { target: { value: "bad name" } });
  expect(login.getAttribute("aria-invalid")).toBeNull();
  fireEvent.blur(login);
  expect(login.getAttribute("aria-invalid")).toBe("true");
  expect(description(login)).toBe("Use 3–64 letters, digits, dots, underscores or hyphens.");
  fireEvent.change(login, { target: { value: "review.fixture" } });
  expect(login.getAttribute("aria-invalid")).toBeNull();
});

test("names a mismatched confirmation beside the confirmation field", () => {
  form("ru");
  fireEvent.click(screen.getByRole("radio", { name: "Создать аккаунт" }));
  fireEvent.change(screen.getByLabelText("Пароль"), { target: { value: password } });
  const confirmation = screen.getByLabelText("Повторите пароль");
  fireEvent.change(confirmation, { target: { value: "A different fixture phrase" } });
  fireEvent.blur(confirmation);
  expect(confirmation.getAttribute("aria-invalid")).toBe("true");
  expect(description(confirmation)).toBe("Пароли не совпадают.");
});

test("keeps progress inside the submit button and attaches an unavailable login to the login field", async () => {
  let reply: (value: unknown) => void = () => {};
  vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(resolve => { reply = resolve; })));
  form();
  fireEvent.click(screen.getByRole("radio", { name: "Create account" }));
  fireEvent.change(screen.getByLabelText("GrantTap login"), { target: { value: "taken.fixture" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  fireEvent.change(screen.getByLabelText("Confirm password"), { target: { value: password } });
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  expect(screen.getByRole("button", { name: "Creating account…" })).toHaveProperty("disabled", true);
  expect(screen.getByRole("status").textContent).toBe("Creating account…");
  reply({ ok: false, status: 409 });
  const login = screen.getByLabelText("GrantTap login");
  await waitFor(() => expect(login.getAttribute("aria-invalid")).toBe("true"));
  expect(description(login)).toBe("This login is unavailable. Choose another login.");
  expect(screen.getByRole("status").textContent).toBe("");
  fireEvent.change(login, { target: { value: "new.fixture" } });
  expect(login.getAttribute("aria-invalid")).toBeNull();
  expect(screen.queryByRole("alert")).toBeNull();
});

test("clears a rejected sign-in message as soon as the credentials change", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce({ ok: false, status: 401 })
    .mockResolvedValue({ ok: true, status: 200, json: async () => ({ accountId }) }));
  form();
  fireEvent.change(screen.getByLabelText("GrantTap login"), { target: { value: "review.fixture" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "incorrect passphrase" } });
  fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
  expect((await screen.findByRole("alert")).textContent).toBe("The login or password is incorrect.");
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
  expect(screen.queryByRole("alert")).toBeNull();
});

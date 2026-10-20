import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import { SubscriptionSupport } from "../SubscriptionSupport";
afterEach(() => vi.unstubAllGlobals());

test("Apple cancellation stays available before any optional feedback or network request", async () => {
  const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ saved: true }) });
  vi.stubGlobal("fetch", request);
  render(<SubscriptionSupport locale="en" />);
  expect(screen.getByRole("link", { name: "Manage or cancel with Apple" }).getAttribute("href"))
    .toBe("https://apps.apple.com/account/subscriptions");
  expect(request).not.toHaveBeenCalled();
  const send = screen.getByRole("button", { name: "Send feedback" }) as HTMLButtonElement;
  expect(send.disabled).toBe(true);
  fireEvent.change(screen.getByLabelText("Reason (optional)"), { target: { value: "price" } });
  fireEvent.change(screen.getByLabelText("Comment (optional)"), { target: { value: "Please keep a smaller plan." } });
  await act(async () => { fireEvent.click(send); });
  await screen.findByText("Thank you. Your feedback was saved.");
  expect(request).toHaveBeenCalledTimes(1);
  const options = request.mock.calls[0][1];
  expect(JSON.parse(options.body)).toMatchObject({ reason: "price", comment: "Please keep a smaller plan." });
  expect(options.credentials).toBe("same-origin");
  expect(screen.getByRole("link", { name: "Manage or cancel with Apple" })).toBeTruthy();
});

test("an uncertain response retries the same submission and never blocks Apple settings", async () => {
  const request = vi.fn().mockRejectedValueOnce(Error("offline"))
    .mockResolvedValueOnce({ ok: true, json: async () => ({ saved: true }) });
  vi.stubGlobal("fetch", request);
  render(<SubscriptionSupport locale="en" />);
  fireEvent.change(screen.getByLabelText("Reason (optional)"), { target: { value: "technical_problem" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Send feedback" })); });
  await screen.findByRole("alert");
  expect((screen.getByLabelText("Reason (optional)") as HTMLSelectElement).disabled).toBe(true);
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Retry saving feedback" })); });
  await screen.findByText("Thank you. Your feedback was saved.");
  expect(request.mock.calls[0][1].body).toBe(request.mock.calls[1][1].body);
});

test("server rejection is shown in Russian while cancellation is still immediately reachable", async () => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
  render(<SubscriptionSupport locale="ru" />);
  fireEvent.change(screen.getByLabelText("Причина (необязательно)"), { target: { value: "other" } });
  await act(async () => { fireEvent.click(screen.getByRole("button", { name: "Отправить отзыв" })); });
  await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("Не удалось"));
  expect(screen.getByRole("link", { name: "Управление и отмена в Apple" })).toBeTruthy();
});

test("a comment can be sent without choosing an optional reason", async () => {
  const request = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ saved: true }) });
  vi.stubGlobal("fetch", request);
  render(<SubscriptionSupport locale="en" />);
  fireEvent.change(screen.getByLabelText("Comment (optional)"), { target: { value: "A smaller plan would help." } });
  const send = screen.getByRole("button", { name: "Send feedback" }) as HTMLButtonElement;
  expect(send.disabled).toBe(false);
  await act(async () => { fireEvent.click(send); });
  await screen.findByText("Thank you. Your feedback was saved.");
  expect(JSON.parse(request.mock.calls[0][1].body)).toMatchObject({ reason: "other", comment: "A smaller plan would help." });
});

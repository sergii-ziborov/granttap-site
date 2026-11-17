import { StrictMode } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import SignInPage, { metadata } from "../page";

describe("account token landing", () => {
  it("hands off only on a user click and removes the secret from browser history", async () => {
    const secret = "gt_login_" + "a".repeat(43);
    window.history.replaceState(null, "", "/sign-in#token=" + secret);
    const fetch = vi.spyOn(globalThis, "fetch");
    render(<StrictMode><SignInPage /></StrictMode>);
    const button = await screen.findByRole("link", { name: "Open GrantTap" });
    expect(button.getAttribute("href")).toBe("granttap://sign-in#token=" + secret);
    expect(window.location.hash).toBe("");
    expect(window.localStorage.getItem("token")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole("button", { name: "Switch to Russian" }));
    expect(screen.getByRole("link", { name: "Открыть GrantTap" }).getAttribute("href")).toBe("granttap://sign-in#token=" + secret);
    expect(metadata.robots).toEqual({ index: false, follow: false });
    fetch.mockRestore();
  });

  it("does not turn an incomplete link into a sign-in or network request", async () => {
    window.history.replaceState(null, "", "/sign-in#token=bad");
    window.localStorage.clear();
    render(<SignInPage />);
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("incomplete"));
    expect(screen.queryByRole("link", { name: "Open GrantTap" })).toBeNull();
  });
});

describe("browser QR landing", () => {
  it("explains the approval, warns about codes from others and hands off on a click only", async () => {
    const qr = "#qr=" + "c".repeat(43) + "." + "D".repeat(43);
    window.history.replaceState(null, "", "/sign-in" + qr);
    const fetch = vi.spyOn(globalThis, "fetch");
    render(<SignInPage />);
    expect((await screen.findByRole("link", { name: "Open GrantTap" })).getAttribute("href")).toBe("granttap://sign-in" + qr);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe("Approve this sign-in in GrantTap");
    expect(screen.getByText(/Never approve a code someone sent you/)).toBeTruthy();
    expect(window.location.hash).toBe("");
    expect(fetch).not.toHaveBeenCalled();
    fetch.mockRestore();
  });
});

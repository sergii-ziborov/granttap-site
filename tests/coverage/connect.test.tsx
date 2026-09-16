import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, expect, test, vi } from "vitest";
import { ConnectView } from "../../app/connect/ConnectView";

afterEach(() => {
  vi.unstubAllGlobals();
  window.location.hash = "";
});

test("connect page talks only to the website API", async () => {
  window.location.hash = "#request=11111111-1111-4111-8111-111111111111";
  const fetchMock = vi.fn(async (input: RequestInfo) => {
    const url = String(input);
    expect(url).toContain("/api/connect/requests/");
    expect(url).not.toMatch(/127\.0\.0\.1|localhost|17342/);
    if (url.endsWith("/decision")) return new Response(JSON.stringify({ ok: true }), { status: 200 });
    return new Response(JSON.stringify({
      clientName: "Cursor",
      paired: true,
      phones: [{ name: "iPhone", status: "paired" }],
      providers: [{ id: "cursor", installed: true, ready: true }],
    }), { status: 200 });
  });
  vi.stubGlobal("fetch", fetchMock);

  render(<ConnectView />);
  expect(await screen.findByRole("heading", { name: "Connect your coding app", level: 1 })).toBeTruthy();
  expect(screen.getByText("Cursor")).toBeTruthy();
  expect(screen.getByText(/already connected/i)).toBeTruthy();

  await userEvent.click(screen.getByRole("button", { name: "Approve" }));
  expect(fetchMock.mock.calls.some((call) => String(call[0]).endsWith("/decision"))).toBe(true);
});

test("missing request does not mention loopback", async () => {
  window.location.hash = "";
  render(<ConnectView />);
  expect(screen.getByText(/not on GrantTap yet/i)).toBeTruthy();
  expect(document.body.textContent).not.toMatch(/127\.0\.0\.1|localhost:17342/);
});

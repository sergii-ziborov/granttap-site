import { beforeEach, expect, test, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountView } from "../../app/account/AccountView";

const passkeys = vi.hoisted(() => ({ create: vi.fn(), get: vi.fn() }));
vi.mock("@simplewebauthn/browser", () => ({ startRegistration: passkeys.create, startAuthentication: passkeys.get }));

const accountId = "0b6f0e7e-3a43-4c49-8a8e-5ad2c3a1b2c4";
const computer = { type: "computer", id: "4db0fc90-3ad4-4427-aec8-9b6405ec72d2", kind: "computer", name: "MacBook Pro", signIn: null,
  createdAt: 1, lastSeenAt: Date.now() - 60_000, expiresAt: null, current: false, delegated: false, encryptionKeyId: "a1b2c3d4e5f6" + "0".repeat(52) };
const browser = { type: "session", id: "9d7a7d0b-08f4-4b8f-9fd2-6d0a3b9f1e10", kind: "browser", name: "Chrome on macOS", signIn: "passkey",
  createdAt: Date.now() - 1000, lastSeenAt: Date.now(), expiresAt: Date.now() + 1e9, current: true, delegated: false };
const old = { ...browser, id: "1f0e6a59-2c55-4d55-9a8f-2d2f8b8c1c11", name: "Firefox on Windows", current: false,
  createdAt: Date.now() - 50 * 86_400_000, lastSeenAt: Date.now() - 45 * 86_400_000 };

type Route = (init: RequestInit | undefined) => Response | Promise<Response>;
function serve(routes: Record<string, Route | Response>, signedIn = true, signIn = "passkey") {
  const defaults: Record<string, Route | Response> = {
    "GET me": signedIn ? Response.json({ accountId }) : Response.json({}, { status: 401 }),
    "GET summary": Response.json({ accountId, createdAt: 1_763_000_000_000, session: { id: browser.id, signIn, delegated: signIn === "qr" },
      methods: { passkeys: 1, password: null, signInTokens: 0 } }),
    "GET devices": Response.json({ devices: [browser, computer, old] }),
    "GET web-key": Response.json({ stored: false }),
    "GET subscriptions/computers": Response.json({ accountId, computers: [{ id: computer.id, enabled: false, selected: false }],
      selectedCount: 0, nextCursor: null, limit: 2, source: "subscription" }),
  };
  const table = { ...defaults, ...routes };
  return vi.spyOn(globalThis, "fetch").mockImplementation(async (input, init) => {
    const path = String(input).replace("/api/account/", "").split("?")[0];
    const entry = table[`${init?.method ?? "GET"} ${path}`];
    if (!entry) return Response.json({ error: "unexpected " + path }, { status: 500 });
    return typeof entry === "function" ? entry(init) : entry.clone();
  });
}

beforeEach(() => {
  vi.restoreAllMocks();
  passkeys.create.mockReset(); passkeys.get.mockReset();
  Object.defineProperty(window, "PublicKeyCredential", { value: class {}, configurable: true });
});

test("passkey sign-in opens the account sections with this browser first", async () => {
  let signedIn = false;
  serve({ "GET me": () => signedIn ? Response.json({ accountId }) : Response.json({}, { status: 401 }),
    "POST authentication/options": Response.json({ ceremonyId: "ceremony", options: { challenge: "challenge" } }),
    "POST authentication/verify": () => { signedIn = true; return Response.json({ accountId }); } }, false);
  passkeys.get.mockResolvedValue({ id: "credential" });
  render(<AccountView />);
  expect(within(await screen.findByRole("radiogroup", { name: "Sign-in method" })).getAllByRole("radio")).toHaveLength(4);
  await userEvent.click(screen.getByRole("button", { name: "Sign in with passkey" }));
  expect(passkeys.get).toHaveBeenCalledWith({ optionsJSON: { challenge: "challenge" } });
  expect(await screen.findByRole("heading", { level: 1, name: "Your account" })).toBeTruthy();
  expect(screen.getByText(accountId)).toBeTruthy();
  expect(screen.getByText("Signed in on this browser with a passkey.")).toBeTruthy();
  const nav = screen.getByRole("navigation", { name: "Account sections" });
  expect(within(nav).getAllByRole("link").map(link => link.textContent)).toEqual(
    ["Account", "Sign-in methods", "Devices", "Encryption key", "Subscription", "Danger zone"]);
  const devices = screen.getByRole("region", { name: "Devices" });
  expect(within(devices).getAllByRole("listitem")[0].textContent).toContain("This browser");
  expect(screen.getByText(/Chats encrypted · key a1b2c3/)).toBeTruthy();
});

test("another device signs in with a hybrid passkey and failures stay beside the buttons", async () => {
  serve({ "POST authentication/options": Response.json({ ceremonyId: "phone", options: { challenge: "phone-challenge" } }),
    "POST authentication/verify": Response.json({}, { status: 401 }) }, false);
  passkeys.get.mockResolvedValue({ id: "phone" });
  render(<AccountView />);
  await userEvent.click(await screen.findByRole("button", { name: "Use a passkey from another device" }));
  expect(passkeys.get).toHaveBeenCalledWith({ optionsJSON: { challenge: "phone-challenge", hints: ["hybrid"] } });
  const alert = await screen.findByRole("alert");
  expect(alert.closest("section")?.getAttribute("aria-label")).toBe("Passkey");
  Object.defineProperty(window, "PublicKeyCredential", { value: undefined, configurable: true });
  await userEvent.click(screen.getByRole("button", { name: "Sign in with passkey" }));
  expect((await screen.findByRole("alert")).textContent).toMatch(/Passkeys aren't available/);
});

test("creating an account and deleting it both ask first", async () => {
  let signedIn = false;
  const fetcher = serve({ "GET me": () => signedIn ? Response.json({ accountId }) : Response.json({}, { status: 401 }),
    "POST registration/options": Response.json({ ceremonyId: "new", options: { challenge: "create" } }),
    "POST registration/verify": () => { signedIn = true; return Response.json({ accountId }); },
    "DELETE me": Response.json({ deleted: true }) }, false);
  passkeys.create.mockResolvedValue({ id: "new" });
  render(<AccountView />);
  await userEvent.click(await screen.findByRole("button", { name: "Create account with passkey" }));
  const danger = await screen.findByRole("region", { name: "Danger zone" });
  await userEvent.click(within(danger).getByRole("button", { name: "Delete account" }));
  expect(within(danger).getByText(/Delete this account for good/)).toBeTruthy();
  expect(document.activeElement?.textContent).toBe("Delete account");
  await userEvent.click(within(danger).getByRole("button", { name: "Cancel" }));
  await userEvent.click(within(danger).getByRole("button", { name: "Delete account" }));
  await userEvent.click(within(danger).getAllByRole("button", { name: "Delete account" })[0]);
  expect(await screen.findByRole("button", { name: "Sign in with passkey" })).toBeTruthy();
  expect(fetcher.mock.calls.filter(([, init]) => init?.method === "DELETE")).toHaveLength(1);
});

test("signs out a device, removes quiet devices and refuses deletion from a QR browser", async () => {
  const fetcher = serve({ [`DELETE devices/sessions/${old.id}`]: Response.json({ revoked: true }),
    "POST devices/prune": Response.json({ removed: [] }) }, true, "qr");
  render(<AccountView />);
  const devices = await screen.findByRole("region", { name: "Devices" });
  await userEvent.click(within(devices).getByRole("button", { name: "Sign out: Firefox on Windows" }));
  await userEvent.click(within(devices).getAllByRole("button", { name: "Sign out" })[0]);
  await waitFor(() => expect(fetcher).toHaveBeenCalledWith(`/api/account/devices/sessions/${old.id}`, expect.objectContaining({ method: "DELETE" })));
  await userEvent.click(within(devices).getByRole("button", { name: "Remove devices not seen for 30 days" }));
  expect(within(devices).getByText("Firefox on Windows", { selector: "strong" })).toBeTruthy();
  await userEvent.click(within(devices).getByRole("button", { name: "Remove 1" }));
  await waitFor(() => expect(fetcher).toHaveBeenCalledWith("/api/account/devices/prune", expect.objectContaining({ body: '{"inactiveDays":30}' })));
  const danger = screen.getByRole("region", { name: "Danger zone" });
  expect(within(danger).queryByRole("button", { name: "Delete account" })).toBeNull();
  expect(within(danger).getByText(/signed in with a QR code/)).toBeTruthy();
});

test("a stored key is explained plainly and can be removed after confirmation", async () => {
  let stored = true;
  const fetcher = serve({ "GET web-key": () => Response.json(stored ? { stored: true, createdAt: 1_763_000_000_000, storedFrom: "Chrome on macOS",
    computers: [{ computerId: computer.id, name: "MacBook Pro", recipientKeyId: "64e997" + "0".repeat(58) }] } : { stored: false }),
  "DELETE web-key": () => { stored = false; return Response.json({ removed: true }); } });
  render(<AccountView />);
  const key = await screen.findByRole("region", { name: "Encryption key" });
  expect(within(key).getByText("Stored in your account")).toBeTruthy();
  expect(within(key).getByText(/If granttap.com is ever hacked/)).toBeTruthy();
  await userEvent.click(within(key).getByRole("button", { name: "Remove the key from my account" }));
  await userEvent.click(within(key).getByRole("button", { name: "Remove key" }));
  expect(await within(key).findByText("Not stored in your account")).toBeTruthy();
  expect(fetcher).toHaveBeenCalledWith("/api/account/web-key", expect.objectContaining({ method: "DELETE" }));
});

test("signing out returns to the sign-in choices and a failed load says so", async () => {
  serve({ "POST logout": Response.json({ ok: true }) });
  const view = render(<AccountView />);
  await userEvent.click((await screen.findAllByRole("button", { name: "Sign out" }))[0]);
  expect(await screen.findByRole("heading", { level: 1, name: "Sign in to GrantTap" })).toBeTruthy();
  view.unmount();
  vi.restoreAllMocks();
  serve({ "GET summary": Response.json({}, { status: 503 }) });
  render(<AccountView />);
  expect((await screen.findByRole("alert")).textContent).toMatch(/didn't work/);
});

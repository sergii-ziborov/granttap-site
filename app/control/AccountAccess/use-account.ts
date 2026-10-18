"use client";
import { useEffect, useState } from "react";
import { BrowserKeyVault } from "../BrowserKeys";
import { connectAccountComputer } from "../ComputerConnection";
import { ControlRuntime } from "../ControlRuntime";

export type AccountComputer = { id: string; name: string; lastSeenAt?: number };
export type ControlAccount = { accountId: string; runtime: ControlRuntime; vault: BrowserKeyVault;
  machines: AccountComputer[]; connected: Set<string>; source: string };

export function useControlAccount() {
  const [account, setAccount] = useState<ControlAccount>();
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"loading" | "signin" | "subscription" | "ready" | "error">("loading");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let disposed = false, runtime: ControlRuntime | undefined, accountIdentity: string | undefined;
    const controller = new AbortController();
    const load = async () => {
      const response = await fetch("/api/account/control/access", { signal: controller.signal });
      if (disposed) return;
      if (!response.ok) { setStatus(response.status === 401 ? "signin" : response.status === 403 ? "subscription" : "error");
        runtime?.dispose(); return; }
      const access = await response.json();
      accountIdentity = access.accountId;
      const machines = await loadAccountComputers(controller.signal);
      const vault = new BrowserKeyVault(), keys = await vault.read(access.accountId);
      if (disposed) return;
      runtime = new ControlRuntime(access.accountId, vault);
      await runtime.restore(keys, new Set(machines.map(machine => machine.id)));
      if (disposed) { runtime.dispose(); return; }
      setAccount({ accountId: access.accountId, runtime, vault, machines,
        connected: new Set(keys.pairings.map(pair => pair.machineId)), source: access.access.source }); setStatus("ready");
    };
    void load().catch(() => { if (!disposed) { setError("Account access could not be verified. Please retry."); setStatus("error"); } });
    const verify = setInterval(() => {
      void fetch("/api/account/control/access", { signal: controller.signal }).then(async response => {
        if (disposed) return;
        if (response.ok) {
          const current = await response.json();
          if (!disposed && accountIdentity && current.accountId !== accountIdentity) {
            runtime?.dispose(); setAccount(undefined); setStatus("loading"); setAttempt(value => value + 1);
          }
          return;
        }
        runtime?.dispose(); setStatus(response.status === 401 ? "signin" : response.status === 403 ? "subscription" : "error");
      }).catch(() => {});
    }, 240_000);
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("granttap-browser-access") : undefined;
    if (channel) channel.onmessage = event => { if (event.data === "forgotten") { runtime?.dispose(); setAttempt(value => value + 1); } };
    return () => { disposed = true; controller.abort(); clearInterval(verify); channel?.close(); runtime?.dispose(); };
  }, [attempt]);

  const connect = async (machineId: string, signal: AbortSignal) => {
    if (!account) throw Error("Sign in first.");
    const pairing = await connectAccountComputer(machineId, signal);
    const keys = await account.vault.update(account.accountId, old => ({ ...old,
      pairings: [...old.pairings.filter(pair => pair.machineId !== machineId), pairing] }));
    account.runtime.connect(pairing, keys);
    setAccount({ ...account, connected: new Set(keys.pairings.map(pair => pair.machineId)) });
  };
  const forget = async () => {
    await account?.runtime.forget();
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("granttap-browser-access") : undefined;
    channel?.postMessage("forgotten"); channel?.close(); setAttempt(value => value + 1);
  };
  return { account, status, error, connect, forget, retry: () => setAttempt(value => value + 1) };
}

async function loadAccountComputers(signal: AbortSignal): Promise<AccountComputer[]> {
  const all = new Map<string, AccountComputer>(); let cursor: string | undefined;
  const visited = new Set<string>();
  for (let page = 0; page < 100; page++) {
    const response = await fetch("/api/account/machines?pageSize=100" + (cursor ? "&cursor=" + encodeURIComponent(cursor) : ""), { signal });
    if (!response.ok) throw Error("Computers unavailable.");
    const value = await response.json();
    if (!Array.isArray(value.machines)) throw Error("Invalid computer list.");
    for (const machine of value.machines) if (typeof machine.id === "string" && typeof machine.name === "string") all.set(machine.id, machine);
    if (!value.nextCursor) return [...all.values()];
    if (typeof value.nextCursor !== "string" || visited.has(value.nextCursor)) throw Error("Computer pagination did not advance.");
    const next: string = value.nextCursor; cursor = next; visited.add(next);
  }
  throw Error("Computer list exceeds its page limit.");
}

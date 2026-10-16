"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../components/Locale";

type Machine = { id: string; name: string };
type State = { id: string; enabled: boolean; selected: boolean };
type Page = { accountId: string; computers: State[]; nextCursor: string | null;
  selectedCount: number; limit: number | null; source: string | null };
const endpoint = "/api/account/subscriptions/computers";
const copy = {
  en: { title: "Managed publishing", enabled: "Publish through managed service", disconnect: "Disconnect",
    loading: "Checking managed access…", failed: "Managed selection could not be updated. Refresh and try again.",
    refresh: "Refresh selection", beta: "Beta access", selected: "Selected computers",
    note: "Turn publishing off to free a managed place without forgetting this computer or deleting history. An existing relay lease may remain valid for up to five minutes. Enable it explicitly to use a place again." },
  ru: { title: "Managed-публикация", enabled: "Публиковать через managed-сервис", disconnect: "Отключить",
    loading: "Проверка managed-доступа…", failed: "Не удалось изменить выбор. Обновите состояние и повторите.",
    refresh: "Обновить выбор", beta: "Бета-доступ", selected: "Выбранные компьютеры",
    note: "Выключите публикацию, чтобы освободить managed-место, сохранив компьютер и историю. Ранее выданный relay-доступ может действовать ещё до пяти минут. Для повторного использования места включите компьютер явно." },
};

async function selection(accountId: string, signal?: AbortSignal): Promise<Page> {
  const computers: State[] = [], cursors = new Set<string>();
  let cursor: string | null = null;
  for (let count = 0; count < 100; count++) {
    const response = await fetch(endpoint + (cursor ? "?cursor=" + encodeURIComponent(cursor) : ""),
      { credentials: "same-origin", signal });
    if (!response.ok) throw Error("Selection unavailable");
    const page = await response.json() as Page;
    if (page.accountId !== accountId || !Array.isArray(page.computers) || page.computers.length > 100
      || !Number.isSafeInteger(page.selectedCount) || page.selectedCount < 0
      || (page.limit !== null && ![2, 5, 15, 100].includes(page.limit))
      || (page.nextCursor !== null && typeof page.nextCursor !== "string")
      || page.computers.some(c => typeof c.id !== "string" || typeof c.enabled !== "boolean"
        || typeof c.selected !== "boolean" || c.selected && !c.enabled)) throw Error("Invalid selection");
    computers.push(...page.computers);
    if (!page.nextCursor) return { ...page, computers };
    if (cursors.has(page.nextCursor)) throw Error("Repeated selection cursor");
    cursor = page.nextCursor;
    cursors.add(cursor);
  }
  throw Error("Selection exceeds pagination limit");
}

export function ComputerPublishing({ accountId, locale, machines, busy, onDisconnect }: {
  accountId: string; locale: Locale; machines: Machine[]; busy: boolean;
  onDisconnect: (machine: Machine) => void;
}) {
  const t = copy[locale];
  const [page, setPage] = useState<Page | null>(null);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    void selection(accountId, controller.signal).then(result => {
      if (!controller.signal.aborted) setPage(result);
    }).catch(() => {
      if (!controller.signal.aborted) setFailed(true);
    });
    return () => controller.abort();
  }, [accountId]);

  async function refresh() {
    setSaving(true); setFailed(false);
    try { setPage(await selection(accountId)); }
    catch { setFailed(true); }
    finally { setSaving(false); }
  }

  async function change(id: string, enabled: boolean) {
    setSaving(true); setFailed(false);
    try {
      const result = await fetch(endpoint + "/" + id,
        { method: enabled ? "PUT" : "DELETE", credentials: "same-origin" });
      if (!result.ok) throw Error("Selection update failed");
      setPage(await selection(accountId));
    } catch { setFailed(true); }
    finally { setSaving(false); }
  }

  const states = new Map(page?.computers.map(computer => [computer.id, computer]));
  return <section id="managed-computers" className="account-publishing">
    <h3>{t.title}</h3>
    {page ? <p>{page.source === "beta" ? t.beta : t.selected}: {page.selectedCount} / {page.limit ?? "—"}</p>
      : <p role="status">{failed ? t.failed : t.loading}</p>}
    <ul className="account-machines">{machines.map(machine => <li key={machine.id}>
      <div><strong>{machine.name}</strong><label className="account-publishing-choice">
        <input type="checkbox" checked={states.get(machine.id)?.enabled ?? false}
          disabled={busy || saving || !states.has(machine.id)}
          onChange={event => void change(machine.id, event.target.checked)}
          aria-label={`${t.enabled}: ${machine.name}`} />{t.enabled}</label></div>
      <button type="button" disabled={busy || saving} aria-label={`${t.disconnect} ${machine.name}`}
        onClick={() => onDisconnect(machine)}>{t.disconnect}</button>
    </li>)}</ul>
    {failed && page && <p role="status" className="account-error">{t.failed}</p>}
    <p className="account-boundary">{t.note}</p>
    <button type="button" disabled={busy || saving} onClick={() => void refresh()}>{t.refresh}</button>
  </section>;
}

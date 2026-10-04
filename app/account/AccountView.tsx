"use client";

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { useEffect, useState } from "react";
import { LanguageToggle, useLocale } from "../components/Locale";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

type Ceremony<T> = { ceremonyId: string; options: T };
type Account = { accountId: string };
type Machine = { id: string; name: string; createdAt: number; lastSeenAt: number | null };
const base = "/api/account/";

const copy = {
  en: {
    title: "Your GrantTap account",
    lead: "Use the same passkey on Mac and iPhone to find your account. GrantTap links computers separately and transfers pairing keys encrypted.",
    create: "Create an account with passkey",
    signIn: "Sign in with passkey",
    createNote: "Already have an account? Sign in first. Creating another account will not find your existing computers.",
    account: "Account ID",
    noComputer: "Open GrantTap on iPhone to connect to a listed Mac. Its MCP service must be online; this website cannot read pairing keys.",
    computers: "Connected computers",
    disconnect: "Disconnect",
    none: "No computers are linked to this account.",
    loading: "Loading computers…",
    signOut: "Sign out",
    delete: "Delete account",
    confirmDelete: "Delete this account and its passkey records? This cannot be undone.",
    unavailable: "Passkeys are unavailable here. Check your browser and device settings.",
    failed: "The account request failed. Please try again.",
    home: "GrantTap home",
  },
  ru: {
    title: "Ваш аккаунт GrantTap",
    lead: "Один passkey открывает ваш аккаунт на Mac и iPhone. Компьютер привязывается отдельно, а ключи подключения передаются зашифрованными.",
    create: "Создать аккаунт с passkey",
    signIn: "Войти по passkey",
    createNote: "Уже есть аккаунт? Сначала войдите. Новый аккаунт не найдёт ваши прежние компьютеры.",
    account: "ID аккаунта",
    noComputer: "Откройте GrantTap на iPhone и выберите Mac из списка. Его MCP должен работать; сайт не видит ключей подключения.",
    computers: "Подключённые компьютеры",
    disconnect: "Отключить",
    none: "К аккаунту пока не привязаны компьютеры.",
    loading: "Загрузка компьютеров…",
    signOut: "Выйти",
    delete: "Удалить аккаунт",
    confirmDelete: "Удалить аккаунт и записи passkey? Это действие нельзя отменить.",
    unavailable: "Passkey здесь недоступен. Проверьте браузер и настройки устройства.",
    failed: "Не удалось выполнить запрос. Попробуйте ещё раз.",
    home: "Главная GrantTap",
  },
};

async function post<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(base + path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
    credentials: "same-origin",
  });
  if (!response.ok) throw new Error(`Account request: ${response.status}`);
  return await response.json() as T;
}

export function AccountView() {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];
  const [accountId, setAccountId] = useState<string | null>();
  const [machines, setMachines] = useState<Machine[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    void fetch(base + "me", { credentials: "same-origin" })
      .then(async response => response.ok ? await response.json() as Account : null)
      .then(account => { if (active) setAccountId(account?.accountId ?? null); })
      .catch(() => { if (active) setAccountId(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!accountId) return;
    let active = true;
    void fetch(base + "machines", { credentials: "same-origin" })
      .then(async response => {
        if (!response.ok) throw new Error("Machines unavailable");
        return await response.json() as { machines: Machine[] };
      })
      .then(result => { if (active) setMachines(result.machines); })
      .catch(() => { if (active) setError(copy[locale].failed); });
    return () => { active = false; };
  }, [accountId, locale]);

  async function disconnect(machine: Machine) {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(base + "machines/" + machine.id,
        { method: "DELETE", credentials: "same-origin" });
      if (!response.ok) throw new Error("Revoke failed");
      setMachines(current => current?.filter(item => item.id !== machine.id) ?? null);
    } catch { setError(t.failed); }
    finally { setBusy(false); }
  }

  async function enter(kind: "registration" | "authentication") {
    setBusy(true);
    setError(null);
    try {
      if (!window.PublicKeyCredential) throw new Error("Passkey unavailable");
      const ceremony = kind === "registration"
        ? await post<Ceremony<PublicKeyCredentialCreationOptionsJSON>>("registration/options")
        : await post<Ceremony<PublicKeyCredentialRequestOptionsJSON>>("authentication/options");
      const response = kind === "registration"
        ? await startRegistration({ optionsJSON: ceremony.options as PublicKeyCredentialCreationOptionsJSON })
        : await startAuthentication({ optionsJSON: ceremony.options as PublicKeyCredentialRequestOptionsJSON });
      const account = await post<Account>(kind + "/verify", {
        ceremonyId: ceremony.ceremonyId, response,
      });
      setMachines(null);
      setAccountId(account.accountId);
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "Passkey unavailable" ? t.unavailable : t.failed);
    } finally { setBusy(false); }
  }

  async function exit(remove: boolean) {
    if (remove && !window.confirm(t.confirmDelete)) return;
    setBusy(true);
    setError(null);
    try {
      if (remove) {
        const response = await fetch(base + "me", { method: "DELETE", credentials: "same-origin" });
        if (!response.ok) throw new Error("Delete failed");
      } else await post("logout");
      setMachines(null);
      setAccountId(null);
    } catch { setError(t.failed); }
    finally { setBusy(false); }
  }

  return <div className="account-page">
    <SiteHeader locale={locale} languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
    <main className="account-main"><section className="account-card">
      <h1>{t.title}</h1>
      <p>{t.lead}</p>
      {accountId === undefined ? <p role="status">…</p> : accountId ? <>
        <dl><dt>{t.account}</dt><dd>{accountId}</dd></dl>
        <h2>{t.computers}</h2>
        {machines === null ? <p role="status">{t.loading}</p> : machines.length === 0
          ? <p className="account-boundary">{t.none}</p>
          : <ul className="account-machines">{machines.map(machine => <li key={machine.id}>
            <span>{machine.name}</span>
            <button type="button" disabled={busy} aria-label={`${t.disconnect} ${machine.name}`}
              onClick={() => void disconnect(machine)}>{t.disconnect}</button>
          </li>)}</ul>}
        <p className="account-boundary">{t.noComputer}</p>
        <div className="account-actions">
          <button type="button" disabled={busy} onClick={() => void exit(false)}>{t.signOut}</button>
          <button type="button" disabled={busy} onClick={() => void exit(true)}>{t.delete}</button>
        </div>
      </> : <>
        <div className="account-actions">
          <button type="button" disabled={busy} onClick={() => void enter("authentication")}>{t.signIn}</button>
          <button type="button" disabled={busy} onClick={() => void enter("registration")}>{t.create}</button>
        </div>
        <p className="account-note">{t.createNote}</p>
      </>}
      {error && <p role="alert" className="account-error">{error}</p>}
    </section></main>
    <SiteFooter locale={locale} />
  </div>;
}

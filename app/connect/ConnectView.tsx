"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { startAuthentication } from "@simplewebauthn/browser";
import type { PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { LanguageToggle, useLocale } from "../components/Locale";

type Provider = { id: "codex" | "claude" | "cursor"; installed: boolean; ready: boolean };
type Snapshot = {
  clientName: string;
  paired: boolean;
  passkeyCapable?: boolean;
  phones: Array<{ name: string; status: string }>;
  providers: Provider[];
  decision?: "approve" | "deny" | "passkey";
  redirectUrl?: string;
  error?: string;
};

const COPY = {
  en: {
    home: "Home",
    eyebrow: "GrantTap authorization",
    title: "Connect your coding app",
    lead: "Approve with a phone QR or a GrantTap passkey on this Mac. QR pairing works without an account.",
    missing: "This request is not on GrantTap yet.",
    missingBody: "Start authorization again from your coding app. Open this page on the Mac running GrantTap to manage devices.",
    unpaired: "This computer is not paired yet.",
    unpairedBody: "Open the GrantTap connection card in your coding app and choose Add a device. Scan its one-time QR in GrantTap on the phone.",
    phones: "Devices in this room",
    phonesBody: "These are phone observations from this computer. Use Add another device to pair a second controller or Reconnect to repair the same phone.",
    phonesEmpty: "No phone is listed for this computer. Use Add a device in the GrantTap connection card and scan its one-time QR on iPhone.",
    phonePaired: "Paired",
    phoneSeen: "Online just now",
    paired: "A phone is already connected",
    pairedBody: "You can approve this coding app without changing your existing connection.",
    apps: "Coding apps on this computer",
    ready: "Ready",
    installed: "Installed",
    missingApp: "Not installed",
    approve: "Approve",
    macPasskey: "Use passkey on this Mac",
    passkeyNote: "A GrantTap account passkey authorizes this coding app on this Mac. It does not pair a phone. Create a passkey account first if you do not have one.",
    passkeyFailed: "Passkey approval failed. Check the account passkey and try again.",
    createAccount: "Create a passkey account",
    deny: "Deny",
    waiting: "Waiting for this computer…",
    retry: "This computer has not finished authorization. Tap Approve again.",
    failed: "The coding app could not finish authorization.",
  },
  ru: {
    home: "Главная",
    eyebrow: "Авторизация GrantTap",
    title: "Подключите coding app",
    lead: "Подтвердите через QR телефона или passkey GrantTap на этом Mac. Для QR аккаунт не нужен.",
    missing: "Этого запроса ещё нет на GrantTap.",
    missingBody: "Запустите авторизацию снова из coding app. Для управления устройствами откройте страницу на Mac с запущенным GrantTap.",
    unpaired: "Этот компьютер ещё не сопряжён.",
    unpairedBody: "Откройте панель GrantTap в coding app, выберите Add a device и отсканируйте её одноразовый QR приложением на телефоне.",
    phones: "Устройства в этой комнате",
    phonesBody: "Это сведения компьютера о телефонах. Add another device добавляет второй контроллер, Reconnect восстанавливает тот же телефон.",
    phonesEmpty: "Для этого компьютера телефон не указан. Используйте Add a device в панели GrantTap и отсканируйте одноразовый QR на iPhone.",
    phonePaired: "Сопряжён",
    phoneSeen: "Сейчас онлайн",
    paired: "Телефон уже подключён",
    pairedBody: "Можно подтвердить этот coding app, не меняя текущее соединение.",
    apps: "Coding apps на этом компьютере",
    ready: "Готов",
    installed: "Установлен",
    missingApp: "Не установлен",
    approve: "Подтвердить",
    macPasskey: "Войти по passkey на этом Mac",
    passkeyNote: "Passkey аккаунта GrantTap разрешает этой coding app доступ к MCP на данном Mac, но не подключает телефон. Если аккаунта ещё нет, сначала создайте его.",
    passkeyFailed: "Не удалось подтвердить passkey. Проверьте ключ аккаунта и попробуйте снова.",
    createAccount: "Создать аккаунт с passkey",
    deny: "Отклонить",
    waiting: "Ждём этот компьютер…",
    retry: "Этот компьютер не закончил авторизацию. Нажмите Approve ещё раз.",
    failed: "Coding app не смог завершить авторизацию.",
  },
} as const;

const LABELS: Record<Provider["id"], string> = {
  cursor: "Cursor",
  claude: "Claude Code",
  codex: "Codex",
};

function requestId(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.hash.replace(/^#/, "")).get("request") ?? "";
}

export function ConnectView() {
  const { locale, setLocale } = useLocale();
  const t = COPY[locale];
  const [id, setId] = useState("");
  const [row, setRow] = useState<Snapshot | null>(null);
  const [busy, setBusy] = useState(false);
  const [missing, setMissing] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState("");
  const [passkeyError, setPasskeyError] = useState(false);

  useEffect(() => {
    const next = requestId();
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setId(next);
      if (!next) setMissing(true);
    });
    if (!next) return () => { cancelled = true; };
    const tick = async () => {
      const response = await fetch(`/api/connect/requests/${next}`, { cache: "no-store" });
      if (cancelled) return;
      if (response.status === 404) {
        setMissing(true);
        setRow(null);
        return;
      }
      if (!response.ok) return;
      const body = await response.json() as Snapshot;
      setMissing(false);
      setRow(body);
      setSelectedPhone((current) => {
        const names = body.phones.map((phone) => phone.name);
        if (current && names.includes(current)) return current;
        return names.length === 1 ? names[0] : "";
      });
      if (body.redirectUrl) window.location.assign(body.redirectUrl);
    };
    void tick();
    const timer = window.setInterval(() => { void tick(); }, 3000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  async function decide(decision: "approve" | "deny") {
    if (!id || busy) return;
    if (decision === "approve" && !selectedPhone) return;
    setBusy(true);
    await fetch(`/api/connect/requests/${id}/decision`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ decision, phone: selectedPhone || undefined }),
    });
    setBusy(false);
  }

  async function approveWithPasskey() {
    if (!id || busy) return;
    setBusy(true);
    setPasskeyError(false);
    try {
      if (!window.PublicKeyCredential) throw new Error("Passkey unavailable");
      const optionsResponse = await fetch("/api/account/authentication/options", {
        method: "POST", headers: { "content-type": "application/json" }, body: "{}",
      });
      if (!optionsResponse.ok) throw new Error("Options unavailable");
      const ceremony = await optionsResponse.json() as {
        ceremonyId: string; options: PublicKeyCredentialRequestOptionsJSON;
      };
      const response = await startAuthentication({ optionsJSON: ceremony.options });
      const approval = await fetch(`/api/connect/requests/${id}/passkey`, {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ceremonyId: ceremony.ceremonyId, response }),
      });
      if (!approval.ok) throw new Error("Approval failed");
    } catch { setPasskeyError(true); }
    finally { setBusy(false); }
  }

  return (
    <div className="connect-page">
      <header className="connect-header">
        <Link className="connect-brand" href="/">
          <img src="/favicon.png" alt="" width={28} height={28} />
          GrantTap
        </Link>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link href="/">{t.home}</Link>
          <LanguageToggle locale={locale} setLocale={setLocale} />
        </div>
      </header>
      <main className="connect-main">
        <section className="connect-card">
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="lead">{t.lead}</p>
          {missing && (
            <div className="connect-panel">
              <h2>{t.missing}</h2>
              <p>{t.missingBody}</p>
            </div>
          )}
          {row?.error && (
            <div className="connect-panel">
              <h2>{t.failed}</h2>
              <p>{row.error}</p>
            </div>
          )}
          {row && (
            <>
              <span className="connect-chip">{row.clientName}</span>
              <div className="connect-panel ok">
                <h2>{t.phones}</h2>
                {row.phones.length > 0 && <p>{t.phonesBody}</p>}
                {row.phones.length === 0 && <p>{t.phonesEmpty}</p>}
                {row.phones.length > 0 && (
                  <div className="connect-phones">
                    {row.phones.map((phone) => (
                      <button
                        key={phone.name}
                        type="button"
                        className={`connect-phone${phone.status === "seen" ? " seen" : ""}${selectedPhone === phone.name ? " selected" : ""}`}
                        disabled={busy || Boolean(row.decision)}
                        onClick={() => setSelectedPhone(phone.name)}
                      >
                        <i />
                        <span>{phone.name}</span>
                        <em>{phone.status === "seen" ? t.phoneSeen : t.phonePaired}</em>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="connect-panel ok">
                <h2>{t.apps}</h2>
                <div className="connect-apps">
                  {row.providers.map((provider) => (
                    <span key={provider.id} className={`connect-app ${provider.ready ? "ready" : ""}`}>
                      <i />
                      {LABELS[provider.id]} · {provider.ready ? t.ready : provider.installed ? t.installed : t.missingApp}
                    </span>
                  ))}
                </div>
              </div>
              {row.decision && !row.redirectUrl && !row.error && (
                <p className="lead">{busy ? t.waiting : t.retry}</p>
              )}
              <div className="connect-actions">
                <button className="primary" type="button" disabled={busy || Boolean(row.redirectUrl) || !selectedPhone} onClick={() => void decide("approve")}>
                  {t.approve}
                </button>
                <button className="ghost" type="button" disabled={busy || Boolean(row.redirectUrl)} onClick={() => void decide("deny")}>
                  {t.deny}
                </button>
              </div>
              {row.passkeyCapable && !row.decision && <div className="connect-passkey">
                <button type="button" disabled={busy} onClick={() => void approveWithPasskey()}>{t.macPasskey}</button>
                <p>{t.passkeyNote} <Link href="/account" target="_blank" rel="noopener noreferrer">{t.createAccount}</Link></p>
                {passkeyError && <p role="alert">{t.passkeyFailed}</p>}
              </div>}
            </>
          )}
        </section>
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { LanguageToggle, useLocale } from "../components/Locale";

type Provider = { id: "codex" | "claude" | "cursor"; installed: boolean; ready: boolean };
type Snapshot = {
  clientName: string;
  paired: boolean;
  phones: Array<{ name: string; status: string }>;
  providers: Provider[];
  decision?: "approve" | "deny";
  redirectUrl?: string;
  error?: string;
};

const COPY = {
  en: {
    home: "Home",
    eyebrow: "GrantTap authorization",
    title: "Connect your coding app",
    lead: "GrantTap is asking to send approvals and activity from this coding app to your phone.",
    missing: "This request is not on GrantTap yet.",
    missingBody: "Start authorization again from your coding app. The website never talks to localhost.",
    unpaired: "This computer is not paired yet.",
    unpairedBody: "Scan the QR in the GrantTap plugin or the iPhone app, then approve here.",
    phones: "Choose a phone",
    phonesBody: "Approvals from this coding app go to the phone you select.",
    phonesEmpty: "No phone is listed for this computer yet. Add one in the GrantTap plugin, then start authorization again.",
    phonePaired: "Paired",
    phoneSeen: "Online just now",
    paired: "A phone is already connected",
    pairedBody: "You can approve this coding app without changing your existing connection.",
    apps: "Coding apps on this computer",
    ready: "Ready",
    installed: "Installed",
    missingApp: "Not installed",
    approve: "Approve",
    deny: "Deny",
    waiting: "Waiting for this computer…",
    failed: "The coding app could not finish authorization.",
  },
  ru: {
    home: "Главная",
    eyebrow: "Авторизация GrantTap",
    title: "Подключите coding app",
    lead: "GrantTap просит отправлять approvals и активность этого coding app на телефон.",
    missing: "Этого запроса ещё нет на GrantTap.",
    missingBody: "Запустите авторизацию снова из coding app. Сайт не ходит на localhost.",
    unpaired: "Этот компьютер ещё не сопряжён.",
    unpairedBody: "Отсканируйте QR в плагине GrantTap или в приложении на iPhone, затем подтвердите здесь.",
    phones: "Выберите телефон",
    phonesBody: "Подтверждения из этого coding app пойдут на выбранный телефон.",
    phonesEmpty: "Для этого компьютера телефон ещё не указан. Добавьте его в плагине GrantTap и запустите авторизацию снова.",
    phonePaired: "Сопряжён",
    phoneSeen: "Сейчас онлайн",
    paired: "Телефон уже подключён",
    pairedBody: "Можно подтвердить этот coding app, не меняя текущее соединение.",
    apps: "Coding apps на этом компьютере",
    ready: "Готов",
    installed: "Установлен",
    missingApp: "Не установлен",
    approve: "Подтвердить",
    deny: "Отклонить",
    waiting: "Ждём этот компьютер…",
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

  useEffect(() => {
    const next = requestId();
    setId(next);
    if (!next) {
      setMissing(true);
      return;
    }
    let cancelled = false;
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
    const timer = window.setInterval(() => { void tick(); }, 1000);
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

  return (
    <div className="connect-page">
      <header className="connect-header">
        <a className="connect-brand" href="/">
          <img src="/favicon.png" alt="" width={28} height={28} />
          GrantTap
        </a>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a href="/">{t.home}</a>
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
              {row.decision && !row.redirectUrl && !row.error && <p className="lead">{t.waiting}</p>}
              <div className="connect-actions">
                <button className="primary" type="button" disabled={busy || Boolean(row.decision) || !selectedPhone} onClick={() => void decide("approve")}>
                  {t.approve}
                </button>
                <button className="ghost" type="button" disabled={busy || Boolean(row.decision)} onClick={() => void decide("deny")}>
                  {t.deny}
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}

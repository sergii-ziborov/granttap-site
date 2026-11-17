"use client";
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import type { PublicKeyCredentialCreationOptionsJSON, PublicKeyCredentialRequestOptionsJSON } from "@simplewebauthn/browser";
import { useEffect, useState } from "react";
import { LanguageToggle, useLocale } from "../components/Locale";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { accountApi } from "./client";
import { accountCopy } from "./copy";
import type { KeyResult } from "./PhoneSignIn";
import { accountReturnPath } from "./return-path";
import { SignedInAccount } from "./SignedInAccount";
import { SignInMethods } from "./SignInMethods";

type Ceremony<T> = { ceremonyId: string; options: T };
type Account = { accountId: string };

async function post<T>(path: string, body?: unknown): Promise<T> {
  const result = await accountApi<T>(path, { method: "POST", body: body ?? {} });
  if (!result.ok) throw new Error(`Account request: ${result.status}`);
  return result.body;
}

/** Signed-out choices (passkey, iPhone QR, password, sign-in token) or the signed-in account area. */
export function AccountView() {
  const { locale, setLocale } = useLocale();
  const t = accountCopy[locale];
  const [accountId, setAccountId] = useState<string | null>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string>();

  useEffect(() => {
    let active = true;
    void accountApi<Account>("me")
      .then(result => { if (active) {
        const account = result.ok ? result.body?.accountId ?? null : null;
        setAccountId(account);
        const destination = account && accountReturnPath(window.location.search);
        if (destination) window.location.assign(destination);
      } })
      .catch(() => { if (active) setAccountId(null); });
    return () => { active = false; };
  }, []);

  function signedIn(id: string, key: KeyResult = "none") {
    setError(null); setNotice(key === "failed" ? t.keyNotSaved : undefined); setAccountId(id);
    const destination = accountReturnPath(window.location.search);
    if (destination) window.location.assign(destination);
  }

  async function enter(kind: "registration" | "authentication", crossDevice = false) {
    setBusy(true);
    setError(null);
    try {
      if (!window.PublicKeyCredential) throw new Error("Passkey unavailable");
      const ceremony = kind === "registration"
        ? await post<Ceremony<PublicKeyCredentialCreationOptionsJSON>>("registration/options")
        : await post<Ceremony<PublicKeyCredentialRequestOptionsJSON>>("authentication/options");
      const response = kind === "registration"
        ? await startRegistration({ optionsJSON: ceremony.options as PublicKeyCredentialCreationOptionsJSON })
        : await startAuthentication({ optionsJSON: crossDevice
          ? { ...ceremony.options as PublicKeyCredentialRequestOptionsJSON, hints: ["hybrid"] }
          : ceremony.options as PublicKeyCredentialRequestOptionsJSON });
      const account = await post<Account>(kind + "/verify", { ceremonyId: ceremony.ceremonyId, response });
      signedIn(account.accountId);
    } catch (cause) {
      setError(cause instanceof Error && cause.message === "Passkey unavailable" ? t.unavailable : t.failed);
    } finally { setBusy(false); }
  }

  return <div className="account-page">
    <SiteHeader locale={locale} languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
    <main className={"account-main " + (accountId ? "signed-in" : "signed-out")}>
      {accountId === undefined ? <p role="status" className="account-note">{t.loading}</p> : accountId
        ? <SignedInAccount key={accountId} locale={locale} accountId={accountId} notice={notice}
          onSignedOut={() => { setNotice(undefined); setAccountId(null); }} />
        : <div className="account-signin-layout">
          <section className="account-card" aria-labelledby="account-signin-title">
            <p className="account-kicker">{t.kicker}</p>
            <h1 id="account-signin-title">{t.signInTitle}</h1>
            <p className="account-lead">{t.signInLead}</p>
            <SignInMethods locale={locale} busy={busy} error={error} onBusyChange={setBusy}
              onPasskey={(kind, crossDevice) => void enter(kind, crossDevice)} onSignedIn={signedIn} />
          </section>
          <aside className="account-aside" aria-labelledby="account-aside-title">
            <h2 id="account-aside-title">{t.asideTitle}</h2>
            <ul>{t.aside.map(([title, text]) => <li key={title}><strong>{title}</strong><span>{text}</span></li>)}</ul>
            <a href={locale === "ru" ? "/security?lang=ru" : "/security"}>{t.security}</a>
          </aside>
        </div>}
    </main>
    <SiteFooter locale={locale} />
  </div>;
}

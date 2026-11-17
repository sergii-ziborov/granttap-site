"use client";
import { useEffect, useState, type ReactNode } from "react";
import { accountApi, loadSignedIn, shortDate, type Device, type Summary, type WebKeyStatus } from "./client";
import { ComputerPublishing } from "./ComputerPublishing";
import { ConfirmAction } from "./ConfirmAction";
import { accountCopy } from "./copy";
import { AccountDevices } from "./Devices";
import { EncryptionKey } from "./EncryptionKey";
import { SubscriptionSupport } from "./SubscriptionSupport";

type Loaded = { summary: Summary; devices: Device[]; key: WebKeyStatus };
const ORDER = ["account", "methods", "devices", "key", "subscription", "danger"] as const;

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="account-section" aria-labelledby={id + "-title"}>
    <h2 id={id + "-title"}>{title}</h2>{children}
  </section>;
}

/** The signed-in account: identity, sign-in methods, devices, chat key, subscription and deletion. */
export function SignedInAccount({ locale, accountId, notice, onSignedOut }: { locale: "en" | "ru"; accountId: string;
  notice?: string; onSignedOut: () => void }) {
  const t = accountCopy[locale];
  const [data, setData] = useState<Loaded | null>(null);
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);
  const [copied, setCopied] = useState(false);
  const reload = () => setVersion(value => value + 1);

  useEffect(() => {
    const controller = new AbortController();
    void Promise.all([loadSignedIn<Summary>("summary", controller.signal),
      loadSignedIn<{ devices: Device[] }>("devices", controller.signal),
      loadSignedIn<WebKeyStatus>("web-key", controller.signal)])
      .then(([summary, devices, key]) => { setFailed(false); setData({ summary, devices: devices.devices, key }); })
      .catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [accountId, version]);

  async function signOut() {
    await accountApi("logout", { method: "POST", body: {} });
    onSignedOut();
  }
  async function remove() {
    if ((await accountApi("me", { method: "DELETE" })).ok) onSignedOut();
  }

  if (!data) return <p role={failed ? "alert" : "status"} className={failed ? "account-error" : "account-note"}>{failed ? t.failed : t.loading}</p>;
  const { summary, devices, key } = data;
  const computers = devices.filter(device => device.type === "computer");
  const method = summary.session.signIn ? t.sessionMethods[summary.session.signIn] : null;
  return <>
    <header className="account-head">
      <p className="account-kicker">{t.kicker}</p>
      <h1>{t.title}</h1>
      <p className="account-lead">{method ? t.signedInWith(method) : t.signedIn}</p>
      <div className="account-head-actions">
        <a className="account-link-button primary" href="/control">{t.openControl}</a>
        <button type="button" className="account-secondary" onClick={() => void signOut()}>{t.signOut}</button>
      </div>
      {notice && <p role="alert" className="account-error">{notice}</p>}
    </header>
    <div className="account-layout">
      <nav className="account-nav" aria-label={t.sections}><ul>
        {ORDER.map(id => <li key={id}><a href={"#" + id}>{t.nav[id]}</a></li>)}
      </ul></nav>
      <div className="account-sections">
        <Section id="account" title={t.nav.account}>
          <dl className="account-facts">
            <div><dt>{t.accountId}</dt><dd><code>{summary.accountId}</code>
              <button type="button" className="account-secondary compact" onClick={() => void navigator.clipboard?.writeText(summary.accountId)
                .then(() => setCopied(true)).catch(() => undefined)}>{copied ? t.copied : t.copy}</button>
              <span role="status" className="account-visually-hidden">{copied ? t.copied : ""}</span></dd></div>
            <div><dt>{t.created}</dt><dd>{shortDate(summary.createdAt, locale)}</dd></div>
          </dl>
          <p className="account-note">{t.browserKeys}</p>
        </Section>
        <Section id="methods" title={t.nav.methods}>
          <dl className="account-facts">
            <div><dt>{t.passkeys}</dt><dd>{t.passkeyCount(summary.methods.passkeys)}</dd></div>
            <div><dt>{t.password}</dt><dd>{summary.methods.password ? t.passwordSet(summary.methods.password) : t.passwordNone}</dd></div>
            <div><dt>{t.tokens}</dt><dd>{t.tokenCount(summary.methods.signInTokens)}</dd></div>
          </dl>
          <p className="account-note">{t.methodsNote}</p>
        </Section>
        <Section id="devices" title={t.nav.devices}>
          <AccountDevices locale={locale} devices={devices} onChanged={reload} onSignedOut={onSignedOut} />
        </Section>
        <Section id="key" title={t.nav.key}>
          <EncryptionKey locale={locale} status={key} computers={computers} onChanged={reload} />
        </Section>
        <Section id="subscription" title={t.nav.subscription}>
          {computers.length ? <ComputerPublishing key={accountId} accountId={accountId} locale={locale} busy={false}
            machines={computers.map(device => ({ id: device.id, name: device.name }))} /> : <p className="account-note">{t.noComputers}</p>}
          <SubscriptionSupport key={accountId + ":subscription"} locale={locale} />
        </Section>
        <Section id="danger" title={t.nav.danger}>
          <div className="account-danger-row"><div><h3>{t.deleteTitle}</h3><p className="account-note">
            {summary.session.signIn === "qr" ? t.deleteDelegated : t.deleteLead}</p></div>
            {summary.session.signIn !== "qr" && <ConfirmAction label={t.deleteTitle} question={t.deleteConfirm}
              confirmLabel={t.deleteTitle} cancelLabel={t.cancel} danger onConfirm={remove} />}</div>
        </Section>
      </div>
    </div>
  </>;
}

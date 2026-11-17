"use client";
import { useState } from "react";
import { accountApi, shortDate, type Device, type WebKeyStatus } from "../client";
import { ConfirmAction } from "../ConfirmAction";
import { PhoneSignIn } from "../PhoneSignIn";
import { keyCopy } from "./copy";

/** Says plainly whether the account holds the chat key, what that exposes, and how to add or remove it. */
export function EncryptionKey({ locale, status, computers, onChanged }: { locale: "en" | "ru";
  status: WebKeyStatus; computers: Device[]; onChanged: () => void }) {
  const t = keyCopy[locale];
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState("");

  async function remove() {
    setError("");
    const result = await accountApi("web-key", { method: "DELETE" });
    if (result.ok) onChanged(); else setError(t.failed);
  }

  if (status.stored) return <>
    <p className="account-state stored"><span aria-hidden="true" />{t.stored}</p>
    <p>{t.storedSince(shortDate(status.createdAt, locale), status.storedFrom)}</p>
    <ul className="account-key-computers">{status.computers.map(item => <li key={item.computerId}>
      <strong>{item.name ?? t.removedComputer}</strong> <span>{t.controller(item.recipientKeyId.slice(0, 6))}</span></li>)}</ul>
    <div className="account-warning" role="note"><p><strong>{t.riskTitle}</strong> {t.risk}</p></div>
    <div className="account-row-actions">
      <a className="account-link-button" href="/control">{t.open}</a>
      <ConfirmAction label={t.remove} question={t.confirmRemove} confirmLabel={t.removeConfirm}
        cancelLabel={t.cancel} danger onConfirm={remove} />
    </div>
    <p className="account-note">{t.removeNote}</p>
    {error && <p role="alert" className="account-error">{error}</p>}
  </>;

  const encrypted = computers.filter(device => device.type === "computer");
  return <>
    <p className="account-state"><span aria-hidden="true" />{t.notStored}</p>
    <p>{t.e2e}</p>
    {encrypted.length > 0 && <ul className="account-key-computers" aria-label={t.computersLabel}>{encrypted.map(device => <li key={device.id}>
      <strong>{device.name}</strong> <span>{device.encryptionKeyId ? t.encryptedChats(device.encryptionKeyId.slice(0, 6)) : t.noRoute}</span>
    </li>)}</ul>}
    <p className="account-note">{t.namesNote}</p>
    <div className="account-warning" role="note"><p><strong>{t.beforeTitle}</strong> {t.risk}</p></div>
    {asking ? <PhoneSignIn locale={locale} purpose="key" onDone={(_account, key) => {
      setAsking(false);
      if (key === "stored") onChanged(); else setError(t.notSaved);
    }} /> : <button type="button" className="account-secondary" onClick={() => setAsking(true)}>{t.ask}</button>}
    {error && <p role="alert" className="account-error">{error}</p>}
  </>;
}

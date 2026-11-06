"use client";
import { useState, type FormEvent } from "react";
import { parseSignInKey } from "./sign-in-key";

type Props = { locale: "en" | "ru"; disabled: boolean; onBusyChange: (busy: boolean) => void;
  onSignedIn: (accountId: string) => void };

export function AccountTokenAccess({ locale, disabled, onBusyChange, onSignedIn }: Props) {
  const ru = locale === "ru";
  const [key, setKey] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent) {
    event.preventDefault();
    const secret = parseSignInKey(key);
    if (!secret || !consent || busy || disabled) return;
    setBusy(true); onBusyChange(true); setError("");
    try {
      const response = await fetch("/api/account/browser-token/redeem", { method: "POST",
        credentials: "same-origin", headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret }) });
      if (!response.ok) throw new Error();
      const value = await response.json();
      if (typeof value.accountId !== "string"
        || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value.accountId)) throw new Error();
      setKey(""); onSignedIn(value.accountId);
    } catch {
      setKey("");
      setError(ru ? "Не удалось войти. Проверьте срок и число использований ключа или повторите позже."
        : "Sign-in failed. Check the key's expiry and remaining uses, or retry later.");
    } finally { setBusy(false); onBusyChange(false); }
  }
  return <details className="account-token-access"><summary>{ru ? "Войти по ключу или ссылке из QR" : "Sign in with a key or QR link"}</summary>
    <p>{ru ? "Создайте временный ключ в приложении: Устройства → Аккаунт → Ключи входа. Вставьте ключ или ссылку из его QR."
      : "Create a temporary sign-in key in the app: Devices → Account → Sign-in tokens. Paste the key or its QR link."}</p>
    <form onSubmit={event => void submit(event)} aria-busy={busy}>
      <fieldset disabled={busy || disabled}><legend>{ru ? "Временный вход" : "Temporary sign-in"}</legend>
        <label>{ru ? "Ключ входа" : "Sign-in key"}<input type="password" autoComplete="off" autoCapitalize="none"
          spellCheck={false} maxLength={256} value={key} onChange={event => setKey(event.target.value)} /></label>
        <label className="account-token-consent"><input type="checkbox" checked={consent}
          onChange={event => setConsent(event.target.checked)} />{ru
            ? "Я понимаю: код сайта может читать сообщения, расшифрованные в браузере, и мой ввод."
            : "I understand that website code can access messages decrypted in this browser and what I type."}</label>
        <button type="submit" disabled={!consent || !parseSignInKey(key)}>{busy ? (ru ? "Входим…" : "Signing in…")
          : (ru ? "Войти по ключу" : "Sign in with key")}</button>
      </fieldset>
      {error && <p role="alert">{error}</p>}
    </form>
  </details>;
}

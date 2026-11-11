"use client";
import { useId, useState, type FormEvent } from "react";
import { parseSignInKey } from "./sign-in-key";

type Props = { locale: "en" | "ru"; disabled: boolean; onBusyChange: (busy: boolean) => void;
  onSignedIn: (accountId: string) => void };

const copy = {
  en: {
    title: "Sign in with a token or QR link",
    steps: "On a signed-in iPhone or iPad, open Devices → Account → Sign-in tokens and create a token. Paste the token or its QR link here.",
    legend: "Temporary sign-in", field: "Sign-in token",
    invalid: "Paste a token that starts with gt_login_ or its granttap.com sign-in link.",
    consent: "I understand that website code can access messages decrypted in this browser and what I type.",
    submit: "Sign in with token", busy: "Signing in…",
    failed: "Sign-in failed. Check the token's expiry and remaining uses, or retry later.",
  },
  ru: {
    title: "Войти по токену или ссылке из QR",
    steps: "На iPhone или iPad, где вы уже вошли, откройте Устройства → Аккаунт → Токены входа и создайте токен. Вставьте сюда токен или ссылку из его QR.",
    legend: "Временный вход", field: "Токен входа",
    invalid: "Вставьте токен, начинающийся с gt_login_, или его ссылку входа granttap.com.",
    consent: "Я понимаю: код сайта может читать сообщения, расшифрованные в браузере, и мой ввод.",
    submit: "Войти по токену", busy: "Входим…",
    failed: "Не удалось войти. Проверьте срок и число использований токена или повторите позже.",
  },
} as const;

export function AccountTokenAccess({ locale, disabled, onBusyChange, onSignedIn }: Props) {
  const t = copy[locale];
  const id = useId();
  const [key, setKey] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const invalid = key.trim() !== "" && !parseSignInKey(key);
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
      setError(t.failed);
    } finally { setBusy(false); onBusyChange(false); }
  }
  return <section className="account-token-access" aria-labelledby={id + "-title"}>
    <h3 id={id + "-title"}>{t.title}</h3>
    <p>{t.steps}</p>
    <form onSubmit={event => void submit(event)} aria-busy={busy}>
      <fieldset disabled={busy || disabled}><legend>{t.legend}</legend>
        <div className={"account-field" + (invalid ? " invalid" : "")}>
          <label htmlFor={id + "-token"}>{t.field}</label>
          <input id={id + "-token"} type="password" autoComplete="off" autoCapitalize="none" autoCorrect="off"
            spellCheck={false} maxLength={256} value={key} aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? id + "-token-note" : undefined}
            onChange={event => { setKey(event.target.value); setError(""); }} />
          {invalid && <p id={id + "-token-note"} className="account-field-error">{t.invalid}</p>}
        </div>
        <label className="account-token-consent"><input type="checkbox" checked={consent}
          onChange={event => setConsent(event.target.checked)} />{t.consent}</label>
        {error && <p role="alert" className="account-error">{error}</p>}
        <button type="submit" className="account-submit" disabled={!consent || !parseSignInKey(key) || busy}>
          {busy && <span className="account-spinner" aria-hidden="true" />}{busy ? t.busy : t.submit}
        </button>
      </fieldset>
    </form>
  </section>;
}

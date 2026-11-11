"use client";
import { useId, useState } from "react";
import { AccountPassword } from "../AccountPassword";
import { AccountTokenAccess } from "../AccountTokenAccess";

type Method = "passkey" | "qr" | "password";
type Props = { locale: "en" | "ru"; busy: boolean; error?: string | null;
  onPasskey: (kind: "registration" | "authentication", crossDevice: boolean) => void;
  onBusyChange: (busy: boolean) => void; onSignedIn: (accountId: string) => void };

const copy = {
  en: {
    group: "Sign-in method", recommended: "Recommended",
    methods: { passkey: "Passkey", qr: "QR code", password: "Password" },
    passkeyLead: "Face ID, Touch ID or your password manager. Nothing to remember or type.",
    signIn: "Sign in with passkey", create: "Create account with passkey",
    createNote: "Already have an account? Sign in first. Creating another account will not find your existing computers.",
    qrLead: "Keep your passkey on your iPhone. The browser shows a QR code; scan it with the iPhone camera to sign in here.",
    qrButton: "Show a QR for my phone",
    qrNote: "If the browser offers several options, choose a phone or tablet.",
  },
  ru: {
    group: "Способ входа", recommended: "Рекомендуем",
    methods: { passkey: "Passkey", qr: "QR-код", password: "Пароль" },
    passkeyLead: "Face ID, Touch ID или ваш менеджер паролей. Ничего не нужно запоминать и вводить.",
    signIn: "Войти через passkey", create: "Создать аккаунт с passkey",
    createNote: "Уже есть аккаунт? Сначала войдите. Новый аккаунт не найдёт ваши прежние компьютеры.",
    qrLead: "Passkey остаётся на iPhone. Браузер покажет QR-код; отсканируйте его камерой iPhone, чтобы войти здесь.",
    qrButton: "Показать QR для телефона",
    qrNote: "Если браузер предложит несколько вариантов, выберите телефон или планшет.",
  },
} as const;

/** One explicit choice between the three account sign-in methods; passkey is the default. */
export function SignInMethods({ locale, busy, error, onPasskey, onBusyChange, onSignedIn }: Props) {
  const t = copy[locale];
  const id = useId();
  const [method, setMethod] = useState<Method>("passkey");
  const methods: Method[] = ["passkey", "qr", "password"];
  const problem = error && method !== "password" ? <p role="alert" className="account-error">{error}</p> : null;
  return <div className="account-methods">
    <fieldset className="account-method-choice" disabled={busy}>
      <legend>{t.group}</legend>
      <div role="radiogroup" aria-label={t.group}>
        {methods.map(value => <label key={value} className={"account-method " + value}>
          <input type="radio" name={id + "-method"} checked={method === value} disabled={busy}
            onChange={() => setMethod(value)} />
          <span>{t.methods[value]}</span>{value === "passkey" && <> <small>{t.recommended}</small></>}
        </label>)}
      </div>
    </fieldset>
    {method === "passkey" && <section className="account-method-panel" aria-label={t.methods.passkey}>
      <p>{t.passkeyLead}</p>
      <button type="button" className="account-submit" disabled={busy}
        onClick={() => onPasskey("authentication", false)}>{t.signIn}</button>
      {problem}
      <button type="button" className="account-quiet" disabled={busy}
        onClick={() => onPasskey("registration", false)}>{t.create}</button>
      <p className="account-note">{t.createNote}</p>
    </section>}
    {method === "qr" && <section className="account-method-panel" aria-label={t.methods.qr}>
      <p>{t.qrLead}</p>
      <button type="button" className="account-submit" disabled={busy}
        onClick={() => onPasskey("authentication", true)}>{t.qrButton}</button>
      {problem}
      <p className="account-note">{t.qrNote}</p>
      <AccountTokenAccess locale={locale} disabled={busy} onBusyChange={onBusyChange} onSignedIn={onSignedIn} />
    </section>}
    {method === "password" && <section className="account-method-panel" aria-label={t.methods.password}>
      <AccountPassword locale={locale} disabled={busy} onBusyChange={onBusyChange} onSignedIn={onSignedIn} />
    </section>}
  </div>;
}

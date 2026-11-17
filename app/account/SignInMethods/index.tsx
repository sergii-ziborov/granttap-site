"use client";
import { useId, useState } from "react";
import { AccountPassword } from "../AccountPassword";
import { AccountTokenAccess } from "../AccountTokenAccess";
import { PhoneSignIn, type KeyResult } from "../PhoneSignIn";

type Method = "passkey" | "phone" | "password" | "token";
type Props = { locale: "en" | "ru"; busy: boolean; error?: string | null;
  onPasskey: (kind: "registration" | "authentication", crossDevice: boolean) => void;
  onBusyChange: (busy: boolean) => void; onSignedIn: (accountId: string, key?: KeyResult) => void };

const copy = {
  en: {
    group: "Sign-in method", recommended: "Recommended",
    methods: { passkey: "Passkey", phone: "iPhone QR", password: "Password", token: "Sign-in token" },
    passkeyLead: "Face ID, Touch ID or your password manager. Nothing to remember or type.",
    signIn: "Sign in with passkey", hybrid: "Use a passkey from another device",
    create: "Create account with passkey",
    createNote: "Already have an account? Sign in instead. A new account won't see your existing computers.",
  },
  ru: {
    group: "Способ входа", recommended: "Рекомендуем",
    methods: { passkey: "Passkey", phone: "QR для iPhone", password: "Пароль", token: "Токен входа" },
    passkeyLead: "Face ID, Touch ID или ваш менеджер паролей. Ничего не нужно запоминать и вводить.",
    signIn: "Войти через passkey", hybrid: "Passkey с другого устройства",
    create: "Создать аккаунт с passkey",
    createNote: "Уже есть аккаунт? Просто войдите. Новый аккаунт не увидит ваши прежние компьютеры.",
  },
} as const;

/** One explicit choice between the account's four ways in; passkey stays the default. */
export function SignInMethods({ locale, busy, error, onPasskey, onBusyChange, onSignedIn }: Props) {
  const t = copy[locale];
  const id = useId();
  const [method, setMethod] = useState<Method>("passkey");
  const methods: Method[] = ["passkey", "phone", "password", "token"];
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
      {error && <p role="alert" className="account-error">{error}</p>}
      <button type="button" className="account-secondary" disabled={busy}
        onClick={() => onPasskey("authentication", true)}>{t.hybrid}</button>
      <button type="button" className="account-quiet" disabled={busy}
        onClick={() => onPasskey("registration", false)}>{t.create}</button>
      <p className="account-note">{t.createNote}</p>
    </section>}
    {method === "phone" && <section className="account-method-panel" aria-label={t.methods.phone}>
      <PhoneSignIn locale={locale} purpose="sign-in" onDone={(accountId, key) => onSignedIn(accountId, key)} />
    </section>}
    {method === "password" && <section className="account-method-panel" aria-label={t.methods.password}>
      <AccountPassword locale={locale} disabled={busy} onBusyChange={onBusyChange} onSignedIn={onSignedIn} />
    </section>}
    {method === "token" && <section className="account-method-panel" aria-label={t.methods.token}>
      <AccountTokenAccess locale={locale} disabled={busy} onBusyChange={onBusyChange} onSignedIn={onSignedIn} />
    </section>}
  </div>;
}

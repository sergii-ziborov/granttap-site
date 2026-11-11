"use client";
import { cloneElement, useId, useState, type FormEvent, type InputHTMLAttributes, type ReactElement } from "react";
import { passwordCopy, type PasswordCopy } from "./copy";

type Props = { locale: "en" | "ru"; onSignedIn: (accountId: string) => void;
  onBusyChange: (value: boolean) => void; disabled?: boolean };
type Feedback = { message: string; field?: "login" };
class PasswordFeedback extends Error {
  constructor(message: string, readonly field?: "login") { super(message); }
}
const accountPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function failure(status: number, t: PasswordCopy): PasswordFeedback {
  if (status === 401) return new PasswordFeedback(t.incorrect);
  if (status === 409) return new PasswordFeedback(t.unavailableLogin, "login");
  if (status === 429) return new PasswordFeedback(t.rateLimited);
  return new PasswordFeedback(t.unavailable);
}

export function AccountPassword({ locale, onSignedIn, onBusyChange, disabled = false }: Props) {
  const t = passwordCopy[locale];
  const id = useId();
  const [register, setRegister] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [left, setLeft] = useState({ login: false, password: false, confirmation: false });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const normalized = login.trim().toLowerCase();
  const length = Array.from(password.normalize("NFC")).length;
  const loginValid = /^[a-z0-9][a-z0-9._-]{2,63}$/.test(normalized);
  const passwordValid = length > 0 && length <= 128 && (!register || length >= 15);
  const valid = loginValid && passwordValid && (!register || password === confirmation);
  const loginProblem = feedback?.field === "login" ? feedback.message
    : left.login && normalized !== "" && !loginValid ? t.loginRule : "";
  const passwordProblem = register && left.password && password !== "" && !passwordValid;
  const confirmationProblem = register && left.confirmation && confirmation !== "" && confirmation !== password
    ? t.mismatch : "";
  const formProblem = feedback && !feedback.field ? feedback.message : "";

  function edit(apply: () => void) { apply(); setFeedback(null); }
  function switchMode(next: boolean) {
    setRegister(next); setPassword(""); setConfirmation(""); setFeedback(null);
    setLeft({ login: left.login, password: false, confirmation: false });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!valid || busy || disabled) return;
    setBusy(true); onBusyChange(true); setFeedback(null);
    try {
      const response = await fetch("/api/account/password/" + (register ? "register" : "sign-in"), {
        method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" },
        body: JSON.stringify({ login: normalized, password }) });
      if (!response.ok) throw failure(response.status, t);
      const body = await response.json();
      if (!body || typeof body.accountId !== "string" || !accountPattern.test(body.accountId)) {
        throw new PasswordFeedback(t.unconfirmed);
      }
      setPassword(""); setConfirmation(""); onSignedIn(body.accountId);
    } catch (cause) {
      setFeedback(cause instanceof PasswordFeedback ? { message: cause.message, field: cause.field }
        : { message: t.unavailable });
    } finally { setBusy(false); onBusyChange(false); }
  }

  const progress = register ? t.creating : t.signingIn;
  return <form className="account-password-form" onSubmit={event => void submit(event)} aria-busy={busy} noValidate>
    <h2>{register ? t.createTitle : t.signInTitle}</h2>
    <fieldset disabled={busy || disabled}>
      <legend>{t.account}</legend>
      <div className="account-segmented" role="radiogroup" aria-label={t.mode}>
        {[false, true].map(value => <label key={String(value)}>
          <input type="radio" name={id + "-mode"} checked={register === value} disabled={busy || disabled}
            onChange={() => switchMode(value)} />
          <span>{value ? t.create : t.signIn}</span>
        </label>)}
      </div>
      <Field id={id + "-login"} label={t.login} problem={loginProblem} announce={feedback?.field === "login"}>
        <input id={id + "-login"} name="username" autoComplete="username" autoCapitalize="none" autoCorrect="off"
          spellCheck={false} required maxLength={64} value={login}
          onChange={event => edit(() => setLogin(event.target.value))}
          onBlur={() => setLeft({ ...left, login: true })} />
      </Field>
      <Field id={id + "-password"} label={t.password} problem={passwordProblem ? t.passwordRule : ""}
        hint={register && !passwordProblem ? t.passwordRule : ""}>
        <input id={id + "-password"} name="password" type="password" required maxLength={256} value={password}
          autoComplete={register ? "new-password" : "current-password"}
          onChange={event => edit(() => setPassword(event.target.value))}
          onBlur={() => setLeft({ ...left, password: true })} />
      </Field>
      {register && <Field id={id + "-confirmation"} label={t.confirmation} problem={confirmationProblem}>
        <input id={id + "-confirmation"} name="confirm-password" type="password" autoComplete="new-password"
          required maxLength={256} value={confirmation}
          onChange={event => edit(() => setConfirmation(event.target.value))}
          onBlur={() => setLeft({ ...left, confirmation: true })} />
      </Field>}
      {formProblem && <p role="alert" className="account-error">{formProblem}</p>}
      <button type="submit" className="account-submit" disabled={!valid || busy}>
        {busy && <span className="account-spinner" aria-hidden="true" />}
        {busy ? progress : register ? t.create : t.signIn}
      </button>
    </fieldset>
    <p role="status" className="account-visually-hidden">{busy ? progress : ""}</p>
    <p className="account-password-boundary">{t.boundary}</p>
  </form>;
}

function Field({ id, label, problem, hint = "", announce = false, children }: { id: string; label: string;
  problem: string; hint?: string; announce?: boolean; children: ReactElement<InputHTMLAttributes<HTMLInputElement>> }) {
  const note = problem || hint;
  return <div className={"account-field" + (problem ? " invalid" : "")}>
    <label htmlFor={id}>{label}</label>
    {cloneElement(children, { "aria-invalid": problem ? true : undefined,
      "aria-describedby": note ? id + "-note" : undefined })}
    {note && <p id={id + "-note"} role={announce ? "alert" : undefined}
      className={problem ? "account-field-error" : "account-field-hint"}>{note}</p>}
  </div>;
}

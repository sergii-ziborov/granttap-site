"use client";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { QrCode } from "../QrCode";
import { phoneCopy } from "./copy";
import { openPhoneRequest, pollPhoneRequest, storeAccountKey, type PhoneRequest, type Purpose } from "./protocol";

export type KeyResult = "stored" | "failed" | "none";
type Stop = "denied" | "expired" | "used" | "limited" | "unavailable";
type View = { phase: "loading" } | { phase: "showing"; request: PhoneRequest; expiresAt: number; scanned: boolean }
  | { phase: "finishing"; storing: boolean } | { phase: "stopped"; reason: Stop };
const AUTO_REFRESHES = 5, POLL_MS = 2_000;

/** Shows a QR that a signed-in iPhone approves; refreshes itself a few times, then waits for a click. */
export function PhoneSignIn({ locale, purpose, onDone }: { locale: "en" | "ru"; purpose: Purpose;
  onDone: (accountId: string, key: KeyResult) => void }) {
  const t = phoneCopy[locale], id = useId();
  const [view, setView] = useState<View>({ phase: "loading" });
  const [now, setNow] = useState(() => Date.now());
  const refreshes = useRef(0), errors = useRef(0), done = useRef(onDone);
  useEffect(() => { done.current = onDone; }, [onDone]);

  const start = useCallback(async () => {
    setView({ phase: "loading" });
    const request = await openPhoneRequest(purpose).catch(() => "unavailable" as const);
    setView(typeof request === "string" ? { phase: "stopped", reason: request }
      : { phase: "showing", request, expiresAt: request.expiresAt, scanned: false });
  }, [purpose]);

  useEffect(() => { const timer = setTimeout(() => void start(), 0); return () => clearTimeout(timer); }, [start]);

  const request = view.phase === "showing" ? view.request : null;
  useEffect(() => {
    if (!request) return;
    let active = true, busy = false;
    const tick = async () => {
      if (busy) return;
      busy = true;
      const state = await pollPhoneRequest(request.secret).catch(() => ({ status: "error" as const, limited: false }));
      busy = false;
      if (!active) return;
      if (state.status === "error") {
        if (state.limited || ++errors.current >= 5) { active = false; setView({ phase: "stopped", reason: state.limited ? "limited" : "unavailable" }); }
        return;
      }
      errors.current = 0;
      if (state.status === "waiting" || state.status === "scanned") {
        setView(current => current.phase === "showing" && current.request === request
          ? { ...current, expiresAt: state.expiresAt, scanned: state.status === "scanned" } : current);
      } else if (state.status === "approved") {
        active = false;
        setView({ phase: "finishing", storing: !!state.keyTransfer });
        const key: KeyResult = state.keyTransfer
          ? await storeAccountKey(state.keyTransfer, request.secretKey, state.accountId).catch(() => false) ? "stored" : "failed" : "none";
        done.current(state.accountId, key);
      } else {
        active = false;
        if (state.status === "expired" && refreshes.current < AUTO_REFRESHES) { refreshes.current++; void start(); }
        else setView({ phase: "stopped", reason: state.status });
      }
    };
    const poll = setInterval(() => void tick(), POLL_MS), clock = setInterval(() => setNow(Date.now()), 1_000);
    return () => { active = false; clearInterval(poll); clearInterval(clock); };
  }, [request, start]);

  const remaining = view.phase === "showing" ? Math.max(0, Math.ceil((view.expiresAt - now) / 1000)) : 0;
  const status = view.phase === "loading" ? t.loading : view.phase === "finishing" ? (view.storing ? t.storing : t.approved)
    : view.phase === "stopped" ? t[view.reason] : view.scanned ? t.scanned : "";
  return <section className="account-phone" aria-labelledby={id + "-title"}>
    <h3 id={id + "-title"}>{t.title[purpose]}</h3>
    <div className="account-phone-body">
      <div className={"account-phone-code" + (view.phase === "showing" && view.scanned ? " scanned" : "")}>
        {view.phase === "showing" ? <QrCode value={view.request.qr} label={t.qrLabel} />
          : <div className="account-qr-placeholder" aria-hidden="true" />}
      </div>
      <div className="account-phone-steps">
        <ol>{t.steps[purpose].map(step => <li key={step}>{step}</li>)}</ol>
        <div className="account-phone-progress">
          <p role="status" className="account-phone-status">{status}</p>
          {view.phase === "showing" && !view.scanned && <p className="account-note" aria-hidden="true">
            {t.refresh(`${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`)}</p>}
        </div>
        <p className="account-note">{t.camera}</p>
        {view.phase === "stopped" && view.reason !== "limited" && <button type="button" className="account-secondary"
          onClick={() => { refreshes.current = 0; errors.current = 0; void start(); }}>{t.newCode}</button>}
      </div>
    </div>
    {purpose === "sign-in" && <p className="account-note">{t.encrypted}</p>}
  </section>;
}

"use client";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

/** A destructive action asks in place, moves focus to the question and returns it on cancel. */
export function ConfirmAction({ label, accessibleLabel, question, confirmLabel, cancelLabel, danger = false, quiet = false,
  disabled = false, onConfirm }: { label: string; accessibleLabel?: string; question: ReactNode; confirmLabel: string;
  cancelLabel: string; danger?: boolean; quiet?: boolean; disabled?: boolean; onConfirm: () => Promise<unknown> | void }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null), confirm = useRef<HTMLButtonElement>(null), wasOpen = useRef(false);
  useEffect(() => {
    if (open) confirm.current?.focus();
    else if (wasOpen.current) trigger.current?.focus();
    wasOpen.current = open;
  }, [open]);
  if (!open) return <button ref={trigger} type="button" className={danger && !quiet ? "account-danger" : "account-secondary"}
    disabled={disabled} aria-label={accessibleLabel} onClick={() => setOpen(true)}>{label}</button>;
  return <div className="account-confirm" role="group" aria-labelledby={id}>
    <p id={id}>{question}</p>
    <div className="account-confirm-actions">
      <button ref={confirm} type="button" className={danger ? "account-danger solid" : "account-submit compact"} disabled={busy}
        onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); setOpen(false); } }}>{confirmLabel}</button>
      <button type="button" className="account-quiet compact" disabled={busy} onClick={() => setOpen(false)}>{cancelLabel}</button>
    </div>
  </div>;
}

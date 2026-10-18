"use client";
import { useEffect, useRef, type ReactNode } from "react";
export function ControlDialog({ title, children, close }: { title: string; children: ReactNode; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { const element = dialog.current; element?.showModal(); return () => element?.close(); }, []);
  return <dialog ref={dialog} className="gt-dialog" onClose={close} onCancel={close}>
    <header><h2>{title}</h2><button onClick={close}>Done</button></header>
    <div className="gt-dialog-body">{children}</div>
  </dialog>;
}

"use client";

import { useEffect, useRef, useState } from "react";
import captures from "../GuideContent/screenshots.json";
import { screenNotes } from "../GuideContent/screenNotes";

export function Capture({ id }: { id: string }) {
  const item = captures.find(value => value.id === id);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); trigger.current?.focus(); };
  }, [open]);
  if (!item) return null;
  return <figure className={`guide-capture ${item.width > item.height ? "wide" : "phone"}`}>
    <button ref={trigger} className="capture-open" onClick={() => setOpen(true)} aria-label={`Увеличить: ${item.title}`}>
      <img src={item.file} alt={item.title} width={item.width} height={item.height} loading="lazy" />
      <span className="guide-capture-zoom" aria-hidden="true">↗ Увеличить</span>
    </button>
    <figcaption><span className="capture-label">Настоящий экран · учебные данные</span>
      <strong>{item.title}</strong><span>{item.caption}</span>
      {screenNotes[id] && <ol className="capture-notes">{screenNotes[id].map(note => <li key={note}>{note}</li>)}</ol>}
      <small>Сборка {item.build} · {item.date} · интерфейс {item.locale.toUpperCase()}</small>
    </figcaption>
    {open && <dialog ref={dialog} className="guide-lightbox" aria-label={item.title}
      onCancel={() => setOpen(false)} onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}>
      <div className="lightbox-toolbar"><span>{item.title}</span>
        <button autoFocus onClick={() => setOpen(false)} aria-label="Закрыть изображение">Закрыть <kbd>Esc</kbd></button>
      </div>
      <img src={item.file} alt={item.title} width={item.width} height={item.height} />
    </dialog>}
  </figure>;
}

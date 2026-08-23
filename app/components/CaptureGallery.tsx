"use client";

import { useEffect, useState } from "react";
import { ProductImage } from "./ProductImage";

type Copy = {
  galleryKicker: string;
  galleryTitle: string;
  phoneCaption: string;
  taskCaption: string;
  usageCaption: string;
  watchCaption: string;
  openCapture: string;
  closeCapture: string;
};

type Capture = {
  alt: string;
  caption: string;
  kind: "phone" | "watch";
  name: string;
  title: string;
};

export function CaptureGallery({ t }: { t: Copy }) {
  const [selected, setSelected] = useState<Capture | null>(null);
  const captures: Capture[] = [
    { name: "iphone-command-center", alt: "GrantTap Now", title: "Now", caption: t.phoneCaption, kind: "phone" },
    { name: "iphone-chat", alt: "GrantTap live task chat", title: "Task", caption: t.taskCaption, kind: "phone" },
    { name: "iphone-mcp-usage", alt: "GrantTap Usage", title: "Usage", caption: t.usageCaption, kind: "phone" },
  ];
  const watch: Capture[] = [
    { name: "apple-watch-inbox", alt: "GrantTap Needs You on Apple Watch", title: "Apple Watch", caption: t.watchCaption, kind: "watch" },
    { name: "apple-watch-approval", alt: "GrantTap decision on Apple Watch", title: "Apple Watch", caption: t.watchCaption, kind: "watch" },
  ];

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelected(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selected]);

  return <section className="gallery-section section-shell">
    <div className="section-heading"><p className="kicker">{t.galleryKicker}</p><h2>{t.galleryTitle}</h2></div>
    <div className="history-gallery">
      {captures.map(capture => <figure key={capture.name}>
        <CaptureButton capture={capture} label={t.openCapture} onOpen={setSelected} />
        <figcaption><strong>{capture.title}</strong>{capture.caption}</figcaption>
      </figure>)}
      <figure className="watch-captures">
        <div className="watch-pair">{watch.map(capture => <CaptureButton capture={capture} label={t.openCapture} onOpen={setSelected} key={capture.name} />)}</div>
        <figcaption><strong>Apple Watch</strong>{t.watchCaption}</figcaption>
      </figure>
    </div>
    {selected && <CaptureLightbox capture={selected} closeLabel={t.closeCapture} onClose={() => setSelected(null)} />}
  </section>;
}

function CaptureButton({ capture, label, onOpen }: { capture: Capture; label: string; onOpen: (capture: Capture) => void }) {
  return <button className={`capture-button ${capture.kind}`} type="button" aria-label={`${label}: ${capture.title}`} onClick={() => onOpen(capture)}>
    <ProductImage name={capture.name} alt={capture.alt} />
    <span className="capture-zoom" aria-hidden="true">↗</span>
  </button>;
}

function CaptureLightbox({ capture, closeLabel, onClose }: { capture: Capture; closeLabel: string; onClose: () => void }) {
  return <div className="capture-lightbox" role="dialog" aria-modal="true" aria-label={`${capture.title} screenshot`} onMouseDown={event => {
    if (event.target === event.currentTarget) onClose();
  }}>
    <button className="lightbox-close" type="button" aria-label={closeLabel} onClick={onClose} autoFocus>×</button>
    <div className={`lightbox-device ${capture.kind}`}>
      <ProductImage name={capture.name} alt={`${capture.alt}, full size`} priority />
    </div>
    <p><strong>{capture.title}</strong>{capture.caption}</p>
  </div>;
}

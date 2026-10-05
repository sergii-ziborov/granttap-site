import Image from "next/image";
import type { HomeCopy } from "../homeCopy";

export function DesktopShowcase({ t }: { t: HomeCopy }) {
  return <section className="desktop-showcase section-shell" id="mac">
    <div className="section-heading">
      <p className="kicker">{t.desktopKicker}</p>
      <h2>{t.desktopTitle}</h2>
      <p>{t.desktopText}</p>
    </div>
    <figure className="desktop-visual">
      <Image src="/visuals/mac-workspace.jpg" alt="" width={1672} height={941} loading="lazy" unoptimized />
      <span className="desktop-visual-label">{t.desktopVisualLabel}</span>
      <figcaption>{t.desktopCaption}</figcaption>
    </figure>
    <div className="desktop-facts">{t.desktopFacts.map(([title, detail], index) =>
      <article key={title}><span>{String(index + 1).padStart(2, "0")}</span>
        <div><h3>{title}</h3><p>{detail}</p></div>
      </article>)}</div>
  </section>;
}

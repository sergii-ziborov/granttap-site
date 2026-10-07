import Image from "next/image";
import Link from "next/link";
import type { HomeCopy } from "../homeCopy";

export function DesktopShowcase({ t }: { t: HomeCopy }) {
  return <section className="desktop-showcase section-shell" id="mac">
    <div className="section-heading">
      <p className="kicker">{t.desktopKicker}</p>
      <h2>{t.desktopTitle}</h2>
      <p>{t.desktopText}</p>
    </div>
    <figure className="desktop-visual">
      <Image src="/product/mac-now.jpg" alt="GrantTap Now on Mac with sample tasks and decisions" width={2880} height={1800} loading="lazy" unoptimized />
      <span className="desktop-visual-label">{t.desktopVisualLabel}</span>
      <figcaption>{t.desktopCaption}</figcaption>
    </figure>
    <div className="desktop-capture-pair">
      <a href="/product/mac-task.jpg" target="_blank" rel="noopener noreferrer"><Image src="/product/mac-task.jpg" alt="GrantTap task conversation on Mac using sample work" width={2880} height={1800} loading="lazy" unoptimized /><span>{t.desktopCaptureTask}</span></a>
      <a href="/product/mac-mesh.jpg" target="_blank" rel="noopener noreferrer"><Image src="/product/mac-mesh.jpg" alt="GrantTap Mesh on Mac using sample work" width={2880} height={1800} loading="lazy" unoptimized /><span>{t.desktopCaptureMesh}</span></a>
    </div>
    <Link className="desktop-detail-link" href={t.desktopPageHref}>{t.desktopPageLink} →</Link>
    <div className="desktop-facts">{t.desktopFacts.map(([title, detail], index) =>
      <article key={title}><span>{String(index + 1).padStart(2, "0")}</span>
        <div><h3>{title}</h3><p>{detail}</p></div>
      </article>)}</div>
  </section>;
}

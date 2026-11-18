import Image from "next/image";
import type { Locale } from "./Locale";
import { installationAction, localizedProductPath, releaseAvailability } from "../ProductOffer";
import { whatsNew } from "../ProductUpdates/whatsNew";

/** The current App Store release, the published helper and the next iPhone update, side by side. */
export function ReleaseNews({ locale, headingLevel = 2 }: { locale: Locale; headingLevel?: 2 | 3 }) {
  const n = whatsNew(locale);
  const store = releaseAvailability.ios.storeURL;
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const Card = headingLevel === 2 ? "h3" : "h4";
  return <section className="release-news section-shell" id="whats-new" aria-labelledby="whats-new-title">
    <div className="release-news-head">
      <p className="kicker">{n.kicker}</p>
      <Heading id="whats-new-title">{n.title}</Heading>
      <p>{n.text}</p>
    </div>
    <div className="release-news-grid">{n.columns.map(column =>
      <article className={`release-news-card release-news-${column.key}`} key={column.key}>
        <p className="release-news-status">{column.key !== "next" && <span className="status-dot" aria-hidden="true" />}{column.status}</p>
        <Card>{column.label}</Card>
        <ul>{column.items.map(item => <li key={item}>{item}</li>)}</ul>
      </article>)}
    </div>
    <div className="release-news-foot">
      {store
        ? <a className="app-store-badge" href={store}><Image src="/brand/app-store-badge.svg" alt={n.badgeAlt} width={144} height={48} unoptimized /></a>
        : <a className="button button-primary" href={installationAction(locale).href}>{installationAction(locale).label}</a>}
      <p className="release-news-facts">{n.facts}</p>
      <a className="release-news-link" href={localizedProductPath("/support#version-history", locale)}>{n.history} →</a>
    </div>
    <p className="release-news-mac">{n.mac} <a href={localizedProductPath("/mac", locale)}>{n.macLink} →</a></p>
  </section>;
}

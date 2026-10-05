import Link from "next/link";
import { ReadingGrid } from "./ReadingGrid";
import { SiteFooter, SiteHeader } from "./SiteChrome";

type Fact = { title: string; text: string };
type Related = { href: string; label: string };

export function CapabilityPage({
  eyebrow,
  title,
  intro,
  status,
  facts,
  limits,
  related,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  status: string;
  facts: Fact[];
  limits: string[];
  related: Related[];
}) {
  return <main className="legal-shell capability-shell">
    <SiteHeader locale="en" />
    <article className="legal-document capability-document">
      <div className="legal-head">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-intro">{intro}</p>
        <p className="capability-status"><strong>Availability</strong>{status}</p>
      </div>
      <ReadingGrid className="capability-reading" railClassName="capability-rail" rail={<>
        <p className="rail-label">Explore GrantTap</p>
        <nav className="legal-index" aria-label="Related GrantTap guides">
          {related.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
      </>}><div className="legal-body"><section>
        <h2>What works</h2>
        <div className="capability-grid">
          {facts.map((fact) => <article key={fact.title}>
            <h3>{fact.title}</h3>
            <p>{fact.text}</p>
          </article>)}
        </div>
      </section>
      <section>
        <h2>Honest limits</h2>
        <ul>{limits.map((limit) => <li key={limit}>{limit}</li>)}</ul>
      </section>
      </div></ReadingGrid>
    </article>
    <SiteFooter locale="en" />
  </main>;
}

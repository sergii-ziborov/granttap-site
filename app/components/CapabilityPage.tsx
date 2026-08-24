import Image from "next/image";
import Link from "next/link";

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
    <header className="legal-header">
      <Link className="brand" href="/" aria-label="GrantTap home">
        <Image src="/app-icon.png" alt="" width={1024} height={1024} priority />
        <span>GrantTap</span>
      </Link>
      <Link href="/">Home</Link>
    </header>
    <article className="legal-document capability-document">
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="legal-intro">{intro}</p>
      <p className="capability-status"><strong>Availability</strong>{status}</p>
      <section>
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
      <section>
        <h2>Explore GrantTap</h2>
        <nav className="legal-links" aria-label="Related GrantTap guides">
          {related.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
        </nav>
      </section>
    </article>
  </main>;
}

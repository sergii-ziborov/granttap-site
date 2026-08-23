import Image from "next/image";
import type { HomeCopy } from "../page";
import { CaptureGallery } from "./CaptureGallery";
import { LanguageToggle, type Locale } from "./Locale";
import { ProductImage } from "./ProductImage";

type Props = { locale: Locale; setLocale: (locale: Locale) => void; t: HomeCopy };
export function HomeView({ locale, setLocale, t }: Props) {
  return <main>
    <Header locale={locale} setLocale={setLocale} t={t} />
    <Hero t={t} />
    <Providers t={t} />
    <Product t={t} />
    <How t={t} />
    <CaptureGallery t={t} />
    <Security t={t} />
    <Install t={t} />
    <Pricing t={t} />
    <Footer t={t} />
  </main>;
}

function Header({ locale, setLocale, t }: Props) {
  const anchors = ["product", "how", "usage", "security", "install", "pricing"];
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="GrantTap home"><Image src="/app-icon.png" alt="" width={1024} height={1024} priority unoptimized /><span>GrantTap</span></a>
    <nav aria-label="Primary navigation">{t.nav.map((label, index) => <a href={`#${anchors[index]}`} key={label}>{label}</a>)}</nav>
    <LanguageToggle locale={locale} setLocale={setLocale} />
    <a className="nav-cta" href="#availability">{t.cta}</a>
  </header>;
}

function Hero({ t }: Pick<Props, "t">) {
  return <section className="hero section-shell" id="top">
    <div className="hero-copy"><div className="eyebrow"><span className="status-dot" />{t.eyebrow}</div><h1>{t.heroTitle}<span>{t.heroAccent}</span></h1><p className="hero-lede">{t.hero}</p><div className="hero-actions"><a className="button button-primary" href="#availability">{t.heroAction}</a><a className="button button-secondary" href="#product">{t.productAction} ↓</a></div><ul className="hero-notes">{t.proofs.map(item => <li key={item}><b>✓</b> {item}</li>)}</ul></div>
    <div className="hero-product" aria-label="GrantTap on iPhone and Apple Watch"><div className="phone-shell"><div className="phone-speaker" /><div className="phone-screen-stack"><ProductImage name="iphone-command-center" alt="GrantTap Now on iPhone" priority /><ProductImage name="iphone-chat" alt="GrantTap task on iPhone" priority /></div></div><div className="watch-shell"><div className="watch-crown" /><div className="watch-screen-stack"><ProductImage name="apple-watch-approval" alt="GrantTap approval on Apple Watch" priority /><ProductImage name="apple-watch-inbox" alt="GrantTap Needs You on Apple Watch" priority /></div></div></div>
  </section>;
}

function Providers({ t }: Pick<Props, "t">) {
  const providers = [["claude", "Claude Code"], ["codex", "Codex"], ["cursor", t.cursor], ["grok", t.grok]];
  return <section className="trust-strip" aria-label="Supported providers"><p>{t.providers}</p><div>{providers.map(([id, label]) => <span className={`provider-badge ${id}`} key={id}><Image className="tool-mark" src={`/providers/${id}.png?v=20260820-2`} alt="" width={192} height={192} unoptimized /><strong>{label}</strong></span>)}<span className="provider-note">{t.additional}</span></div></section>;
}

function Product({ t }: Pick<Props, "t">) {
  return <section className="controls-section section-shell" id="product"><Heading kicker={t.productKicker} title={t.productTitle} text={t.productText} /><div className="controls-grid">{t.scenarios.map(([title, text], index) => <article className={`control-card${index === 0 ? " featured" : ""}`} id={index === 2 ? "usage" : undefined} key={title}><div className="control-icon">{["DECIDE", "SEE", "USAGE"][index]}</div><h3>{title}</h3><p>{text}</p></article>)}</div><div className="mesh-panel"><div className="mesh-copy"><p className="kicker">{t.meshKicker}</p><h2>{t.meshTitle}</h2><p>{t.meshText}</p><div className="mesh-route" aria-label="Task handoff"><span>Claude · MacBook</span><b>→</b><span>Codex · Workstation</span></div></div><div className="mesh-questions">{t.meshQuestions.map(([title, text], index) => <article key={title}><span>0{index + 1}</span><div><strong>{title}</strong><p>{text}</p></div></article>)}</div></div></section>;
}

function How({ t }: Pick<Props, "t">) {
  return <section className="section-shell workflow" id="how"><Heading kicker={t.howKicker} title={t.howTitle} /><div className="workflow-grid">{t.steps.map(([title, text], index) => <article className="step-card" key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>;
}

function Security({ t }: Pick<Props, "t">) {
  return <section className="security-section" id="security"><div className="section-shell security-inner"><div className="security-copy"><p className="kicker">{t.securityKicker}</p><h2>{t.securityTitle}</h2><p>{t.securityText}</p></div><div className="security-facts">{t.securityFacts.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div></div></section>;
}

function Install({ t }: Pick<Props, "t">) {
  return <section className="install-section section-shell" id="install"><Heading kicker={t.installKicker} title={t.installTitle} text={t.installText} /><div className="install-grid"><article className="install-card"><strong>GrantTap Personal</strong><pre><code>{"npm install -g granttap-mcp\ngranttap setup"}</code></pre></article></div><div className="trust-links"><a href="https://github.com/sergii-ziborov/granttap-mcp">{t.source} ↗</a><a href="https://www.npmjs.com/package/granttap-mcp">{t.npm} ↗</a><a href="https://github.com/sergii-ziborov/granttap-relay">{t.relay} ↗</a></div></section>;
}

function Pricing({ t }: Pick<Props, "t">) {
  return <><section className="pricing-preview section-shell" id="pricing"><div><p className="kicker">{t.pricingKicker}</p><h2>{t.pricingTitle}</h2><p>{t.pricingText}</p><a className="button button-secondary" href="/pricing">{t.pricingAction}</a></div></section><section className="availability section-shell" id="availability"><div className="availability-card release-card"><Image src="/app-icon.png" alt="" width={1024} height={1024} unoptimized /><div><p className="kicker">{t.releaseKicker}</p><h2>{t.releaseTitle}</h2><p className="release-copy">{t.releaseText}</p></div><span className="availability-pill">{t.cta}</span></div></section></>;
}

function Footer({ t }: Pick<Props, "t">) {
  const paths = ["pricing", "privacy", "terms", "support", "security", "data-rights", "accessibility", "licenses"];
  return <footer><div className="footer-brand"><Image src="/app-icon.png" alt="" width={1024} height={1024} unoptimized /><span><strong>GrantTap</strong><small>{t.tagline}</small></span></div><div className="footer-links">{paths.map((path, index) => <a href={`/${path}`} key={path}>{t.legal[index]}</a>)}</div><p>{t.rights}</p></footer>;
}

function Heading({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return <div className="section-heading"><p className="kicker">{kicker}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

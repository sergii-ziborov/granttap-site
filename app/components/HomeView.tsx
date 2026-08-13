import type { HomeCopy } from "../page";
import { LanguageToggle, type Locale } from "./Locale";

type Countdown = { days: number; hours: number; minutes: number; seconds: number; reached: boolean };
type Props = { locale: Locale; setLocale: (locale: Locale) => void; t: HomeCopy; countdown: Countdown | null };
const capture = (name: string) => `/product/${name}.png`;
const Check = () => <span aria-hidden="true">✓</span>;

export function HomeView({ locale, setLocale, t, countdown }: Props) {
  return <main>
    <SiteHeader locale={locale} setLocale={setLocale} t={t} />
    <Hero t={t} />
    <Agents t={t} />
    <ProductStory locale={locale} t={t} />
    <Security t={t} />
    <Gallery locale={locale} t={t} />
    <Install t={t} />
    <Pricing t={t} />
    <Availability countdown={countdown} t={t} />
    <SiteFooter t={t} />
  </main>;
}

function SiteHeader({ locale, setLocale, t }: Omit<Props, "countdown">) {
  return <header className="site-header">
    <a className="brand" href="#top" aria-label="GrantTap home"><img src="/app-icon.png" alt="" /><span>GrantTap</span></a>
    <nav aria-label="Primary navigation"><a href="#workflow">{t.nav[0]}</a><a href="#product">{t.nav[1]}</a><a href="#security">{t.nav[2]}</a><a href="#install">{t.nav[3]}</a></nav>
    <LanguageToggle locale={locale} setLocale={setLocale} />
    <a className="nav-cta" href="#availability">{t.status}</a>
  </header>;
}

function Hero({ t }: Pick<Props, "t">) {
  return <section className="hero section-shell" id="top">
    <div className="hero-copy"><div className="eyebrow"><span className="status-dot" />{t.eyebrow}</div><h1>{t.heroTitle}<span>{t.heroAccent}</span></h1><p className="hero-lede">{t.hero}</p><div className="hero-actions"><a className="button button-primary" href="#product">{t.see} ↓</a><a className="button button-secondary" href="#security">{t.securityModel}</a></div><ul className="hero-notes">{t.highlights.map(item => <li key={item}><Check /> {item}</li>)}</ul></div>
    <div className="hero-product" aria-label="GrantTap on iPhone and Apple Watch"><div className="signal signal-one" /><div className="signal signal-two" /><div className="phone-shell"><div className="phone-speaker" /><div className="phone-screen-stack"><img src={capture("iphone-command-center")} alt="GrantTap Codex tasks" /><img src={capture("iphone-claude-tasks")} alt="GrantTap Claude tasks" /></div><span className="phone-gesture" /></div><div className="watch-shell"><span className="watch-strap watch-strap-top" /><span className="watch-strap watch-strap-bottom" /><div className="watch-crown" /><div className="watch-screen-stack"><img src={capture("apple-watch-approval")} alt="GrantTap Watch approval" /><img src={capture("apple-watch-inbox")} alt="GrantTap Watch inbox" /></div></div></div>
  </section>;
}

function Agents({ t }: Pick<Props, "t">) {
  return <section className="trust-strip" aria-label="Supported platforms"><p>{t.builtFor}</p><div>{[["cursor", "Cursor", "⟩"], ["claude", "Claude Code", "C"], ["codex", "Codex", "▚"], ["copilot", "Copilot", "✦"], ["grok", "Grok", "↯"]].map(([id, label, mark]) => <span key={id}><span className={`tool-mark ${id}-mark`}>{mark}</span><strong>{label}</strong><span className="divider" /></span>)}<span className="apple-mark"></span><strong>iPhone + Apple Watch</strong></div></section>;
}

function ProductStory({ locale, t }: Pick<Props, "locale" | "t">) {
  return <>
    <section className="section-shell workflow" id="workflow"><Heading kicker={t.workflowKicker} title={t.workflowTitle} text={t.workflowText} /><div className="workflow-grid">{t.steps.map(([title, text], index) => <article className="step-card" key={title}><span className="step-number">0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
    <section className="feature-section section-shell"><div className="feature-copy"><p className="kicker">{t.activityKicker}</p><h2>{t.activityTitle}</h2><p>{t.activityText}</p><ul className="check-list">{t.activityItems.map(([title, text]) => <li key={title}><Check /><span><strong>{title}</strong>{text}</span></li>)}</ul></div><div className="activity-stage"><div className="activity-phone"><img src={capture("iphone-task-detail")} alt="GrantTap task context" /></div><div className="activity-watch"><span>{locale === "ru" ? "Та же задача на запястье" : "The same task on your wrist"}</span><img src={capture("apple-watch-task")} alt="GrantTap Watch task" /></div></div></section>
    <section className="controls-section section-shell"><Heading kicker={t.controlsKicker} title={t.controlsTitle} /><div className="controls-grid">{t.controls.map(([title, text], index) => <article className={`control-card${index === 1 ? " featured" : ""}`} key={title}><div className="control-icon">{["⌁", "◉", "↺"][index]}</div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  </>;
}

function Security({ t }: Pick<Props, "t">) {
  return <section className="security-section" id="security"><div className="section-shell security-inner"><div className="security-copy"><p className="kicker">{t.securityKicker}</p><h2>{t.securityTitle}</h2><p>{t.securityText}</p></div><div className="security-diagram">{[t.mac, t.relay, t.devices].map(([title, text], index) => <div className="diagram-group" key={title}>{index > 0 && <div className="encrypted-line"><span>{t.ciphertext}</span></div>}<div className={`security-node${index === 1 ? " relay-node" : ""}`}><span>{["⌘", "◇", "⌚"][index]}</span><strong>{title}</strong><small>{text}</small></div></div>)}</div><div className="security-facts">{t.facts.map(([title, text]) => <article key={title}><strong>{title}</strong><p>{text}</p></article>)}</div></div></section>;
}

function Gallery({ locale, t }: Pick<Props, "locale" | "t">) {
  return <section className="gallery-section section-shell" id="product"><Heading kicker={t.galleryKicker} title={t.galleryTitle} /><div className="gallery-grid"><figure className="gallery-phone"><div className="phone-pair"><div className="gallery-device"><img src={capture("iphone-command-center")} alt="GrantTap task list" /></div><div className="gallery-device"><img src={capture("iphone-claude-tasks")} alt="GrantTap Claude tasks" /></div></div><figcaption><strong>iPhone · approvals + chat</strong>{t.phoneCaption}</figcaption></figure><figure className="gallery-watch"><div className="watch-pair"><img src={capture("apple-watch-inbox")} alt="Watch inbox" /><img src={capture("apple-watch-approval")} alt="Watch approval" /></div><figcaption><strong>Apple Watch</strong>{t.watchCaption}</figcaption></figure></div><div className="history-gallery">{[["iphone-task-detail", locale === "ru" ? "Контекст задачи" : "Task context", t.historyCaption], ["iphone-mcp-usage", "MCP and skill usage", t.usageCaption], ["iphone-security-settings", "On-device security", t.securityCaption]].map(([image, title, text]) => <figure key={image}><div className="history-shot"><img src={capture(image)} alt={title} /></div><figcaption><strong>{title}</strong>{text}</figcaption></figure>)}</div></section>;
}

function Install({ t }: Pick<Props, "t">) {
  const commands = [[t.codex, "codex mcp add granttap -- npx -y granttap-mcp"], [t.claude, "claude mcp add granttap -- npx -y granttap-mcp"], [t.cursor, "npx -y granttap-mcp connect"], [t.copilot, "npx -y granttap-mcp connect"], [t.grok, "grok mcp add granttap -- npx -y granttap-mcp"], [t.hooks, "npm install -g granttap-mcp\ngranttap-mcp connect"]];
  return <section className="install-section section-shell" id="install"><Heading kicker={t.installKicker} title={t.installTitle} text={t.installText} /><div className="install-grid">{commands.map(([title, command]) => <article className="install-card" key={title}><strong>{title}</strong><pre><code>{command}</code></pre></article>)}</div><div className="trust-links"><a href="https://github.com/sergii-ziborov/granttap-mcp">{t.source} ↗</a><a href="https://www.npmjs.com/package/granttap-mcp">{t.npm} ↗</a><a href="https://github.com/sergii-ziborov/granttap-relay">{t.relaySource} ↗</a></div></section>;
}

function Pricing({ t }: Pick<Props, "t">) {
  return <section className="pricing-preview section-shell"><div><p className="kicker">{t.pricingKicker}</p><h2>{t.pricingTitle}</h2><p>{t.pricingText}</p><a className="button button-secondary" href="/pricing">{t.pricingAction}</a></div><aside><strong>{t.localTitle}</strong><p>{t.localText}</p></aside></section>;
}

function Availability({ countdown, t }: Pick<Props, "countdown" | "t">) {
  return <section className="availability section-shell" id="availability"><div className="availability-card release-card"><img src="/app-icon.png" alt="" /><div><p className="kicker">{t.releaseKicker}</p><h2>{t.releaseTitle}</h2><p className="release-copy">{t.releaseText}</p>{countdown && (countdown.reached ? <p className="release-countdown reached">{t.countdownReached}</p> : <div className="release-countdown"><span className="countdown-caption">{t.countdownLabel} · {t.remaining}</span><div className="countdown-clock">{[countdown.days, countdown.hours, countdown.minutes, countdown.seconds].map((value, index) => <span className="countdown-unit" key={t.countdownUnits[index]}><strong>{String(value).padStart(2, "0")}</strong><small>{t.countdownUnits[index]}</small></span>)}</div></div>)}</div><span className="availability-pill">{t.appStore}</span></div></section>;
}

function SiteFooter({ t }: Pick<Props, "t">) {
  return <footer><div className="footer-brand"><img src="/app-icon.png" alt="" /><span><strong>GrantTap</strong><small>{t.tagline}</small></span></div><div className="footer-links">{["pricing", "privacy", "terms", "support", "security", "data-rights", "accessibility", "licenses"].map((path, index) => <a href={`/${path}`} key={path}>{t.legal[index]}</a>)}</div><p>{t.rights}</p></footer>;
}

function Heading({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return <div className="section-heading"><p className="kicker">{kicker}</p><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

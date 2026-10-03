"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageToggle, useLocale, type Locale } from "../components/Locale";
import type { BlogArticle } from "./articleTypes";

function BlogHeader({ locale, setLocale }: { locale: Locale; setLocale: (next: Locale) => void }) {
  return <header className="blog-header section-shell">
    <Link className="blog-brand" href="/"><Image src="/app-icon.png" alt="" width={34} height={34} unoptimized />GrantTap</Link>
    <nav aria-label={locale === "ru" ? "Навигация" : "Navigation"}>
      <Link href="/">{locale === "ru" ? "Продукт" : "Product"}</Link>
      <Link href="/blog" aria-current="page">{locale === "ru" ? "Блог" : "Blog"}</Link>
      <Link href="/connect">{locale === "ru" ? "Подключение" : "Connect"}</Link>
    </nav>
    <LanguageToggle locale={locale} setLocale={setLocale} />
  </header>;
}

function BlogFooter({ locale }: { locale: Locale }) {
  return <footer className="blog-footer section-shell">
    <span>© 2026 GrantTap</span>
    <Link href="/support">{locale === "ru" ? "Помощь" : "Support"}</Link>
    <Link href="/privacy">{locale === "ru" ? "Конфиденциальность" : "Privacy"}</Link>
  </footer>;
}

export function BlogIndex({ articles, scheduleActive }: { articles: BlogArticle[]; scheduleActive: boolean }) {
  const { locale, setLocale } = useLocale();
  const first = articles[0];
  return <main className="blog-shell">
    <BlogHeader locale={locale} setLocale={setLocale} />
    <section className="blog-lead section-shell">
      <p className="blog-eyebrow">GrantTap Journal</p>
      <h1>{locale === "ru" ? "Работа агентов, которую можно понять и контролировать." : "Agent work you can understand and control."}</h1>
      <p>{locale === "ru" ? "Идеи продукта, честное сравнение с coding-инструментами, governance, события и практические руководства. Мы отделяем действующие возможности от планов и подтверждённые факты от выводов." : "Product thinking, honest comparisons, governance, events, and practical guides. We separate working features from plans and documented facts from interpretation."}</p>
      {scheduleActive && <p className="blog-cadence">{locale === "ru" ? "Новые материалы по субботам до 31 октября." : "New stories every Saturday through October 31."}</p>}
    </section>
    <section className="section-shell blog-feature" aria-label={locale === "ru" ? "Главная статья" : "Featured article"}>
      <Link className="blog-feature-link" href={`/blog/${first.slug}`}>
        <Image src={first.cover} alt="" width={1600} height={900} priority unoptimized />
        <span className="blog-feature-copy">
          <small>{first[locale].category} · {first.date} · {first.minutes} {locale === "ru" ? "мин" : "min"}</small>
          <strong>{first[locale].title}</strong>
          <span>{first[locale].summary}</span>
          <b>{locale === "ru" ? "Читать статью ↗" : "Read the story ↗"}</b>
        </span>
      </Link>
    </section>
    <section className="section-shell blog-list" aria-label={locale === "ru" ? "Все статьи" : "All articles"}>
      <div className="blog-list-heading"><h2>{locale === "ru" ? "Все статьи" : "All stories"}</h2><span>{articles.length} {locale === "ru" ? "материалов" : "stories"}</span></div>
      <div className="blog-grid">{articles.map(article => <Link className="blog-card" href={`/blog/${article.slug}`} key={article.slug}>
        <span className="blog-card-image"><Image src={article.cover} alt="" width={800} height={450} unoptimized /></span>
        <span className="blog-card-body"><small>{article[locale].category} · {article.date} · {article.minutes} {locale === "ru" ? "мин" : "min"}</small><strong>{article[locale].title}</strong><span>{article[locale].summary}</span></span>
      </Link>)}</div>
    </section>
    <BlogFooter locale={locale} />
  </main>;
}

export function BlogArticleView({ article, articles }: { article: BlogArticle; articles: BlogArticle[] }) {
  const { locale, setLocale } = useLocale();
  const t = article[locale];
  const next = articles[(articles.findIndex(item => item.slug === article.slug) + 1) % articles.length];
  return <main className="blog-shell">
    <BlogHeader locale={locale} setLocale={setLocale} />
    <article className="blog-article">
      <div className="section-shell blog-article-head">
        <Link className="blog-back" href="/blog">← {locale === "ru" ? "Все статьи" : "All stories"}</Link>
        <p className="blog-eyebrow">{t.category} <span>·</span> <time dateTime={article.date}>{article.date}</time> <span>·</span> {article.minutes} {locale === "ru" ? "мин чтения" : "min read"}</p>
        <h1>{t.title}</h1>
        <p className="blog-deck">{t.summary}</p>
      </div>
      <figure className="blog-article-cover section-shell"><Image src={article.cover} alt="" width={1600} height={900} priority unoptimized />{article.generatedCover && <figcaption>{locale === "ru" ? "Иллюстрация создана с помощью генерации изображений; это не фотография события или экран продукта." : "AI-generated editorial illustration; this is not an event photograph or product screen."}</figcaption>}</figure>
      <div className="blog-prose">
        {t.intro.map(paragraph => <p className="blog-intro" key={paragraph}>{paragraph}</p>)}
        {t.graphic && <figure className="blog-graphic">
          <figcaption><strong>{t.graphic.title}</strong><span>{t.graphic.caption}</span></figcaption>
          <div className="blog-graphic-rows">{t.graphic.rows.map((row, index) => <div className="blog-graphic-row" key={row.label}>
            <span className="blog-graphic-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{row.label}</strong><span>{row.detail}</span>
            {row.value !== undefined && <div className="blog-graphic-track" aria-label={`${row.label}: ${row.detail}`}><i style={{ width: `${row.value}%` }} /></div>}
          </div>)}</div>
        </figure>}
        {t.sections.map((section, index) => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {index === 1 && article.screenshot && t.screenshotCaption && <figure className="blog-screenshot"><Image src={article.screenshot} alt={t.screenshotCaption} width={720} height={1560} unoptimized /><figcaption>{t.screenshotCaption}</figcaption></figure>}
        </section>)}
        <aside className="blog-note">{t.closing}</aside>
        {t.sources && <section className="blog-sources"><h2>{locale === "ru" ? "Источники" : "Sources"}</h2><ul>{t.sources.map(source => <li key={source.url}><a href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}>{source.label} ↗</a></li>)}</ul></section>}
      </div>
    </article>
    <div className="section-shell blog-next"><span>{locale === "ru" ? "Далее" : "Next story"}</span><Link href={`/blog/${next.slug}`}>{next[locale].title} →</Link></div>
    <BlogFooter locale={locale} />
  </main>;
}

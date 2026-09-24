"use client";

import Image from "next/image";
import Link from "next/link";
import { LanguageToggle, useLocale, type Locale } from "../components/Locale";
import { articles, type BlogArticle } from "./articles";

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

export function BlogIndex() {
  const { locale, setLocale } = useLocale();
  const first = articles[0];
  return <main className="blog-shell">
    <BlogHeader locale={locale} setLocale={setLocale} />
    <section className="blog-lead section-shell">
      <p className="blog-eyebrow">GrantTap Journal</p>
      <h1>{locale === "ru" ? "Работа агентов, которую можно понять и контролировать." : "Agent work you can understand and control."}</h1>
      <p>{locale === "ru" ? "Практические руководства по подключению устройств, задачам, Mesh, архитектуре и правам. В статьях различаются возможности продукта, демо-экраны и работа, которую ещё предстоит завершить." : "Practical guides to device pairing, Tasks, Mesh, architecture, and permissions. We distinguish working product paths, demo captures, and work still in progress."}</p>
    </section>
    <section className="section-shell blog-feature" aria-label={locale === "ru" ? "Главная статья" : "Featured article"}>
      <Link className="blog-feature-link" href={`/blog/${first.slug}`}>
        <Image src={first.cover} alt="" width={1600} height={900} priority unoptimized />
        <span className="blog-feature-copy">
          <small>{first[locale].category} · {first.minutes} {locale === "ru" ? "мин" : "min"}</small>
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
        <span className="blog-card-body"><small>{article[locale].category} · {article.minutes} {locale === "ru" ? "мин" : "min"}</small><strong>{article[locale].title}</strong><span>{article[locale].summary}</span></span>
      </Link>)}</div>
    </section>
    <BlogFooter locale={locale} />
  </main>;
}

export function BlogArticleView({ article }: { article: BlogArticle }) {
  const { locale, setLocale } = useLocale();
  const t = article[locale];
  const next = articles[(articles.findIndex(item => item.slug === article.slug) + 1) % articles.length];
  return <main className="blog-shell">
    <BlogHeader locale={locale} setLocale={setLocale} />
    <article className="blog-article">
      <div className="section-shell blog-article-head">
        <Link className="blog-back" href="/blog">← {locale === "ru" ? "Все статьи" : "All stories"}</Link>
        <p className="blog-eyebrow">{t.category} <span>·</span> {article.date} <span>·</span> {article.minutes} {locale === "ru" ? "мин чтения" : "min read"}</p>
        <h1>{t.title}</h1>
        <p className="blog-deck">{t.summary}</p>
      </div>
      <div className="blog-article-cover section-shell"><Image src={article.cover} alt="" width={1600} height={900} priority unoptimized /></div>
      <div className="blog-prose">
        {t.intro.map(paragraph => <p className="blog-intro" key={paragraph}>{paragraph}</p>)}
        {t.sections.map((section, index) => <section key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {index === 1 && <figure className="blog-screenshot"><Image src={article.screenshot} alt={t.screenshotCaption} width={720} height={1560} unoptimized /><figcaption>{t.screenshotCaption}</figcaption></figure>}
        </section>)}
        <aside className="blog-note">{t.closing}</aside>
      </div>
    </article>
    <div className="section-shell blog-next"><span>{locale === "ru" ? "Далее" : "Next story"}</span><Link href={`/blog/${next.slug}`}>{next[locale].title} →</Link></div>
    <BlogFooter locale={locale} />
  </main>;
}

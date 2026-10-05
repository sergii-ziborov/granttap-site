import Image from "next/image";
import { ReadingGrid } from "../components/ReadingGrid";
import { LocaleLinks, SiteFooter, SiteHeader } from "../components/SiteChrome";
import type { BlogArticle, BlogLocale } from "./articleTypes";

function blogHref(path: string, locale: BlogLocale) {
  return locale === "ru" ? `${path}?lang=ru` : path;
}

export function BlogIndex({ articles, locale }: { articles: BlogArticle[]; locale: BlogLocale }) {
  const first = articles[0];
  return <main className="blog-shell" lang={locale}>
    <SiteHeader locale={locale} active="blog" languageControl={<LocaleLinks locale={locale} path="/blog" />} />
    <section className="blog-lead section-shell">
      <p className="blog-eyebrow">GrantTap Journal</p>
      <h1>{locale === "ru" ? "Работа агентов, которую можно понять и контролировать." : "Agent work you can understand and control."}</h1>
      <p>{locale === "ru" ? "Практические идеи для работы с coding-агентами: видеть прогресс, принимать точные решения и сохранять одну Task при смене инструмента или устройства. Сравнения, Mesh, governance и проверяемые результаты." : "Field guides for running coding agents with confidence: see progress, make better decisions, and keep one Task moving across tools and devices. Explore comparisons, Mesh, governance, and verifiable results."}</p>
    </section>
    <section className="section-shell blog-feature" aria-label={locale === "ru" ? "Главная статья" : "Featured article"}>
      <a className="blog-feature-link" href={blogHref(`/blog/${first.slug}`, locale)}>
        <Image src={first.cover} alt="" width={1600} height={900} priority unoptimized />
        <span className="blog-feature-copy">
          <small>{first[locale].category} · {first.date} · {first.minutes} {locale === "ru" ? "мин" : "min"}</small>
          <strong>{first[locale].title}</strong>
          <span>{first[locale].summary}</span>
          <b>{locale === "ru" ? "Читать статью ↗" : "Read the story ↗"}</b>
        </span>
      </a>
    </section>
    <section className="section-shell blog-list" aria-label={locale === "ru" ? "Все статьи" : "All articles"}>
      <div className="blog-list-heading"><h2>{locale === "ru" ? "Все статьи" : "All stories"}</h2><span>{articles.length} {locale === "ru" ? "материалов" : "stories"}</span></div>
      <div className="blog-grid">{articles.map(article => <a className="blog-card" href={blogHref(`/blog/${article.slug}`, locale)} key={article.slug}>
        <span className="blog-card-image"><Image src={article.cover} alt="" width={800} height={450} unoptimized /></span>
        <span className="blog-card-body"><small>{article[locale].category} · {article.date} · {article.minutes} {locale === "ru" ? "мин" : "min"}</small><strong>{article[locale].title}</strong><span>{article[locale].summary}</span><b className="blog-card-cta">{locale === "ru" ? "Читать" : "Read story"} ↗</b></span>
      </a>)}</div>
    </section>
    <SiteFooter locale={locale} />
  </main>;
}

export function BlogArticleView({ article, articles, locale }: { article: BlogArticle; articles: BlogArticle[]; locale: BlogLocale }) {
  const t = article[locale];
  const next = articles[(articles.findIndex(item => item.slug === article.slug) + 1) % articles.length];
  return <main className="blog-shell" lang={locale}>
    <SiteHeader locale={locale} active="blog" languageControl={<LocaleLinks locale={locale} path={`/blog/${article.slug}`} />} />
    <article className="blog-article">
      <div className="section-shell blog-article-head">
        <nav className="blog-breadcrumb" aria-label={locale === "ru" ? "Навигационная цепочка" : "Breadcrumb"}><ol>
          <li><a href={blogHref("/", locale)}>{locale === "ru" ? "Главная" : "Home"}</a></li>
          <li><a href={blogHref("/blog", locale)}>{locale === "ru" ? "Блог" : "Journal"}</a></li>
          <li aria-current="page">{t.title}</li>
        </ol></nav>
        <p className="blog-eyebrow">{t.category} <span>·</span> <time dateTime={article.date}>{article.date}</time> <span>·</span> {article.minutes} {locale === "ru" ? "мин чтения" : "min read"}</p>
        <h1>{t.title}</h1>
        <p className="blog-deck">{t.summary}</p>
      </div>
      <figure className="blog-article-cover section-shell"><Image src={article.cover} alt="" width={1600} height={900} priority unoptimized />{article.generatedCover && <figcaption><strong className="blog-visual-label">{locale === "ru" ? "Иллюстрация" : "Editorial illustration"}</strong>{locale === "ru" ? "Образ статьи создан специально для этого материала. Экраны GrantTap ниже сняты отдельно на тестовых данных." : "Created for this story. GrantTap screens below are separate captures made with sample data."}</figcaption>}</figure>
      <ReadingGrid className="blog-reading-grid section-shell" railClassName="blog-article-rail"
        railLabel={locale === "ru" ? "Содержание статьи" : "Article contents"} rail={<>
        <p>{locale === "ru" ? "В статье" : "In this story"}</p>
        <nav>{t.sections.map((section, index) => <a href={`#article-section-${index + 1}`} key={section.heading}><span>{String(index + 1).padStart(2, "0")}</span>{section.heading}</a>)}</nav>
        <small>{article.minutes} {locale === "ru" ? "мин чтения" : "min read"} · {article.date}</small>
      </>}><div className="blog-prose">
        {t.intro.map(paragraph => <p className="blog-intro" key={paragraph}>{paragraph}</p>)}
        {t.graphic && <figure className="blog-graphic">
          <figcaption><strong>{t.graphic.title}</strong><span>{t.graphic.caption}</span></figcaption>
          <div className="blog-graphic-rows">{t.graphic.rows.map((row, index) => <div className="blog-graphic-row" key={row.label}>
            <span className="blog-graphic-index">{String(index + 1).padStart(2, "0")}</span>
            <strong>{row.label}</strong><span>{row.detail}</span>
            {row.value !== undefined && <div className="blog-graphic-track" aria-label={`${row.label}: ${row.detail}`}><i style={{ width: `${row.value}%` }} /></div>}
          </div>)}</div>
        </figure>}
        {t.sections.map((section, index) => <section id={`article-section-${index + 1}`} key={section.heading}>
          <h2>{section.heading}</h2>
          {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          {index === 0 && article.inlineIllustration && t.illustrationCaption && <figure className="blog-illustration"><Image src={article.inlineIllustration} alt="" width={1400} height={788} loading="lazy" unoptimized /><figcaption><strong className="blog-visual-label">{locale === "ru" ? "Иллюстрация" : "Editorial illustration"}</strong>{t.illustrationCaption}</figcaption></figure>}
          {index === t.sections.length - 1 && article.screenshot && t.screenshotCaption && <figure className="blog-screenshot"><Image src={article.screenshot} alt={t.screenshotCaption} width={720} height={1560} unoptimized /><figcaption><strong className="blog-visual-label">{locale === "ru" ? "Экран GrantTap · тестовые данные" : "GrantTap screen · sample data"}</strong>{t.screenshotCaption}</figcaption></figure>}
          {index === Math.floor(t.sections.length / 2) && article.additionalIllustration && t.additionalIllustrationCaption && <figure className="blog-illustration"><Image src={article.additionalIllustration} alt="" width={1400} height={788} loading="lazy" unoptimized /><figcaption><strong className="blog-visual-label">{locale === "ru" ? "Иллюстрация" : "Editorial illustration"}</strong>{t.additionalIllustrationCaption}</figcaption></figure>}
        </section>)}
        <aside className="blog-note">{t.closing}</aside>
        {t.sources && <section className="blog-sources"><h2>{locale === "ru" ? "Источники" : "Sources"}</h2><ul>{t.sources.map(source => <li key={source.url}><a href={source.url} target={source.url.startsWith("http") ? "_blank" : undefined} rel={source.url.startsWith("http") ? "noopener noreferrer" : undefined}>{source.label} ↗</a></li>)}</ul></section>}
      </div></ReadingGrid>
    </article>
    <div className="section-shell blog-next"><span>{locale === "ru" ? "Далее" : "Next story"}</span><a href={blogHref(`/blog/${next.slug}`, locale)}>{next[locale].title} →</a></div>
    <SiteFooter locale={locale} />
  </main>;
}

import { GuideReader } from ".";
import { parseGuide, plainText } from "./markdown";
import { guideCatalog, guideGroups, type GuideMeta } from "../GuideContent/catalog";
import { groupIllustration } from "../GuideContent/illustrations";
import { Artwork } from "./Artwork";

export function GuideArticle({ page, content }: { page: GuideMeta; content: string }) {
  const sections = parseGuide(content); const current = guideCatalog.findIndex(item => item.slug === page.slug);
  const group = guideGroups.find(item => item.id === page.group);
  const minutes = Math.max(1, Math.ceil(plainText(content).split(/\s+/).length / 180));
  return <div className="guide-article-grid">
    <article className="guide-article">
      <nav className="guide-breadcrumb" aria-label="Путь"><a href="/guide">Руководство</a><span>/</span><span>{group?.title}</span></nav>
      <header className="guide-article-head"><span className="guide-eyebrow">{group?.title}</span>
        <h1>{page.title}</h1><p>{page.summary}</p>
        <div className="guide-article-meta"><span>{minutes} мин чтения</span><span>Обновлено 27.10.2026</span><a href="/guide/demo-project">Учебные данные</a></div>
      </header>
      <Artwork id={groupIllustration[page.group] || "workspace"} />
      <details className="guide-mobile-toc"><summary>В этой главе · {sections.length - 1} разделов</summary>
        <nav>{sections.filter(section => section.title).map(section => <a href={`#${section.id}`} key={section.id}>{section.title}</a>)}</nav>
      </details>
      <GuideReader sections={sections} />
      <aside className="guide-article-help"><strong>Названия в вашей версии отличаются?</strong>
        <p>Проверьте версии приложения и модуля компьютера. Скриншоты подписаны отдельно; некоторые элементы могут быть на английском.</p>
        <a href="/guide/updates">Как проверить обновления ↗</a><a href="/guide/troubleshooting">Разобраться с проблемой ↗</a></aside>
      <nav className="guide-pagination" aria-label="Между главами">
        {current > 0 ? <a href={`/guide/${guideCatalog[current - 1].slug}`}><small>← Предыдущая глава</small><strong>{guideCatalog[current - 1].title}</strong></a> : <a href="/guide"><small>← Назад</small><strong>Обзор руководства</strong></a>}
        {current < guideCatalog.length - 1 && <a href={`/guide/${guideCatalog[current + 1].slug}`}><small>Следующая глава →</small><strong>{guideCatalog[current + 1].title}</strong></a>}
      </nav>
      <footer className="guide-article-footer">GrantTap · Локальные агенты, понятные решения. <a href="/privacy?lang=ru">Приватность</a></footer>
    </article>
    <aside className="guide-toc"><span className="guide-eyebrow">В этой главе</span><nav aria-label="Содержание главы">
      {sections.filter(section => section.title).map((section, index) => <a href={`#${section.id}`} key={section.id}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}
    </nav><div><strong>Понимать → пробовать → проверять</strong><p>Практикуйтесь на учебном проекте. Настоящие подтверждения всегда важнее индикатора ожидания.</p><a href="/guide/demo-project">Открыть практику ↗</a></div></aside>
  </div>;
}

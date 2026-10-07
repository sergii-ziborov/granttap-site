import Image from "next/image";
import type { ReactNode } from "react";
import type { Locale } from "./Locale";

type NavKey = "product" | "mac" | "how" | "security" | "blog" | "pricing" | "support";

const navigation: Array<{ key: NavKey; href: string; en: string; ru: string }> = [
  { key: "product", href: "/#product", en: "Product", ru: "Продукт" },
  { key: "mac", href: "/mac", en: "Mac", ru: "Mac" },
  { key: "how", href: "/#how", en: "How it works", ru: "Как работает" },
  { key: "security", href: "/#security", en: "Security", ru: "Безопасность" },
  { key: "blog", href: "/blog", en: "Blog", ru: "Блог" },
  { key: "pricing", href: "/pricing", en: "Pricing", ru: "Цена" },
  { key: "support", href: "/support", en: "Support", ru: "Помощь" },
];

function localeHref(href: string, locale: Locale) {
  if (locale === "en") return href;
  const [path, hash] = href.split("#");
  return `${path || "/"}?lang=ru${hash ? `#${hash}` : ""}`;
}

export function LocaleLinks({ locale, path }: { locale: Locale; path: string }) {
  return <div className="language-toggle site-language-links" role="group" aria-label={locale === "ru" ? "Язык" : "Language"}>
    <a href={path} aria-current={locale === "en" ? "true" : undefined} aria-label={locale === "en" ? "English, selected" : "Переключить на английский"}>EN</a>
    <a href={`${path}?lang=ru`} aria-current={locale === "ru" ? "true" : undefined} aria-label={locale === "ru" ? "Русский, выбран" : "Switch to Russian"}>RU</a>
  </div>;
}

export function SiteHeader({ locale, active, languageControl }: {
  locale: Locale;
  active?: NavKey;
  languageControl?: ReactNode;
}) {
  const links = navigation.map(item => <a href={localeHref(item.href, locale)} key={item.key}
    aria-current={active === item.key ? "page" : undefined}>{item[locale]}</a>);
  return <header className="site-header page-shell">
    <a className="brand" href={localeHref("/", locale)} aria-label="GrantTap home">
      <Image src="/app-icon.png" alt="" width={34} height={34} priority unoptimized /><span>GrantTap</span>
    </a>
    <nav className="site-nav" aria-label={locale === "ru" ? "Основная навигация" : "Primary navigation"}>{links}</nav>
    <div className="site-header-actions">{languageControl}
      <a className="nav-cta" href={localeHref("/#install", locale)}>{locale === "ru" ? "Установка" : "Install"} <span aria-hidden="true">↗</span></a>
    </div>
    <details className="site-menu"><summary>{locale === "ru" ? "Меню" : "Menu"}</summary>
      <nav aria-label={locale === "ru" ? "Мобильная навигация" : "Mobile navigation"}>{links}</nav>
    </details>
  </header>;
}

const guides = [
  { href: "/mac", en: "GrantTap for Mac", ru: "GrantTap для Mac" },
  { href: "/project-mesh", en: "Mesh", ru: "Mesh" },
  { href: "/agents/claude-code", en: "Claude Code", ru: "Claude Code" },
  { href: "/agents/codex", en: "Codex", ru: "Codex" },
  { href: "/agents/cursor", en: "Cursor", ru: "Cursor" },
];

const legal = [
  { href: "/about", en: "About", ru: "О нас" },
  { href: "/privacy", en: "Privacy", ru: "Конфиденциальность" },
  { href: "/terms", en: "Terms", ru: "Условия" },
  { href: "/security", en: "Security", ru: "Безопасность" },
  { href: "/data-rights", en: "Data choices", ru: "Управление данными" },
  { href: "/accessibility", en: "Accessibility", ru: "Доступность" },
  { href: "/licenses", en: "Licenses", ru: "Лицензии" },
];

export function SiteFooter({ locale }: { locale: Locale }) {
  return <footer className="site-footer page-shell">
    <div className="footer-brand"><Image src="/app-icon.png" alt="" width={34} height={34} unoptimized />
      <span><strong>GrantTap</strong><small>{locale === "ru" ? "Контроль локальных coding agents" : "Local coding agents, in view"}</small></span>
    </div>
    <nav className="footer-links" aria-label={locale === "ru" ? "Руководства" : "Guides"}>
      <a href={localeHref("/blog", locale)}>{locale === "ru" ? "Журнал" : "Journal"}</a>
      {guides.map(item => <a href={item.href} key={item.href}>{item[locale]}</a>)}
    </nav>
    <nav className="footer-links" aria-label={locale === "ru" ? "Сайт и документы" : "Site and legal"}>
      <a href="/pricing">{locale === "ru" ? "Цена" : "Pricing"}</a>
      <a href="/support">{locale === "ru" ? "Помощь" : "Support"}</a>
      {legal.map(item => <a href={item.href} key={item.href}>{item[locale]}</a>)}
    </nav>
    <p>{locale === "ru" ? "© 2026 GrantTap. Не связан с Anthropic, OpenAI, Anysphere, xAI или Apple." : "© 2026 GrantTap. Not affiliated with Anthropic, OpenAI, Anysphere, xAI, or Apple."}</p>
  </footer>;
}

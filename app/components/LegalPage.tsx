"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageToggle, useLocale } from "./Locale";
import { ReadingGrid } from "./ReadingGrid";
import { SiteFooter, SiteHeader } from "./SiteChrome";

const LEGAL_LINKS = [
  { href: "/pricing", label: { en: "Pricing", ru: "Тарифы" } },
  { href: "/privacy", label: { en: "Privacy", ru: "Конфиденциальность" } },
  { href: "/terms", label: { en: "Terms", ru: "Условия" } },
  { href: "/support", label: { en: "Support", ru: "Поддержка" } },
  { href: "/security", label: { en: "Security", ru: "Безопасность" } },
  { href: "/data-rights", label: { en: "Data choices", ru: "Управление данными" } },
  { href: "/accessibility", label: { en: "Accessibility", ru: "Доступность" } },
  { href: "/licenses", label: { en: "Licenses", ru: "Лицензии" } },
] as const;

const SUPPORT_EMAIL = "sergii.ziborov@gmail.com";

type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: Array<{ label: string; href: string }>;
};

export function LegalPage({
  title,
  updated,
  updatedISO,
  intro,
  sections,
}: {
  title: { en: string; ru: string };
  updated: { en: string; ru: string };
  updatedISO: string;
  intro: { en: string; ru: string };
  sections: { en: Section[]; ru: Section[] };
}) {
  const { locale, setLocale } = useLocale();
  const pathname = usePathname();
  const labels =
    locale === "en"
      ? {
          updated: "Last updated",
          footer: "GrantTap legal and support",
          index: "Legal and support pages",
          skip: "Skip to content",
          contact: "Support contact",
        }
      : {
          updated: "Обновлено",
          footer: "Юридическая информация и поддержка GrantTap",
          index: "Юридические страницы и поддержка",
          skip: "Перейти к содержимому",
          contact: "Контакт поддержки",
        };

  return (
    <main className="legal-shell" lang={locale}>
      <a className="skip-link" href="#legal-content">{labels.skip}</a>
      <SiteHeader locale={locale} active={pathname === "/pricing" ? "pricing" : pathname === "/support" ? "support" : undefined}
        languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
      <article className="legal-document" id="legal-content">
        <div className="legal-head">
          <p className="kicker">{labels.footer}</p>
          <h1>{title[locale]}</h1>
          <p className="legal-updated">{labels.updated}: <time dateTime={updatedISO}>{updated[locale]}</time></p>
          <p className="legal-intro">{intro[locale]}</p>
        </div>
        <ReadingGrid className="legal-reading" railClassName="legal-rail" rail={<>
          <p className="rail-label">{labels.index}</p>
          <nav className="legal-index" aria-label={labels.index}>
            {LEGAL_LINKS.map(({ href, label }) => (
              <Link href={href} key={href} aria-current={pathname === href ? "page" : undefined}>
                {label[locale]}
              </Link>
            ))}
          </nav>
        </>}><div className="legal-body">{sections[locale].map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && (
              <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            )}
            {section.links && (
              <div className="legal-links">
                {section.links.map((link) => (
                  link.href.startsWith("/") ? (
                    <Link href={link.href} key={link.href}>{link.label}</Link>
                  ) : (
                    <a href={link.href} key={link.href}>
                      {link.label}<span aria-hidden="true"> ↗</span>
                    </a>
                  )
                ))}
              </div>
            )}
          </section>
        ))}</div></ReadingGrid>
      </article>
      <div className="legal-contact page-shell">{labels.contact}: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></div>
      <SiteFooter locale={locale} />
    </main>
  );
}

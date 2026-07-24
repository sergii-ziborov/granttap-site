"use client";

import Link from "next/link";
import { LanguageToggle, useLocale } from "./Locale";

type Section = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  links?: Array<{ label: string; href: string }>;
};

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: {
  title: { en: string; ru: string };
  updated: { en: string; ru: string };
  intro: { en: string; ru: string };
  sections: { en: Section[]; ru: Section[] };
}) {
  const { locale, setLocale } = useLocale();
  const labels =
    locale === "en"
      ? { home: "Home", updated: "Last updated", footer: "GrantTap legal and support" }
      : { home: "Главная", updated: "Обновлено", footer: "Юридическая информация и поддержка GrantTap" };

  return (
    <main className="legal-shell">
      <header className="legal-header">
        <Link className="brand" href="/">
          <img src="/app-icon.png" alt="" />
          <span>GrantTap</span>
        </Link>
        <Link href="/">{labels.home}</Link>
        <LanguageToggle locale={locale} setLocale={setLocale} />
      </header>
      <article className="legal-document">
        <p className="kicker">{labels.footer}</p>
        <h1>{title[locale]}</h1>
        <p className="legal-updated">
          {labels.updated}: {updated[locale]}
        </p>
        <p className="legal-intro">{intro[locale]}</p>
        {sections[locale].map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && (
              <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            )}
            {section.links && (
              <div className="legal-links">
                {section.links.map((link) => (
                  <a href={link.href} key={link.href} target={link.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {link.label} ↗
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </article>
      <footer className="legal-footer">
        <a href="/privacy">Privacy</a>
        <a href="/terms">Terms</a>
        <a href="/support">Support</a>
        <a href="/licenses">Licenses</a>
      </footer>
    </main>
  );
}

"use client";

import { LanguageToggle, useLocale } from "../components/Locale";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";
import { installationAction, launchOffer, localizedProductPath, usdPrice } from ".";
import { pricingCopy } from "./pricingCopy";

export function PricingView() {
  const { locale, setLocale } = useLocale();
  const t = pricingCopy[locale];
  const action = installationAction(locale);
  return <main className="offer-page" lang={locale}>
    <SiteHeader locale={locale} active="pricing"
      languageControl={<LanguageToggle locale={locale} setLocale={setLocale} />} />
    <section className="section-shell offer-intro">
      <p className="kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.intro}</p>
      <p className="offer-availability">{t.availability}</p>
    </section>
    <section className="section-shell offer-plans" aria-label={t.plans}>
      {launchOffer.plans.map((plan, index) => <article className="offer-card"
        aria-label={plan.label} key={plan.key}>
        <div className="offer-card-heading"><h2>{plan.label}</h2>
          {index === 0 && <span>{t.startHere}</span>}</div>
        <p className="offer-price"><strong>{usdPrice(plan.usdCents, locale)}</strong> {t.month}</p>
        <p className="offer-computers">{t.computers(plan.computers)}</p>
        <p className="offer-description">{t.descriptions[index]}</p>
        <a className="button button-primary" href={action.href}>{action.label}</a>
        <small>{t.purchase}</small>
      </article>)}
    </section>
    <section className="section-shell offer-included">
      <h2>{t.includedTitle}</h2><p>{t.included}</p>
      <ul>{t.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <p className="offer-note">{t.integrationLimits}</p>
    </section>
    <section className="section-shell">
      <article className="offer-mac" aria-label="Mac Local">
        <div><p className="kicker">{t.oneTime}</p><h2>Mac Local</h2><p>{t.mac}</p></div>
        <div><p className="offer-price"><strong>{usdPrice(launchOffer.macLocal.usdCents, locale)}</strong> {t.once}</p>
          <a className="button button-secondary" href={localizedProductPath("/mac", locale)}>{t.macAction}</a></div>
      </article>
    </section>
    <section className="section-shell offer-faq">
      <h2>{t.faqTitle}</h2>
      {t.faq.map(([question, answer]) => <details key={question}>
        <summary>{question}</summary><p>{answer}</p>
      </details>)}
    </section>
    <section className="section-shell offer-terms">
      <h2>{t.termsTitle}</h2><p>{t.trial}</p><p>{t.billing}</p><p>{t.localPrice}</p>
      <nav aria-label={t.termsTitle}>{[["/terms", t.terms], ["/privacy", t.privacy], ["/support", t.help]].map(([path, label]) =>
        <a key={path} href={localizedProductPath(path, locale)}>{label}</a>)}</nav>
      <p className="offer-note">{t.updated} <time dateTime="2026-10-16">2026-10-16</time></p>
    </section>
    <SiteFooter locale={locale} />
  </main>;
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LocaleLinks, SiteFooter, SiteHeader } from "../components/SiteChrome";
import {
  appStoreId, availabilityNote, installationAction, localizedProductPath, releaseAvailability,
} from "../ProductOffer";
import { breadcrumbData, jsonLd, pageLocale, siteOrigin, type PublicPageProps } from "../SearchMetadata";
import { metadataForPage } from "../SearchMetadata/pages";
import { iphoneCopy, iphoneScreens } from "./copy";

const capture = (file: string) => `/product/${file}.png?v=20261012-179`;

export async function generateMetadata(props: PublicPageProps = {}): Promise<Metadata> {
  const locale = await pageLocale(props);
  const t = iphoneCopy[locale];
  const metadata = await metadataForPage("/iphone", props);
  // Safari's Smart App Banner only makes sense once Apple has published the app.
  const banner = releaseAvailability.ios.storeURL ? { other: { "apple-itunes-app": `app-id=${appStoreId}` } } : {};
  return { ...metadata, title: { absolute: t.seoTitle }, ...banner };
}

function structuredData(locale: "en" | "ru") {
  const t = iphoneCopy[locale];
  const store = releaseAvailability.ios.storeURL;
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "MobileApplication", "@id": `${siteOrigin}/iphone#app`, name: "GrantTap", url: `${siteOrigin}/iphone`,
      operatingSystem: "iOS 15.0 or later; iPadOS 15.0 or later", applicationCategory: "DeveloperApplication",
      applicationSubCategory: "Productivity", description: t.description, inLanguage: ["en", "ru"],
      softwareVersion: releaseAvailability.ios.version, screenshot: iphoneScreens.map(s => siteOrigin + capture(s.file)),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      ...(store ? { downloadUrl: store, installUrl: store } : {}),
      publisher: { "@id": `${siteOrigin}/#organization` } },
    { "@type": "FAQPage", mainEntity: t.faq.map(([question, answer]) => ({ "@type": "Question", name: question,
      acceptedAnswer: { "@type": "Answer", text: answer } })) },
    breadcrumbData([{ name: "GrantTap", path: "/" }, { name: t.title, path: "/iphone" }]),
  ] };
}

export default async function IPhonePage(props: PublicPageProps = {}) {
  const locale = await pageLocale(props);
  const t = iphoneCopy[locale];
  const action = installationAction(locale, "ios");
  return <main lang={locale} className="mac-page iphone-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData(locale)) }} />
    <SiteHeader locale={locale} active="iphone" languageControl={<LocaleLinks locale={locale} path="/iphone" />} />
    <section className="section-shell mac-page-intro">
      <p className="kicker">{t.kicker}</p><h1>{t.title}</h1><p>{t.intro}</p>
      <p className="mac-availability">{availabilityNote(locale, "ios")}</p>
      <div className="mac-page-links"><a className="button button-primary" href={action.href}>{action.label}</a>
        <Link href="/guide/quick-start">{t.guide} →</Link><a href={localizedProductPath("/pricing", locale)}>{t.pricing} →</a></div>
    </section>
    <section className="section-shell mac-page-connect">
      <h2>{t.featuresTitle}</h2>
      <div className="desktop-facts">{t.features.map(([title, detail], index) =>
        <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
    </section>
    <section className="section-shell mac-page-captures">
      <h2>{t.screensTitle}</h2><p>{t.screensNote}</p>
      <div className="iphone-page-gallery">{iphoneScreens.map(screen =>
        <figure key={screen.file}><a href={capture(screen.file)} target="_blank" rel="noopener noreferrer">
          <Image src={capture(screen.file)} alt={`GrantTap on iPhone: ${screen[locale]}`} width={1320} height={2868} loading="lazy" unoptimized />
        </a><figcaption>{screen[locale]}</figcaption></figure>)}</div>
    </section>
    <section className="section-shell mac-page-connect">
      <h2>{t.startTitle}</h2><ol>{t.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <h2>{t.priceTitle}</h2><p>{t.priceText}</p>
    </section>
    <section className="section-shell offer-faq">
      <h2>{t.faqTitle}</h2>
      {t.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}
      <p className="iphone-page-legal"><a href={localizedProductPath("/privacy", locale)}>{t.privacy}</a></p>
    </section>
    <SiteFooter locale={locale} />
  </main>;
}

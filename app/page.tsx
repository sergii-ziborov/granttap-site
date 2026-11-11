import { HomeView } from "./components/HomeView";
import { copy } from "./homeCopy";
import { metadataForPage } from "./SearchMetadata/pages";
import { releaseAvailability } from "./ProductOffer";
import { jsonLd, pageLocale, siteOrigin, type PublicPageProps } from "./SearchMetadata";

export const dynamic = "force-dynamic";
export function generateMetadata(props: PublicPageProps = {}) { return metadataForPage("/", props); }

export default async function Home(props: PublicPageProps = {}) {
  const locale = await pageLocale(props);
  const structuredData = { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": `${siteOrigin}/#organization`, name: "GrantTap", url: siteOrigin,
      logo: `${siteOrigin}/brand/apple-touch-icon.png`, founder: { "@type": "Person", name: "Serhii Ziborov" } },
    { "@type": "WebSite", "@id": `${siteOrigin}/#website`, name: "GrantTap", url: siteOrigin,
      inLanguage: ["en", "ru"], publisher: { "@id": `${siteOrigin}/#organization` } },
    { "@type": "SoftwareApplication", name: "GrantTap", url: siteOrigin,
      operatingSystem: "iOS, iPadOS, macOS, watchOS", applicationCategory: "DeveloperApplication",
      description: copy[locale].hero, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      ...(releaseAvailability.ios.storeURL ? { installUrl: releaseAvailability.ios.storeURL } : {}),
      sameAs: [`${siteOrigin}/iphone`, `${siteOrigin}/mac`], publisher: { "@id": `${siteOrigin}/#organization` } },
  ] };
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
    <HomeView locale={locale} t={copy[locale]} /></>;
}

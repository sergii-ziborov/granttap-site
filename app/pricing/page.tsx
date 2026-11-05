import { PricingView } from "../ProductOffer/PricingView";
import { metadataForPage } from "../SearchMetadata/pages";
import { pageLocale, type PublicPageProps } from "../SearchMetadata";

export function generateMetadata(props: PublicPageProps = {}) { return metadataForPage("/pricing", props); }
export default async function PricingPage(props: PublicPageProps = {}) { return <PricingView initialLocale={await pageLocale(props)} />; }

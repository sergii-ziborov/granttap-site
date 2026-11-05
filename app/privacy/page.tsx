import { metadataForPage } from "../SearchMetadata/pages";
import { pageLocale, type PublicPageProps } from "../SearchMetadata";
import { LegalPage } from "../components/LegalPage";
import { documentProps } from "../ProductInformation";

export function generateMetadata(props: PublicPageProps = {}) { return metadataForPage("/privacy", props); }

export default async function Page(props: PublicPageProps = {}) { return <LegalPage initialLocale={await pageLocale(props)} {...documentProps("privacy")} />; }

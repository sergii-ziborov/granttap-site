import supportEN from "./Resources/Product-support-en.json";
import supportRU from "./Resources/Product-support-ru.json";
import termsEN from "./Resources/Product-terms-en.json";
import termsRU from "./Resources/Product-terms-ru.json";
import privacyEN from "./Resources/Product-privacy-en.json";
import privacyRU from "./Resources/Product-privacy-ru.json";
import licensesEN from "./Resources/Product-licenses-en.json";
import licensesRU from "./Resources/Product-licenses-ru.json";
import { localizedProductPath, monthlyPlansSummary, launchOffer, usdPrice, type OfferLocale } from "../ProductOffer";
import { pricingCopy } from "../ProductOffer/pricingCopy";
import { pricingDocument } from "./pricingDocument";

export type ProductDocumentName = "support" | "terms" | "privacy" | "licenses" | "pricing";
export type ProductDocument = { title: string; updated: string; intro: string; sections: {
  heading: string; paragraphs?: string[]; bullets?: string[];
  links?: { label: string; href: string }[];
  image?: { name: string; caption: string };
}[] };

const documents = {
  support: { en: supportEN, ru: supportRU }, terms: { en: termsEN, ru: termsRU },
  privacy: { en: privacyEN, ru: privacyRU }, licenses: { en: licensesEN, ru: licensesRU },
};

export function customerDocument(name: ProductDocumentName, locale: OfferLocale): ProductDocument {
  const source = name === "pricing" ? pricingDocument(locale) : documents[name][locale];
  const substitutions: Record<string, string> = {
    "{{MONTHLY_PLANS}}": monthlyPlansSummary(locale),
    "{{MAC_LOCAL_USD}}": usdPrice(launchOffer.macLocal.usdCents, locale),
  };
  const document = JSON.parse(JSON.stringify(source), (_key, value) => typeof value === "string"
    ? value.replace(/\{\{[A-Z_]+\}\}/g, token => substitutions[token] ?? token) : value) as ProductDocument;
  if (name === "support") {
    const contact = document.sections.pop()!;
    document.sections.push(...pricingCopy[locale].faq.map(([heading, answer]) =>
      ({ heading, paragraphs: [answer] })), contact);
  }
  for (const section of document.sections) {
    for (const link of section.links ?? []) {
      if (link.href.startsWith("/")) link.href = localizedProductPath(link.href, locale);
    }
  }
  return document;
}

export function documentProps(name: ProductDocumentName) {
  const en = customerDocument(name, "en"), ru = customerDocument(name, "ru");
  const date = new Date(en.updated + "T12:00:00Z");
  const formatted = (locale: string) => new Intl.DateTimeFormat(locale,
    { dateStyle: "long", timeZone: "UTC" }).format(date);
  return { title: { en: en.title, ru: ru.title }, updatedISO: en.updated,
    updated: { en: formatted("en-US"), ru: formatted("ru-RU") },
    intro: { en: en.intro, ru: ru.intro }, sections: { en: en.sections, ru: ru.sections } };
}

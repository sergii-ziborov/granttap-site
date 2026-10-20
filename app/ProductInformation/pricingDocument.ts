import { launchOffer, usdPrice, type OfferLocale } from "../ProductOffer";
import { pricingCopy } from "../ProductOffer/pricingCopy";
import { cancellationSupport } from "../ProductOffer/cancellationSupport";
import type { ProductDocument } from ".";

export function pricingDocument(locale: OfferLocale): ProductDocument {
  const t = pricingCopy[locale];
  return {
    title: locale === "en" ? "Pricing and connection modes" : "Тарифы и режимы подключения",
    updated: launchOffer.updatedOn, intro: t.availability,
    sections: [
      ...launchOffer.plans.map((plan, index) => ({ heading: plan.label,
        paragraphs: [`${usdPrice(plan.usdCents, locale)} ${t.month}. ${t.computers(plan.computers)}.`,
          t.descriptions[index]] })),
      { heading: t.includedTitle, paragraphs: [t.included, t.integrationLimits], bullets: t.features },
      { heading: `Mac Local — ${usdPrice(launchOffer.macLocal.usdCents, locale)} ${t.once}`,
        paragraphs: [t.mac] },
      ...t.faq.map(([heading, answer]) => heading === cancellationSupport(locale).heading
        ? cancellationSupport(locale) : { heading, paragraphs: [answer] }),
      { heading: t.termsTitle, paragraphs: [t.trial, t.billing, t.localPrice], links: [
        { label: t.terms, href: "/terms" }, { label: t.privacy, href: "/privacy" },
        { label: t.help, href: "/support" },
      ] },
    ],
  };
}

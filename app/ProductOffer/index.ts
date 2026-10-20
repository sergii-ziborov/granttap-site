export type OfferLocale = "en" | "ru";

/** Display catalog. Only Apple-verified receipts grant account entitlements. */
export const launchOffer = {
  version: "first-launch-2026-10-20", updatedOn: "2026-10-20", currency: "USD", billingPeriod: "month",
  plans: [
    { key: "personal", label: "Personal", usdCents: 499, computers: 2,
      productId: "com.ziborov.granttap.personal.solo.monthly" },
    { key: "personal_plus", label: "Personal Plus", usdCents: 799, computers: 5,
      productId: "com.ziborov.granttap.personal.monthly" },
    { key: "fleet", label: "Fleet", usdCents: 1399, computers: 15,
      productId: "com.ziborov.granttap.personal.studio.monthly" },
  ],
  macLocal: { label: "Mac Local", usdCents: 3999, billingPeriod: "one_time",
    productId: "com.ziborov.granttap.mac.license" },
} as const;

/** Store availability is verified separately from copy and prices. */
export const releaseAvailability = {
  checkedOn: "2026-10-16",
  ios: { state: "invitation", storeURL: null as string | null },
  mac: { state: "invitation", storeURL: null as string | null },
  managedPurchases: "planned", macLocalPurchase: "planned",
} as const;

export function localizedProductPath(path: string, locale: OfferLocale): string {
  if (locale === "en") return path;
  const url = new URL(path, "https://granttap.com");
  url.searchParams.set("lang", "ru");
  return url.pathname + url.search + url.hash;
}

export function usdPrice(cents: number, locale: OfferLocale = "en"): string {
  return `$${(cents / 100).toFixed(2).replace(".", locale === "ru" ? "," : ".")}`;
}

export function installationAction(locale: OfferLocale, platform: "ios" | "mac" = "ios") {
  const url = releaseAvailability[platform].storeURL;
  return url
    ? { href: url, label: locale === "ru" ? "Установить приложение" : "Install the app" }
    : { href: localizedProductPath("/support#contact", locale),
      label: locale === "ru" ? "Запросить приглашение" : "Request an invitation" };
}

export function monthlyPlansSummary(locale: OfferLocale): string {
  return launchOffer.plans.map(plan => locale === "ru"
    ? `${plan.label}: ${usdPrice(plan.usdCents, locale)} в месяц — до ${plan.computers} компьютеров`
    : `${plan.label}: ${usdPrice(plan.usdCents)} per month — up to ${plan.computers} computers`).join("; ") + ".";
}

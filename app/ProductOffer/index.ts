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

export type StoreState = "invitation" | "review" | "live";

/** App Store Connect record shared by the iPhone, iPad and Mac apps. */
export const appStoreId = "6809739366";
export const appStoreListingURL = `https://apps.apple.com/app/id${appStoreId}`;

/**
 * Store availability is verified separately from copy and prices. After Apple
 * publishes a version, set its state to "live" and storeURL to appStoreListingURL.
 */
export const releaseAvailability = {
  checkedOn: "2026-11-11",
  ios: { state: "review" as StoreState, storeURL: null as string | null, submittedOn: "2026-11-11", version: "1.0" },
  mac: { state: "invitation" as StoreState, storeURL: null as string | null, submittedOn: null as string | null, version: "1.0" },
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
    ? { href: url, label: locale === "ru" ? "Загрузить в App Store" : "Download on the App Store" }
    : { href: localizedProductPath("/support#contact", locale),
      label: locale === "ru" ? "Запросить приглашение" : "Request an invitation" };
}

function calendarDate(day: string | null, locale: OfferLocale): string {
  if (!day) return "";
  return new Date(`${day}T12:00:00Z`).toLocaleDateString(locale === "ru" ? "ru-RU" : "en-US",
    { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).replace(/\s*г\.$/, "");
}

/** One honest sentence about where a platform can be installed today. */
export function availabilityNote(locale: OfferLocale, platform: "ios" | "mac" = "ios"): string {
  const release = releaseAvailability[platform];
  const device = platform === "mac" ? "Mac" : locale === "ru" ? "iPhone и iPad" : "iPhone and iPad";
  if (release.storeURL) return locale === "ru"
    ? `GrantTap ${release.version} для ${device} — бесплатная загрузка в App Store. Подписки и Mac Local оформляются через Apple.`
    : `GrantTap ${release.version} for ${device} is a free download on the App Store. Subscriptions and Mac Local are purchased through Apple.`;
  if (release.state === "review") return locale === "ru"
    ? `GrantTap ${release.version} для ${device} отправлен в App Review ${calendarDate(release.submittedOn, locale)}. Пока Apple его не опубликует, сборки доступны по приглашению в TestFlight.`
    : `GrantTap ${release.version} for ${device} was submitted to App Review on ${calendarDate(release.submittedOn, locale)}. Until Apple publishes it, builds are available by TestFlight invitation.`;
  return locale === "ru"
    ? `GrantTap для ${device} доступен по приглашению в TestFlight. Первый коммерческий релиз готовится.`
    : `GrantTap for ${device} is available by TestFlight invitation. The first commercial release is being prepared.`;
}

export function monthlyPlansSummary(locale: OfferLocale): string {
  return launchOffer.plans.map(plan => locale === "ru"
    ? `${plan.label}: ${usdPrice(plan.usdCents, locale)} в месяц — до ${plan.computers} компьютеров`
    : `${plan.label}: ${usdPrice(plan.usdCents)} per month — up to ${plan.computers} computers`).join("; ") + ".";
}

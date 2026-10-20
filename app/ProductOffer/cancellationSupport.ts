import type { OfferLocale } from ".";

/** The same cancellation and feedback instructions are bundled in the native apps. */
const copy = {
  "en": {
    "heading": "What remains after cancellation?",
    "paragraphs": [
      "Paid access continues until the stated date unless the entitlement is separately revoked. Downloaded local history, chats and images are not deleted. A purchased Mac Local license remains valid.",
      "Open Settings → Subscription → Manage or cancel in the app, or Manage or cancel with Apple in your account on the website. The Apple settings link is available immediately. Cancel a free trial at least 24 hours before it ends to avoid renewal.",
      "Eligible existing subscribers can check the app for one month at about half the regular monthly price, once per GrantTap account. Apple confirms the localized promotional price and the regular monthly renewal before purchase. Offer availability is checked with Apple; TestFlight keeps full free access.",
      "You can optionally choose a reason or send a comment. Feedback is separate from cancellation, is encrypted at rest, is kept for up to 90 days, and is removed with your account."
    ],
    "links": [
      {
        "label": "Manage subscriptions with Apple",
        "href": "https://apps.apple.com/account/subscriptions"
      }
    ]
  },
  "ru": {
    "heading": "Что останется после отмены?",
    "paragraphs": [
      "Оплаченный доступ действует до указанной даты, если право отдельно не отозвано. Полученные локальные чаты, история и изображения не удаляются. Купленная Mac Local остаётся действительной.",
      "В приложении откройте Settings → Subscription → Управление или отмена; на сайте — управление подпиской в своём аккаунте. Ссылка на настройки Apple доступна сразу. Чтобы пробная подписка не продлилась, отмените её минимум за 24 часа до окончания.",
      "Подписчики, соответствующие условиям Apple, могут проверить в приложении предложение на один месяц примерно за половину обычной месячной цены — один раз на аккаунт GrantTap. Перед покупкой Apple покажет местную цену скидки и обычное месячное продление. Доступность предложения проверяется с Apple. TestFlight сохраняет полный бесплатный доступ.",
      "По желанию выберите причину или отправьте комментарий. Отзыв не требуется для отмены. Он зашифрован при хранении, сохраняется до 90 дней и удаляется вместе с аккаунтом."
    ],
    "links": [
      {
        "label": "Управление подписками Apple",
        "href": "https://apps.apple.com/account/subscriptions"
      }
    ]
  }
};

export function cancellationSupport(locale: OfferLocale) { return copy[locale]; }

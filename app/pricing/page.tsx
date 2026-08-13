import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Pricing and subscriptions",
  description: "GrantTap subscription pricing, free trial, computer limits, and future local-network mode.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <LegalPage
      title={{ en: "Pricing and subscriptions", ru: "Тарифы и подписка" }}
      updated={{ en: "August 13, 2026", ru: "13 августа 2026" }}
      updatedISO="2026-08-13"
      intro={{
        en: "Start with a 7-day free trial. The planned Personal subscription is $2.99 per month for up to 3 linked computers, billed through Apple's App Store.",
        ru: "Начните с 7 бесплатных дней. Планируемая подписка Personal стоит $2,99 в месяц и поддерживает до 3 подключённых компьютеров; оплату обрабатывает App Store.",
      }}
      sections={{
        en: [
          { heading: "Personal", bullets: [
            "7-day free trial for eligible new subscribers.",
            "$2.99 per month after the trial, for up to 3 linked computers.",
            "iPhone and Apple Watch remote, encrypted relay delivery, multi-computer queue, and supported provider integrations.",
            "Cancel in Apple subscription settings at least 24 hours before renewal to avoid the next charge.",
          ] },
          { heading: "More computers", paragraphs: [
            "A higher-capacity plan for more than 3 computers is planned. Its price and limits will be shown before purchase; this page does not promise an unpublished price.",
          ] },
          { heading: "Future same-Wi-Fi mode", paragraphs: [
            "A local transport for phone, watch, and computer on the same Wi-Fi is planned. It is not available yet. The first version is intended for direct local delivery only, with no server synchronization or remote history sync.",
          ] },
          { heading: "Billing", paragraphs: [
            "Payment is charged to your Apple Account after trial confirmation. The subscription renews automatically unless cancelled at least 24 hours before the current period ends. Apple manages billing, taxes, refunds, and subscription settings.",
          ], links: [
            { label: "Manage Apple subscriptions", href: "https://support.apple.com/118428" },
            { label: "Terms of Use", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
          ] },
        ],
        ru: [
          { heading: "Personal", bullets: [
            "7-дневный бесплатный пробный период для подходящих новых подписчиков.",
            "$2,99 в месяц после пробного периода, до 3 подключённых компьютеров.",
            "Пульт на iPhone и Apple Watch, зашифрованная relay-доставка, очередь для нескольких компьютеров и поддерживаемые интеграции агентов.",
            "Отмените подписку в настройках Apple не позднее чем за 24 часа до продления, чтобы избежать следующего списания.",
          ] },
          { heading: "Больше компьютеров", paragraphs: [
            "Планируется тариф для более чем 3 компьютеров. Цена и лимиты будут показаны до покупки; эта страница не обещает ещё не опубликованную цену.",
          ] },
          { heading: "Будущий режим в одной Wi-Fi сети", paragraphs: [
            "Планируется локальный транспорт между телефоном, часами и компьютером в одной Wi-Fi сети. Сейчас он недоступен. Первая версия задумана только для прямой локальной доставки, без серверной синхронизации и удалённой синхронизации истории.",
          ] },
          { heading: "Оплата", paragraphs: [
            "После подтверждения пробного периода оплата списывается с Apple Account. Подписка продлевается автоматически, если не отменить её минимум за 24 часа до конца периода. Apple управляет оплатой, налогами, возвратами и настройками подписки.",
          ], links: [
            { label: "Управление подписками Apple", href: "https://support.apple.com/118428" },
            { label: "Условия использования", href: "/terms" },
            { label: "Политика конфиденциальности", href: "/privacy" },
          ] },
        ],
      }}
    />
  );
}

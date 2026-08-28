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
        en: "Start with a 7-day free trial. Personal is priced by how many computers you link — $1.99 for one, $3.99 for five, $5.99 for ten per month — billed through Apple's App Store. Agents on each computer are unlimited.",
        ru: "Начните с 7 бесплатных дней. Personal тарифицируется по числу подключённых компьютеров: $1,99 за один, $3,99 за пять, $5,99 за десять в месяц; оплату обрабатывает App Store. Агентов на каждом компьютере — без ограничений.",
      }}
      sections={{
        en: [
          { heading: "Personal", bullets: [
            "7-day free trial for eligible new subscribers.",
            "$1.99 per month for 1 computer, $3.99 for up to 5, $5.99 for up to 10.",
            "Every computer runs as many coding agents as it can; agents are never counted or charged for.",
            "iPhone and Apple Watch remote, encrypted relay delivery, multi-computer queue, and supported provider integrations.",
            "Cancel in Apple subscription settings at least 24 hours before renewal to avoid the next charge.",
          ] },
          { heading: "Changing tier", paragraphs: [
            "Tiers differ only by linked computers. Move between them in Apple subscription settings; Apple prorates the change and shows the exact amount before it is confirmed.",
          ] },
          { heading: "Future same-Wi-Fi mode", paragraphs: [
            "A free local mode for phone, watch, and computer on the same Wi-Fi is planned. It is not available yet. The first version is intended for direct local delivery only, with no server synchronization or remote history sync.",
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
            "$1,99 в месяц за 1 компьютер, $3,99 — до 5, $5,99 — до 10.",
            "На каждом компьютере запускается сколько угодно coding agents; агенты не считаются и не тарифицируются.",
            "Пульт на iPhone и Apple Watch, зашифрованная relay-доставка, очередь для нескольких компьютеров и поддерживаемые интеграции агентов.",
            "Отмените подписку в настройках Apple не позднее чем за 24 часа до продления, чтобы избежать следующего списания.",
          ] },
          { heading: "Смена тарифа", paragraphs: [
            "Тарифы отличаются только числом подключённых компьютеров. Переключайтесь в настройках подписок Apple: Apple пересчитает разницу и покажет точную сумму до подтверждения.",
          ] },
          { heading: "Будущий режим в одной Wi-Fi сети", paragraphs: [
            "Планируется бесплатный локальный режим между телефоном, часами и компьютером в одной Wi-Fi сети. Сейчас он недоступен. Первая версия задумана только для прямой локальной доставки, без серверной синхронизации и удалённой синхронизации истории.",
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

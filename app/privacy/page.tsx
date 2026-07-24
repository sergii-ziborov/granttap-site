import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GrantTap handles encrypted activity, device data, and permissions.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={{ en: "Privacy Policy", ru: "Политика конфиденциальности" }}
      updated={{ en: "July 24, 2026", ru: "24 июля 2026" }}
      intro={{
        en: "GrantTap is designed so the relay can deliver your data without being able to read its contents.",
        ru: "GrantTap устроен так, чтобы relay мог доставлять данные, не имея возможности прочитать их содержимое.",
      }}
      sections={{
        en: [
          {
            heading: "Data handled by the app",
            bullets: [
              "Pairing identifiers and encryption keys are created and stored on your paired devices.",
              "Visible agent messages, commands, questions, replies, and approval decisions are end-to-end encrypted before leaving a device.",
              "The relay may temporarily queue encrypted envelopes until delivery or expiry.",
              "The app stores local preferences, session state, and pairing details needed to operate.",
            ],
          },
          {
            heading: "What the relay can observe",
            paragraphs: [
              "Cloudflare and the GrantTap relay can process operational metadata such as IP address, connection time, room identifier, sender and recipient roles, payload size, and expiry. The relay does not receive the secret keys needed to decrypt message contents.",
            ],
          },
          {
            heading: "Camera, microphone, and speech recognition",
            paragraphs: [
              "Camera access is used only to scan a pairing QR code. Microphone and speech-recognition access are used only when you choose voice reply. GrantTap requests on-device recognition when the device supports it; otherwise Apple’s speech service may process audio under Apple’s terms.",
            ],
          },
          {
            heading: "Analytics, advertising, and tracking",
            paragraphs: [
              "GrantTap does not include advertising SDKs, cross-app tracking, or product analytics. The public website may be protected and logged by Cloudflare for security and delivery.",
            ],
          },
          {
            heading: "Retention and deletion",
            paragraphs: [
              "Encrypted relay messages have explicit expirations and bounded queues. Pairing blobs expire after 15 minutes and are single-use. Remove the app and delete ~/.granttap on the paired computer to remove local GrantTap state.",
            ],
          },
          {
            heading: "Questions",
            links: [
              { label: "Support", href: "/support" },
              { label: "Audit the public relay", href: "https://github.com/sergii-ziborov/granttap-relay" },
            ],
          },
        ],
        ru: [
          {
            heading: "Какие данные обрабатывает приложение",
            bullets: [
              "Идентификаторы пейринга и ключи шифрования создаются и хранятся на ваших устройствах.",
              "Видимые сообщения агента, команды, вопросы, ответы и решения шифруются до отправки с устройства.",
              "Relay может временно хранить зашифрованные конверты до доставки или истечения срока.",
              "Приложение локально хранит настройки, состояние сессий и данные пейринга.",
            ],
          },
          {
            heading: "Что может видеть relay",
            paragraphs: [
              "Cloudflare и relay GrantTap могут обрабатывать служебные метаданные: IP-адрес, время соединения, идентификатор комнаты, роли отправителя и получателя, размер и срок сообщения. Секретных ключей для расшифровки у relay нет.",
            ],
          },
          {
            heading: "Камера, микрофон и распознавание речи",
            paragraphs: [
              "Камера нужна только для QR-кода пейринга. Микрофон и распознавание включаются только для голосового ответа. GrantTap запрашивает локальное распознавание, когда оно доступно; иначе звук может обрабатываться сервисом Apple по условиям Apple.",
            ],
          },
          {
            heading: "Аналитика, реклама и трекинг",
            paragraphs: [
              "В GrantTap нет рекламных SDK, межприложенческого трекинга или продуктовой аналитики. Cloudflare может вести технические журналы сайта для защиты и доставки.",
            ],
          },
          {
            heading: "Хранение и удаление",
            paragraphs: [
              "Сообщения relay имеют срок жизни и ограниченную очередь. Блобы пейринга одноразовые и истекают через 15 минут. Для удаления локального состояния удалите приложение и папку ~/.granttap на спаренном компьютере.",
            ],
          },
          {
            heading: "Вопросы",
            links: [
              { label: "Поддержка", href: "/support" },
              { label: "Публичный код relay", href: "https://github.com/sergii-ziborov/granttap-relay" },
            ],
          },
        ],
      }}
    />
  );
}

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
      updated={{ en: "August 1, 2026", ru: "1 августа 2026" }}
      intro={{
        en: "GrantTap is designed so the relay can deliver your data without being able to read its contents.",
        ru: "GrantTap устроен так, чтобы relay мог доставлять данные, не имея возможности прочитать их содержимое.",
      }}
      sections={{
        en: [
          {
            heading: "Data handled by the app",
            bullets: [
              "Pairing uses a random mailbox id and an independent 256-bit transfer key. Only the mailbox id reaches the relay; endpoint and per-task keys are created and stored on paired devices.",
              "Visible agent messages, commands, questions, replies, and approval decisions are end-to-end encrypted before leaving a device.",
              "The relay may temporarily queue encrypted envelopes until delivery or expiry.",
              "For background delivery, the authenticated relay room stores the APNs device token, environment, bundle identifier, and update time. Apple treats the retained token as a Device ID used for App Functionality. It is linked to the device, never used for tracking, and removed on unpairing or when APNs reports it stale.",
              "The app stores local preferences, session state, and pairing details needed to operate.",
            ],
          },
          {
            heading: "What the relay can observe",
            paragraphs: [
              "Cloudflare and the GrantTap relay process operational metadata such as IP address, connection time, opaque room/mailbox and delivery identifiers, sender and recipient roles, ciphertext size, expiry, APNs device token/environment, and a content-neutral wake flag only as needed to deliver and protect the service. GrantTap does not use this metadata for advertising, profiling, or product analytics. APNs wakes contain no task kind, request id, delivery id, command, prompt, path, task title, or message body. A Cloudflare account or database compromise does not provide the endpoint, transfer, or per-task keys needed to decrypt content.",
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
            heading: "Face ID and local audit log",
            paragraphs: [
              "If you enable the app lock, iOS verifies the device owner with Face ID, Touch ID, or the device passcode. GrantTap receives only the result and never receives or stores biometric data. The bounded audit log and local task archives stay on the iPhone under iOS data protection and can be cleared by the owner.",
            ],
          },
          {
            heading: "Retention and deletion",
            paragraphs: [
              "Encrypted relay messages have explicit expirations and bounded queues and are not retained as a readable account history. Pairing blobs expire after 15 minutes and are single-use. GrantTap does not retain voice recordings. Use Settings → Forget pairing, remove the app, and delete ~/.granttap on the paired computer to remove local GrantTap state.",
            ],
          },
          {
            heading: "Questions",
            paragraphs: ["Contact: sergii.ziborov@gmail.com."],
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
              "Пейринг использует случайный mailbox ID и независимый 256-битный transfer key. Relay получает только mailbox ID; ключи устройств и отдельных задач создаются и хранятся на спаренных устройствах.",
              "Видимые сообщения агента, команды, вопросы, ответы и решения шифруются до отправки с устройства.",
              "Relay может временно хранить зашифрованные конверты до доставки или истечения срока.",
              "Для фоновой доставки защищённая комната relay хранит APNs-токен устройства, среду, bundle ID и время обновления. По классификации Apple это Device ID для работы приложения: он связан с устройством, не используется для трекинга и удаляется при отключении пейринга или ответе APNs о недействительности.",
              "Приложение локально хранит настройки, состояние сессий и данные пейринга.",
            ],
          },
          {
            heading: "Что может видеть relay",
            paragraphs: [
              "Cloudflare и relay GrantTap обрабатывают только служебные метаданные: IP, время, непрозрачные идентификаторы комнаты/mailbox/delivery, роли маршрутизации, размер шифротекста, срок, APNs-токен и среду, а также нейтральный wake-флаг. Они не используются для рекламы, профилирования или аналитики. APNs не содержит тип задачи, request/delivery ID, команду, промпт, путь, название или текст. Доступ к аккаунту Cloudflare или базе не даёт ключей устройства, transfer key или отдельных ключей задач.",
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
            heading: "Face ID и локальный журнал действий",
            paragraphs: [
              "Если вы включили блокировку, iOS проверяет владельца через Face ID, Touch ID или код-пароль устройства. GrantTap получает только результат и не получает и не хранит биометрические данные. Ограниченный журнал действий и локальный архив задач остаются на iPhone под защитой данных iOS и могут быть очищены владельцем.",
            ],
          },
          {
            heading: "Хранение и удаление",
            paragraphs: [
              "Сообщения relay имеют срок жизни и ограниченную очередь и не сохраняются как читаемая история аккаунта. Блобы пейринга одноразовые и истекают через 15 минут. GrantTap не хранит голосовые записи. Для удаления локального состояния выберите «Забыть пейринг», удалите приложение и папку ~/.granttap на спаренном компьютере.",
            ],
          },
          {
            heading: "Вопросы",
            paragraphs: ["Контакт: sergii.ziborov@gmail.com."],
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

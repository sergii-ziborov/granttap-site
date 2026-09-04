import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GrantTap Personal handles encrypted task traffic, local data, relay metadata, Apple services, retention, and deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage
    title={{ en: "Privacy Policy", ru: "Политика конфиденциальности" }}
    updated={{ en: "September 4, 2026", ru: "4 сентября 2026" }}
    updatedISO="2026-09-04"
    intro={{
      en: "This policy covers the GrantTap Personal iPhone and Apple Watch app, its local machine helper, the encrypted relay, and granttap.com. GrantTap creates no advertising profile or readable cloud chat history.",
      ru: "Эта политика относится к GrantTap Personal для iPhone и Apple Watch, локальному helper, зашифрованному relay и granttap.com. GrantTap не создаёт рекламный профиль или читаемую облачную историю чатов.",
    }}
    sections={{
      en: [
        {
          heading: "Privacy at a glance",
          bullets: [
            "GrantTap Personal requires no username or password.",
            "Repositories, provider credentials, model prompts, and model traffic do not pass through the GrantTap relay.",
            "Task messages, commands, questions, attachments, replies, and decisions are end-to-end encrypted before leaving an authorized endpoint.",
            "GrantTap does not sell personal data or use app data for advertising, tracking, productivity scoring, or profiling.",
          ],
        },
        {
          heading: "Data processed to provide the app",
          bullets: [
            "Pairing uses a random mailbox identifier and a single-use encrypted blob. The independent transfer key remains in the QR or manual token and never reaches the relay.",
            "Delivery uses opaque room, task, message, and delivery identifiers; sender and recipient roles; timing; ciphertext size; expiry; delivery status; and retry state.",
            "Cloudflare may process IP address and ordinary security request data to operate the relay and website.",
            "Background delivery stores an APNs device token, environment, bundle identifier, and update time. Push payloads contain no prompt, command, title, path, request identifier, or message body.",
          ],
        },
        {
          heading: "Encrypted content and local storage",
          paragraphs: [
            "The relay receives authenticated ciphertext and a nonce, not readable task content. Pairing and per-task keys are created locally and are absent from relay code, storage, logs, and secrets. Each task has an independent key.",
            "Readable content exists only on the computer and Apple devices you authorize, plus tools you explicitly use there. GrantTap does not proxy provider model traffic.",
          ],
          bullets: [
            "The app stores keys, preferences, delivery state, hidden/history state, a bounded local audit, and capability usage in protected local storage.",
            "The helper stores local pairing and provider integration configuration under ~/.granttap.",
            "Project Mesh uses one additional key per Project. The phone hands it only to computers you have already paired, inside the pairing encryption they already use, so shared task state, Governance policy, and cost figures travel as ciphertext like everything else.",
            "Report a problem composes its text on your device and hands it to the system share sheet. The report contains no keys, tokens, chat content, or commands, and the app itself sends nothing.",
            "Camera, photos, files, microphone, speech recognition, biometrics, and notifications are used only for the features you explicitly invoke or enable.",
          ],
        },
        {
          heading: "Retention, deletion, and your choices",
          paragraphs: [
            "Pairing blobs expire after 15 minutes and are single-use. Encrypted offline queues are bounded and expire. Local data remains until you clear it, unlink a computer, reset pairing, or remove the app/helper.",
            "You may decline optional system permissions. Depending on applicable law, you may request access, correction, deletion, restriction, portability, or objection for data GrantTap can identify and control. Because Personal has no identity index and the relay cannot decrypt payloads, no readable task record may exist for a centralized identity search.",
          ],
          links: [
            { label: "Manage or delete data", href: "/data-rights" },
            { label: "Email privacy support", href: "mailto:sergii.ziborov@gmail.com" },
          ],
        },
        {
          heading: "Service providers, website, and changes",
          paragraphs: [
            "Cloudflare provides network, Worker, Durable Object, and website infrastructure. Apple provides APNs, system speech and biometric APIs, and App Store services under Apple's terms. Neither receives GrantTap decryption keys from the app.",
            "granttap.com stores only your language choice locally and uses no advertising or product analytics. Material policy changes will be posted here with a new effective date.",
          ],
        },
      ],
      ru: [
        {
          heading: "Коротко",
          bullets: [
            "GrantTap Personal не требует имени пользователя или пароля.",
            "Репозитории, provider credentials, prompts модели и model traffic не проходят через relay GrantTap.",
            "Сообщения, команды, вопросы, вложения, ответы и решения шифруются до отправки с разрешённого endpoint.",
            "GrantTap не продаёт данные и не использует их для рекламы, tracking, productivity scoring или профилирования.",
          ],
        },
        {
          heading: "Данные для работы приложения",
          bullets: [
            "Пейринг использует случайный mailbox ID и одноразовый зашифрованный blob. Независимый transfer key остаётся в QR или ручном token и не поступает в relay.",
            "Для доставки обрабатываются непрозрачные IDs комнаты, задачи, сообщения и доставки, роли, время, размер шифротекста, expiry, status и retry state.",
            "Cloudflare может обрабатывать IP и обычные security request data для работы relay и сайта.",
            "Фоновая доставка хранит APNs device token, environment, bundle ID и время обновления. Push не содержит prompt, command, title, path, request ID или message body.",
          ],
        },
        {
          heading: "Шифротекст и локальное хранение",
          paragraphs: [
            "Relay получает аутентифицированный шифротекст и nonce, а не читаемое содержимое. Pairing и per-task keys создаются локально и отсутствуют в коде, storage, logs и secrets relay. У каждой задачи свой ключ.",
            "Читаемое содержимое существует только на разрешённых компьютере и Apple devices, а также в явно выбранных вами tools. GrantTap не проксирует model traffic providers.",
          ],
          bullets: [
            "Приложение локально хранит keys, preferences, delivery state, history/hidden state, ограниченный audit и capability usage.",
            "Helper хранит pairing и provider integration configuration в ~/.granttap.",
            "Project Mesh использует один дополнительный ключ на Project. Телефон передаёт его только уже связанным компьютерам внутри их pairing-шифрования, поэтому общее состояние задач, политика Governance и данные о стоимости идут шифротекстом, как и всё остальное.",
            "«Сообщить о проблеме» составляет текст на устройстве и передаёт его системному share sheet. Отчёт не содержит ключей, токенов, содержимого чатов и команд; само приложение ничего не отправляет.",
            "Камера, фото, файлы, микрофон, speech recognition, biometrics и notifications используются только для явно запущенных или включённых функций.",
          ],
        },
        {
          heading: "Срок, удаление и ваш выбор",
          paragraphs: [
            "Pairing blobs одноразовые и истекают через 15 минут. Зашифрованные offline queues ограничены и истекают. Локальные данные остаются до очистки, unlink компьютера, reset pairing или удаления приложения/helper.",
            "Необязательные системные разрешения можно отклонить. По применимому праву вы можете запросить доступ, исправление или удаление данных, которые GrantTap способен определить и контролировать. У Personal нет identity index, а relay не расшифровывает payloads, поэтому централизованной читаемой записи задачи может не существовать.",
          ],
          links: [
            { label: "Управление и удаление данных", href: "/data-rights" },
            { label: "Написать по вопросам данных", href: "mailto:sergii.ziborov@gmail.com" },
          ],
        },
        {
          heading: "Инфраструктура, сайт и изменения",
          paragraphs: [
            "Cloudflare предоставляет network, Worker, Durable Object и website infrastructure. Apple предоставляет APNs, system speech и biometric APIs и App Store services по своим условиям. Ни один из них не получает GrantTap decryption keys из приложения.",
            "granttap.com хранит локально только выбор языка и не использует рекламу или product analytics. Существенные изменения политики публикуются здесь с новой датой.",
          ],
        },
      ],
    }}
  />;
}

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
    updated={{ en: "October 5, 2026", ru: "5 октября 2026" }}
    updatedISO="2026-10-05"
    intro={{
      en: "This policy covers the GrantTap Mac, iPhone, iPad and Apple Watch apps, its local machine helper, the encrypted relay, and granttap.com. GrantTap creates no advertising profile or readable cloud chat history.",
      ru: "Эта политика относится к GrantTap для Mac, iPhone, iPad и Apple Watch, локальному helper, зашифрованному relay и granttap.com. GrantTap не создаёт рекламный профиль или читаемую облачную историю чатов.",
    }}
    sections={{
      en: [
          { heading: "Mac and endpoint discovery", paragraphs: ["App Store purchase evidence is verified by StoreKit; we do not receive payment-card details. The native Mac keeps its separate local MCP access token in its device-only Keychain. Direct mode announces only authenticated encrypted endpoint records with opaque room and recipient identifiers, sizes and expiry. The managed directory cannot decrypt an address; network operators still observe connection IPs and timing. Directory records expire within 15 minutes. In fully self-hosted mode, pairing and chat traffic use your endpoint and do not contact that directory. You administer your own server logs, queues and retention."] },
        {
          heading: "Privacy at a glance",
          bullets: [
            "QR pairing requires no account. The optional account uses a passkey without a password.",
            "Repositories, provider credentials, model prompts, and model traffic do not pass through the GrantTap relay.",
            "Task messages, commands, questions, attachments, replies, and decisions are end-to-end encrypted before leaving an authorized endpoint.",
            "GrantTap does not sell personal data or use app data for advertising, tracking, productivity scoring, or profiling.",
          ],
        },
        {
          heading: "Data processed to provide the app",
          bullets: [
            "Pairing uses a random mailbox identifier and a single-use encrypted blob. The independent transfer key remains in the QR or manual token and never reaches the relay.",
            "If you use an account, the service stores a passkey public credential, account ID, computer name and identifier, a hash of the Mac credential, and last-seen time. A recovery request holds an ephemeral phone public key and encrypted offer for up to five minutes. The service cannot read the offered pairing key.",
            "Delivery uses opaque room, task, message, and delivery identifiers; sender and recipient roles; timing; ciphertext size; expiry; delivery status; and retry state.",
            "Hetzner hosts the current relay, website and account bridge and may process IP addresses and ordinary security request data. Cloudflare provides DNS and may process DNS request metadata.",
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
            "The app stores keys, preferences, delivery state, hidden/history state, a bounded local audit, and capability usage in protected local storage. Mac also stores fetched chat pages in a protected local archive. Clear this copy in Settings → This Mac → Chat history & cache without deleting provider history or device connections.",
            "The helper stores local pairing and provider integration configuration under ~/.granttap.",
            "Each Mesh has an additional key. The phone hands it only to computers you have already paired, inside the pairing encryption they already use, so shared Task state, Governance policy, and cost figures travel as ciphertext like everything else.",
            "Report a problem composes its text on your device and hands it to the system share sheet. The report contains no keys, tokens, chat content, or commands, and the app itself sends nothing.",
            "Camera, photos, files, microphone, speech recognition, biometrics, and notifications are used only for the features you explicitly invoke or enable.",
          ],
        },
        {
          heading: "Retention, deletion, and your choices",
          paragraphs: [
            "Pairing blobs expire after 15 minutes and are single-use. Encrypted offline queues are bounded and expire. Local data remains until you clear it, unlink a computer, reset pairing, or remove the app/helper.",
            "You may decline optional system permissions. Account devices can be revoked and the account deleted on the account page or from the Devices screen in the Apple app. Deleting the account does not remove QR pairings stored on your own devices or cancel an Apple subscription. Depending on applicable law, you may request access, correction, deletion, restriction, portability, or objection for data GrantTap can identify and control. The relay cannot decrypt task payloads or search their readable content by account.",
          ],
          links: [
            { label: "Manage or delete data", href: "/data-rights" },
            { label: "Email privacy support", href: "mailto:sergii.ziborov@gmail.com" },
          ],
        },
        {
          heading: "Service providers, website, and changes",
          paragraphs: [
            "Hetzner hosts the current relay, website and account bridge; Cloudflare provides DNS. Apple provides APNs, system speech and biometric APIs, and App Store services under Apple's terms. These providers do not receive GrantTap decryption keys from the app.",
            "The website stores your language choice locally and uses an HttpOnly session cookie when you sign in to an account. It uses no advertising or product analytics. Material policy changes will be posted here with a new effective date.",
          ],
        },
      ],
      ru: [
          { heading: "Mac и поиск адреса", paragraphs: ["Покупки App Store проверяет StoreKit; реквизиты платёжной карты нам недоступны. Mac хранит отдельный локальный токен MCP в Keychain только этого устройства. Прямой режим публикует лишь аутентифицированные зашифрованные записи адреса с непрозрачными идентификаторами комнаты и получателя, размерами и сроком действия. Каталог не может расшифровать адрес; сетевые операторы видят IP соединения и время. Записи истекают в пределах 15 минут. В автономном режиме пейринг и чат используют ваш endpoint без обращения к этому каталогу. Логами, очередями и сроками хранения своего сервера управляете вы."] },
        {
          heading: "Коротко",
          bullets: [
            "Для QR-пейринга аккаунт не нужен. Необязательный аккаунт использует passkey без пароля.",
            "Репозитории, provider credentials, prompts модели и model traffic не проходят через relay GrantTap.",
            "Сообщения, команды, вопросы, вложения, ответы и решения шифруются до отправки с разрешённого endpoint.",
            "GrantTap не продаёт данные и не использует их для рекламы, tracking, productivity scoring или профилирования.",
          ],
        },
        {
          heading: "Данные для работы приложения",
          bullets: [
            "Пейринг использует случайный mailbox ID и одноразовый зашифрованный blob. Независимый transfer key остаётся в QR или ручном token и не поступает в relay.",
            "При использовании аккаунта сервис хранит публичный ключ passkey, ID аккаунта, имя и ID компьютера, хеш токена Mac и время последнего подключения. Запрос восстановления содержит временный публичный ключ iPhone и зашифрованное предложение не более пяти минут. Сервис не может прочитать ключ подключения.",
            "Для доставки обрабатываются непрозрачные IDs комнаты, задачи, сообщения и доставки, роли, время, размер шифротекста, expiry, status и retry state.",
            "Hetzner размещает действующие relay, сайт и мост аккаунта и может обрабатывать IP и обычные технические данные запросов. Cloudflare предоставляет DNS и может обрабатывать метаданные DNS-запросов.",
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
            "Приложение локально хранит keys, preferences, delivery state, history/hidden state, ограниченный audit и capability usage. Mac также сохраняет загруженные страницы чата в защищённом локальном архиве. Очистить эту копию можно в Settings → This Mac → Chat history & cache, не удаляя историю провайдеров и соединения устройств.",
            "Helper хранит pairing и provider integration configuration в ~/.granttap.",
            "У каждого Mesh есть дополнительный ключ. Телефон передаёт его только уже связанным компьютерам внутри их pairing-шифрования, поэтому общее состояние задач, политика Governance и данные о стоимости идут шифротекстом, как и всё остальное.",
            "«Сообщить о проблеме» составляет текст на устройстве и передаёт его системному share sheet. Отчёт не содержит ключей, токенов, содержимого чатов и команд; само приложение ничего не отправляет.",
            "Камера, фото, файлы, микрофон, speech recognition, biometrics и notifications используются только для явно запущенных или включённых функций.",
          ],
        },
        {
          heading: "Срок, удаление и ваш выбор",
          paragraphs: [
            "Pairing blobs одноразовые и истекают через 15 минут. Зашифрованные offline queues ограничены и истекают. Локальные данные остаются до очистки, unlink компьютера, reset pairing или удаления приложения/helper.",
            "Необязательные системные разрешения можно отклонить. Устройства аккаунта можно отозвать, а аккаунт удалить на странице аккаунта или в экране подключения через passkey в приложении Apple. Удаление аккаунта не удаляет QR-подключения на ваших устройствах и не отменяет подписку Apple. По применимому праву вы можете запросить доступ, исправление или удаление данных, которые GrantTap способен определить и контролировать. Relay не расшифровывает содержимое задач и не ищет читаемый текст по аккаунту.",
          ],
          links: [
            { label: "Управление и удаление данных", href: "/data-rights" },
            { label: "Написать по вопросам данных", href: "mailto:sergii.ziborov@gmail.com" },
          ],
        },
        {
          heading: "Инфраструктура, сайт и изменения",
          paragraphs: [
            "Hetzner размещает действующие relay, сайт и мост аккаунта; Cloudflare предоставляет DNS. Apple предоставляет APNs, системные API речи и биометрии, а также App Store на своих условиях. Эти поставщики не получают ключи расшифровки GrantTap из приложения.",
            "Сайт хранит локально выбор языка и использует HttpOnly cookie сеанса при входе в аккаунт. Рекламы и аналитики продукта нет. Существенные изменения политики публикуются здесь с новой датой.",
          ],
        },
      ],
    }}
  />;
}

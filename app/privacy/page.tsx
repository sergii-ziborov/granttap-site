import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GrantTap handles local data, encrypted task traffic, relay metadata, Apple services, retention, and deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title={{ en: "Privacy Policy", ru: "Политика конфиденциальности" }}
      updated={{ en: "August 20, 2026", ru: "20 августа 2026" }}
      updatedISO="2026-08-20"
      intro={{
        en: "This policy covers the GrantTap iPhone and Apple Watch app, GrantTap Web, the encrypted relay, and granttap.com. Personal use needs no centralized identity account; managed Enterprise deployments may issue organization account and device records. GrantTap creates no advertising profile or readable cloud chat history.",
        ru: "Эта политика относится к GrantTap для iPhone и Apple Watch, GrantTap Web, зашифрованному relay и сайту granttap.com. Для Personal не нужен централизованный identity account; управляемый Enterprise может создавать записи аккаунта организации и устройства. GrantTap не создаёт рекламный профиль или читаемую облачную историю чатов.",
      }}
      sections={{
        en: [
          {
            heading: "Who is responsible and how to contact us",
            paragraphs: [
              "GrantTap is operated by its independent developer. For privacy questions or requests, use the support email below. Do not send pairing codes, room credentials, encryption keys, or real task content by email.",
            ],
            links: [
              { label: "Email privacy support", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "Manage or delete data", href: "/data-rights" },
            ],
          },
          {
            heading: "Privacy at a glance",
            bullets: [
              "Personal and QR-based GrantTap Web access require no username or password. A managed Enterprise deployment may process bounded organization, user, device, policy, and login-receipt metadata.",
              "Your repositories, model credentials, prompts sent directly to the model, and model traffic do not pass through the GrantTap relay.",
              "Task messages, commands, questions, attachments, replies, and approval decisions are end-to-end encrypted before they leave an authorized endpoint.",
              "GrantTap does not sell personal data or use app data for advertising or profiling.",
            ],
          },
          {
            heading: "Data processed to provide the app",
            bullets: [
              "Pairing: a random 128-bit mailbox identifier, a single-use encrypted pairing blob, and timestamps needed to complete pairing. The independent 256-bit transfer key stays in the QR or manual pairing token and is never sent to the relay.",
              "Delivery metadata: opaque room, task, message, and delivery identifiers; sender and recipient roles; connection time; ciphertext size; expiry; delivery status; and retry state.",
              "Network and security metadata: IP address and request information may be processed by Cloudflare to connect, protect, and operate the relay and website.",
              "Background delivery: the relay stores an APNs device token, sandbox or production environment, bundle identifier, and update time. The token is a device-level routing identifier used only for App Functionality, linked to the pairing, and never used for tracking.",
              "Support: if you email or submit a private security report, we receive the contact details and information you choose to provide.",
            ],
          },
          {
            heading: "Encrypted task content",
            paragraphs: [
              "The relay receives authenticated ciphertext and a nonce, not readable task content. Endpoint, pairing-transfer, and per-task keys are generated locally and are not stored in relay code, databases, logs, or Cloudflare secrets. Each task has an independent key; a key for one task cannot decrypt another.",
              "Plaintext exists on endpoints you authorize: the paired iPhone, its companion Watch experience, and the paired computer running your coding agent. Cursor, Claude Code, Codex, GitHub Copilot, Grok Build, MCP servers, and other tools you choose may process content under their own terms; GrantTap does not proxy their model traffic.",
            ],
          },
          {
            heading: "Data kept on your devices",
            bullets: [
              "Pairing and task keys, local preferences, delivery status, archives, schedule state, a bounded audit log, and MCP or skill usage history are stored in the app container or protected device storage.",
              "Chat history shown by GrantTap may originate from supported local coding-agent data on your computer. Archiving a task on iPhone is a local GrantTap preference and does not delete the source chat from those tools.",
              "The machine bridge stores its local configuration and schedules under ~/.granttap on the paired computer.",
            ],
          },
          {
            heading: "Camera, photos, files, microphone, speech, and biometrics",
            bullets: [
              "Camera access is used to scan a pairing QR code and, when you explicitly choose it, to create an attachment.",
              "Photo-library and file access is used only for items you select for a task. Selected content is sent through the encrypted task route to your paired computer.",
              "Microphone and speech-recognition access is used only when you start a voice reply. GrantTap requests on-device recognition when available; Apple may process speech when the system uses Apple speech services. GrantTap does not retain voice recordings as a separate cloud asset.",
              "Face ID, Touch ID, or the device passcode can protect the app and approval actions. GrantTap receives only the authentication result and never receives or stores biometric templates.",
              "Notifications are optional. APNs wake payloads are generic and contain no task type, command, prompt, title, path, request identifier, or message body.",
            ],
            links: [
              { label: "Apple Privacy Policy", href: "https://www.apple.com/legal/privacy/" },
            ],
          },
          {
            heading: "Service providers and protection",
            paragraphs: [
              "Cloudflare provides network, Worker, Durable Object, and website infrastructure. Apple provides APNs, optional speech processing, biometric system APIs, and App Store distribution. GrantTap configures these services for delivery, security, or user-requested functionality and does not authorize advertising, tracking, or profiling with GrantTap data.",
              "Where GrantTap controls a service provider's processing, it requires handling consistent with this policy and appropriate security for the service. Apple-controlled processing is governed by Apple's own privacy terms. Neither provider receives GrantTap endpoint or per-task decryption keys from the app.",
            ],
          },
          {
            heading: "Retention and deletion",
            paragraphs: [
              "Pairing blobs expire after 15 minutes and are single-use. Encrypted delivery queues are bounded and messages carry explicit expirations. APNs registration remains until you forget the pairing, the app unregisters, or APNs reports the token stale. Operational security records may remain under infrastructure-provider retention policies.",
              "Local app data remains until you clear the corresponding history, forget the paired computer, or remove the app. Machine-side state remains until you remove ~/.granttap. Support correspondence is kept only as needed to answer the request, maintain security records, or meet applicable obligations.",
            ],
            links: [
              { label: "Deletion and privacy choices", href: "/data-rights" },
            ],
          },
          {
            heading: "Your choices and rights",
            paragraphs: [
              "You can decline camera, photo, microphone, speech, biometric-lock, or notification permissions and continue using the parts of GrantTap that do not need them. Permissions can be changed in system Settings. Depending on where you live, you may also request access, correction, deletion, restriction, portability, or objection for personal data GrantTap can identify and control.",
              "GrantTap has no Personal identity index and cannot decrypt relay payloads, so the developer may have no readable task record to return or search by identity. For managed Enterprise records, contact your organization controller first. We will explain the applicable boundary rather than ask you to disclose secret keys.",
            ],
          },
          {
            heading: "Website, children, and policy changes",
            paragraphs: [
              "granttap.com stores only your language choice in local browser storage. It has no advertising or product analytics. Cloudflare may process ordinary request and security logs to deliver and protect the site.",
              "GrantTap is a developer tool and is not directed to children. It does not knowingly create profiles for children or request a date of birth.",
              "Material changes will be posted here with a new effective date and, when appropriate, surfaced in the app or release notes. Continued use after a change is subject to applicable law and your available choices.",
            ],
          },
        ],
        ru: [
          {
            heading: "Кто отвечает за данные и как связаться",
            paragraphs: [
              "GrantTap поддерживается независимым разработчиком. Для вопросов и запросов по данным используйте email поддержки ниже. Не отправляйте по почте коды пейринга, учётные данные комнаты, ключи шифрования или реальные данные задач.",
            ],
            links: [
              { label: "Написать по вопросам данных", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "Управление и удаление данных", href: "/data-rights" },
            ],
          },
          {
            heading: "Коротко о конфиденциальности",
            bullets: [
              "Для Personal и QR-входа в GrantTap Web не нужны имя пользователя или пароль. Управляемый Enterprise может обрабатывать ограниченные метаданные организации, пользователя, устройства, политики и login receipt.",
              "Репозитории, ключи моделей, промпты, отправленные непосредственно модели, и трафик модели не проходят через relay GrantTap.",
              "Сообщения задач, команды, вопросы, вложения, ответы и решения шифруются до отправки с разрешённого устройства.",
              "GrantTap не продаёт персональные данные и не использует данные приложения для рекламы или профилирования.",
            ],
          },
          {
            heading: "Данные для работы приложения",
            bullets: [
              "Пейринг: случайный 128-битный mailbox ID, одноразовый зашифрованный blob и время, необходимые для подключения. Независимый 256-битный transfer key остаётся в QR-коде или ручном токене и не отправляется relay.",
              "Метаданные доставки: непрозрачные идентификаторы комнаты, задачи, сообщения и доставки; роли отправителя и получателя; время соединения; размер шифротекста; срок; статус и повторы доставки.",
              "Сетевые и защитные метаданные: Cloudflare может обрабатывать IP и данные запроса для подключения, защиты и работы relay и сайта.",
              "Фоновая доставка: relay хранит APNs-токен, среду sandbox или production, bundle ID и время обновления. Это идентификатор устройства только для работы приложения; он связан с пейрингом и не используется для трекинга.",
              "Поддержка: при отправке email или закрытого сообщения об уязвимости мы получаем контактные данные и сведения, которые вы решили передать.",
            ],
          },
          {
            heading: "Зашифрованное содержимое задач",
            paragraphs: [
              "Relay получает аутентифицированный шифротекст и nonce, а не читаемое содержимое. Ключи устройства, transfer key и ключи отдельных задач создаются локально и не хранятся в коде relay, базе, логах или Cloudflare secrets. У каждой задачи отдельный ключ; ключ одной задачи не открывает другую.",
              "Открытый текст существует на разрешённых вами endpoints: спаренном iPhone, связанном опыте Apple Watch и компьютере с кодовым агентом. Cursor, Claude Code, Codex, GitHub Copilot, Grok Build, MCP-серверы и другие выбранные инструменты обрабатывают данные по собственным условиям; GrantTap не проксирует трафик модели.",
            ],
          },
          {
            heading: "Данные на ваших устройствах",
            bullets: [
              "Ключи пейринга и задач, настройки, статусы доставки, архив, расписания, ограниченный журнал действий и история MCP или скилов хранятся в контейнере приложения или защищённом хранилище устройства.",
              "История чатов в GrantTap может поступать из локальных данных поддерживаемых кодовых агентов на компьютере. Архивирование на iPhone — локальная настройка GrantTap и не удаляет исходный чат из этих инструментов.",
              "Мост на компьютере хранит локальную конфигурацию и расписания в ~/.granttap.",
            ],
          },
          {
            heading: "Камера, фото, файлы, микрофон, речь и биометрия",
            bullets: [
              "Камера используется для QR-кода пейринга и, только по вашему выбору, для создания вложения.",
              "Доступ к фото и файлам используется только для выбранных вами элементов. Они отправляются по зашифрованному маршруту задачи на спаренный компьютер.",
              "Микрофон и распознавание включаются только после запуска голосового ответа. GrantTap запрашивает локальное распознавание, когда оно доступно; в ином случае речь может обрабатываться сервисами Apple. GrantTap не хранит голосовую запись как отдельный облачный объект.",
              "Face ID, Touch ID или код-пароль могут защищать приложение и подтверждения. GrantTap получает только результат проверки и не получает биометрические шаблоны.",
              "Уведомления необязательны. APNs wake не содержит тип задачи, команду, промпт, заголовок, путь, request ID или текст сообщения.",
            ],
            links: [
              { label: "Политика конфиденциальности Apple", href: "https://www.apple.com/legal/privacy/" },
            ],
          },
          {
            heading: "Поставщики инфраструктуры и защита",
            paragraphs: [
              "Cloudflare предоставляет сеть, Worker, Durable Objects и инфраструктуру сайта. Apple предоставляет APNs, возможную обработку речи, системную биометрию и распространение через App Store. Эти сервисы используются только для доставки, защиты или выбранной функции, а не для рекламы, трекинга или профилирования.",
              "Когда GrantTap определяет обработку поставщика, требуется обращение с данными в соответствии с этой политикой и подходящая защита. Обработка под контролем Apple регулируется условиями Apple. Ни один поставщик не получает от приложения ключи расшифровки endpoints или отдельных задач.",
            ],
          },
          {
            heading: "Сроки хранения и удаление",
            paragraphs: [
              "Pairing blob одноразовый и истекает через 15 минут. Очереди шифротекста ограничены, а сообщения имеют срок действия. APNs-регистрация хранится до отключения пейринга, отмены регистрации приложением или ответа APNs о недействительном токене. Служебные записи безопасности могут храниться по правилам поставщиков инфраструктуры.",
              "Локальные данные остаются до очистки соответствующей истории, удаления пейринга или приложения. Данные на компьютере остаются до удаления ~/.granttap. Переписка поддержки хранится только для ответа, защиты сервиса или выполнения применимых обязанностей.",
            ],
            links: [
              { label: "Удаление и настройки данных", href: "/data-rights" },
            ],
          },
          {
            heading: "Ваш выбор и права",
            paragraphs: [
              "Можно не выдавать доступ к камере, фото, микрофону, распознаванию речи, биометрической блокировке или уведомлениям и использовать остальные функции. Разрешения меняются в системных Настройках. В зависимости от юрисдикции вы можете запросить доступ, исправление, удаление, ограничение, переносимость или возражение для данных, которые GrantTap способен идентифицировать и контролировать.",
              "У GrantTap нет Personal-индекса личности, а relay не расшифровывает payload. Поэтому у разработчика может не быть читаемой записи задачи для поиска по личности. По записям управляемого Enterprise сначала обратитесь к контроллеру организации. Мы объясним применимую границу и не будем просить секретные ключи.",
            ],
          },
          {
            heading: "Сайт, дети и изменения политики",
            paragraphs: [
              "granttap.com сохраняет в браузере только выбор языка. На сайте нет рекламы и продуктовой аналитики. Cloudflare может обрабатывать обычные запросы и защитные журналы для доставки и безопасности сайта.",
              "GrantTap — инструмент разработчика и не предназначен для детей. Он не создаёт детские профили и не запрашивает дату рождения.",
              "Существенные изменения публикуются здесь с новой датой и, когда уместно, показываются в приложении или release notes. Дальнейшее использование регулируется применимым правом и доступными настройками.",
            ],
          },
        ],
      }}
    />
  );
}

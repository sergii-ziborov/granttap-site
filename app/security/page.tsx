import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Security",
  description: "GrantTap encryption architecture, relay-visible metadata, endpoint trust, and vulnerability reporting.",
  alternates: { canonical: "/security" },
};

export default function SecurityPage() {
  return (
    <LegalPage
      title={{ en: "Security", ru: "Безопасность" }}
      updated={{ en: "August 2, 2026", ru: "2 августа 2026" }}
      updatedISO="2026-08-02"
      intro={{
        en: "GrantTap is an encrypted control channel between endpoints you authorize. The relay routes authenticated ciphertext and is not given the keys required to read task content.",
        ru: "GrantTap — зашифрованный канал управления между разрешёнными вами endpoints. Relay маршрутизирует аутентифицированный шифротекст и не получает ключи для чтения содержимого задач.",
      }}
      sections={{
        en: [
          {
            heading: "Security boundary",
            bullets: [
              "Coding agents, repositories, model credentials, prompts sent directly to models, and model traffic remain on the paired computer and their original providers.",
              "Task messages, questions, commands, approvals, replies, and attachments are encrypted at an authorized endpoint before relay transport.",
              "The relay stores and forwards ciphertext; it cannot derive endpoint or per-task keys from the information it receives.",
              "Plaintext is available on authorized endpoints and to tools you intentionally invoke there. Endpoint compromise is outside the protection offered by relay encryption.",
            ],
          },
          {
            heading: "Pairing",
            paragraphs: [
              "Pairing uses a random 128-bit mailbox identifier and an independent 256-bit transfer key carried in the QR code or manual token. The transfer key is not sent to the relay. The encrypted pairing blob is single-use and expires after 15 minutes.",
              "Treat a pairing QR code or manual token like a password until it expires. Anyone who obtains it during that window may attempt to pair, so never publish or forward it.",
            ],
          },
          {
            heading: "Independent task keys",
            paragraphs: [
              "Each attached task receives an independent 256-bit key generated and distributed through the encrypted endpoint channel. Possession of one task key does not reveal another task key, so access to one task cannot be used to decrypt a different task's ciphertext.",
              "Keys are held in protected local storage on authorized endpoints. They are not stored in relay databases, logs, source code, or Cloudflare secrets.",
            ],
          },
          {
            heading: "What the relay and network can observe",
            bullets: [
              "Opaque room, task, message, delivery, and recipient identifiers needed for routing.",
              "Connection time, sender and recipient role, expiry, retry state, delivery status, and ciphertext size.",
              "IP address and ordinary request or security information processed by Cloudflare infrastructure.",
              "For background delivery, an APNs device token, sandbox or production environment, bundle identifier, and update time.",
            ],
            paragraphs: [
              "This metadata can reveal that a paired endpoint communicated and approximately when or how much data moved. It does not contain the task title, prompt, command, file path, attachment plaintext, reply, or approval decision.",
            ],
          },
          {
            heading: "Background notifications",
            paragraphs: [
              "GrantTap sends APNs a generic wake payload containing only a GrantTap wake flag. Task type, command, prompt, title, path, request identifier, and message body are not put in the push payload. After a wake, the app retrieves encrypted state through the normal task channel.",
              "Apple and network providers can still observe normal notification-routing metadata. APNs delivery and background execution timing are controlled by the operating system and are not guaranteed.",
            ],
          },
          {
            heading: "Local protections",
            bullets: [
              "Face ID, Touch ID, or device passcode can gate app access and approvals; GrantTap receives only the system authentication result.",
              "Notification details can be hidden, and approvals can require fresh authentication.",
              "A local audit log records relevant actions without uploading that readable history to the relay.",
              "Forgetting a pairing removes pairing and task keys from the app, after separately clearing any local histories you want removed.",
            ],
          },
          {
            heading: "Limits of the model",
            paragraphs: [
              "End-to-end encryption protects task content while it crosses the GrantTap relay. It does not make an unlocked or compromised endpoint safe, validate agent output, prevent an approved command from causing damage, secure third-party MCP servers, or replace encrypted backups and operating-system updates.",
              "Traffic analysis, denial of service, delayed delivery, and the metadata listed above are not eliminated by content encryption. Keep the paired computer and Apple devices updated and remove access you no longer need.",
            ],
          },
          {
            heading: "Public audit surface",
            paragraphs: [
              "The machine bridge and relay are public so their transport and key-handling boundaries can be independently inspected. The iPhone and Apple Watch app is proprietary; public source availability for adjacent components is not a claim that the entire product is open source or formally audited.",
            ],
            links: [
              { label: "MCP bridge source", href: "https://github.com/sergii-ziborov/granttap-mcp" },
              { label: "Relay source", href: "https://github.com/sergii-ziborov/granttap-relay" },
              { label: "Privacy Policy", href: "/privacy" },
            ],
          },
          {
            heading: "Report a vulnerability",
            paragraphs: [
              "Use a private GitHub Security Advisory for suspected vulnerabilities. Include the affected component and version, impact, and minimal reproduction. Do not include live pairing tokens, endpoint keys, real task content, or credentials. For a non-security support problem, use the Support page instead.",
            ],
            links: [
              { label: "Private security report", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
              { label: "Support", href: "/support" },
            ],
          },
        ],
        ru: [
          {
            heading: "Граница защиты",
            bullets: [
              "Кодовые агенты, репозитории, ключи моделей, промпты моделям и трафик моделей остаются на спаренном компьютере и у исходных поставщиков.",
              "Сообщения задач, вопросы, команды, подтверждения, ответы и вложения шифруются на разрешённом endpoint до транспорта через relay.",
              "Relay хранит и пересылает шифротекст; по полученным данным он не может вывести ключи endpoints или отдельных задач.",
              "Открытый текст доступен разрешённым endpoints и явно вызванным там инструментам. Компрометация endpoint не устраняется шифрованием relay.",
            ],
          },
          {
            heading: "Пейринг",
            paragraphs: [
              "Пейринг использует случайный 128-битный mailbox ID и независимый 256-битный transfer key в QR-коде или ручном токене. Transfer key не отправляется relay. Зашифрованный pairing blob одноразовый и истекает через 15 минут.",
              "До истечения относитесь к QR-коду и ручному токену как к паролю. Получивший его человек может попытаться подключиться, поэтому не публикуйте и не пересылайте его.",
            ],
          },
          {
            heading: "Независимые ключи задач",
            paragraphs: [
              "Каждая подключённая задача получает независимый локально созданный 256-битный ключ через зашифрованный канал endpoints. Владение ключом одной задачи не раскрывает ключ другой и не позволяет открыть её шифротекст.",
              "Ключи находятся в защищённом локальном хранилище разрешённых endpoints. Их нет в базе и логах relay, исходном коде или Cloudflare secrets.",
            ],
          },
          {
            heading: "Что видят relay и сеть",
            bullets: [
              "Непрозрачные идентификаторы комнаты, задачи, сообщения, доставки и получателя для маршрутизации.",
              "Время соединения, роли отправителя и получателя, срок, повторы, статус доставки и размер шифротекста.",
              "IP-адрес и обычные данные запросов или защиты, обрабатываемые инфраструктурой Cloudflare.",
              "Для фоновой доставки: APNs-токен, sandbox или production, bundle ID и время обновления.",
            ],
            paragraphs: [
              "Эти метаданные могут показать факт, примерное время и объём связи. Они не содержат заголовок задачи, промпт, команду, путь к файлу, открытое вложение, ответ или решение о подтверждении.",
            ],
          },
          {
            heading: "Фоновые уведомления",
            paragraphs: [
              "GrantTap отправляет в APNs общий wake payload только с флагом GrantTap. В push нет типа задачи, команды, промпта, заголовка, пути, request ID или текста. После wake приложение получает зашифрованный статус по обычному каналу задачи.",
              "Apple и сетевые поставщики всё равно видят обычные метаданные доставки уведомления. Время APNs и фонового выполнения определяет система; оно не гарантируется.",
            ],
          },
          {
            heading: "Локальная защита",
            bullets: [
              "Face ID, Touch ID или код-пароль могут защищать приложение и подтверждения; GrantTap получает только результат системной проверки.",
              "Детали уведомлений можно скрыть, а подтверждения — требовать повторной аутентификации.",
              "Локальный журнал фиксирует действия без загрузки читаемой истории в relay.",
              "Удаление пейринга стирает ключи пейринга и задач из приложения после отдельной очистки локальных историй, которые вы хотите удалить.",
            ],
          },
          {
            heading: "Ограничения модели",
            paragraphs: [
              "Сквозное шифрование защищает содержимое в relay. Оно не защищает разблокированный или взломанный endpoint, не проверяет ответы агента, не отменяет последствия подтверждённой команды, не защищает сторонние MCP и не заменяет шифрованные резервные копии и обновления ОС.",
              "Анализ трафика, отказ в обслуживании, задержка доставки и перечисленные метаданные не исчезают из-за шифрования. Обновляйте компьютер и устройства Apple и удаляйте ненужный доступ.",
            ],
          },
          {
            heading: "Публичная поверхность проверки",
            paragraphs: [
              "Мост на компьютере и relay открыты для независимой проверки транспорта и работы с ключами. Приложение для iPhone и Apple Watch закрыто; открытость соседних компонентов не означает, что весь продукт открыт или прошёл формальный аудит.",
            ],
            links: [
              { label: "Исходники MCP-моста", href: "https://github.com/sergii-ziborov/granttap-mcp" },
              { label: "Исходники relay", href: "https://github.com/sergii-ziborov/granttap-relay" },
              { label: "Политика конфиденциальности", href: "/privacy" },
            ],
          },
          {
            heading: "Сообщить об уязвимости",
            paragraphs: [
              "Для уязвимостей используйте закрытый GitHub Security Advisory. Укажите компонент, версию, влияние и минимальный пример. Не прикладывайте действующие токены, ключи endpoints, реальные задачи или учётные данные. Обычные проблемы направляйте в поддержку.",
            ],
            links: [
              { label: "Закрытое сообщение об уязвимости", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
              { label: "Поддержка", href: "/support" },
            ],
          },
        ],
      }}
    />
  );
}

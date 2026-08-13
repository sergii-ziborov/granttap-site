import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Data Choices and Deletion",
  description: "How to clear GrantTap local history, forget a pairing, remove machine data, and request help.",
  alternates: { canonical: "/data-rights" },
};

export default function DataRightsPage() {
  return (
    <LegalPage
      title={{ en: "Data choices and deletion", ru: "Управление и удаление данных" }}
      updated={{ en: "August 2, 2026", ru: "2 августа 2026" }}
      updatedISO="2026-08-02"
      intro={{
        en: "GrantTap has no user account. Most readable GrantTap data is held on your iPhone or paired computer, so you control it locally. Use the ordered steps below for a complete device-side cleanup.",
        ru: "В GrantTap нет пользовательского аккаунта. Большинство читаемых данных хранится на iPhone или спаренном компьютере, поэтому управляется локально. Для полной очистки выполните шаги по порядку.",
      }}
      sections={{
        en: [
          {
            heading: "No GrantTap account",
            paragraphs: [
              "Pairing is device authorization, not account registration. GrantTap has no username, password, profile, subscription account, or cloud index of people. Apple's record of an App Store download or purchase belongs to your Apple Account and is controlled by Apple.",
            ],
          },
          {
            heading: "Clear the iPhone app",
            bullets: [
              "1. Open MCP and skill usage in GrantTap and choose Clear local usage history.",
              "2. Open Settings → Audit log and choose Clear or Clear log.",
              "3. In Settings, choose Forget paired computer and confirm. This unregisters background push for the pairing, disconnects it, and removes pairing keys, task keys, local sessions, deliveries, and archives.",
              "4. Remove GrantTap from the iPhone to erase any remaining data in the app sandbox. Remove the companion app from Apple Watch if watchOS does not remove it automatically.",
            ],
            paragraphs: [
              "Clear MCP usage and the audit log before forgetting the pairing because those local histories are separate controls. Menu names can vary slightly by app or OS version.",
            ],
          },
          {
            heading: "Remove paired-computer data",
            bullets: [
              "Stop the GrantTap background helper and any running granttap-mcp process.",
              "Remove the local GrantTap state directory at ~/.granttap only after confirming that exact path. It can contain pairing state, schedules, and local bridge configuration.",
              "Remove the GrantTap MCP entry or hooks from every connected coding agent if you no longer want those tools connected.",
            ],
            paragraphs: [
              "Deleting ~/.granttap is destructive and cannot be undone unless you made a backup. GrantTap does not provide a remote restore of local keys or schedules.",
            ],
          },
          {
            heading: "Source chat history is separate",
            paragraphs: [
              "GrantTap can display activity originating from supported local coding-agent sessions. Archiving a task in GrantTap does not delete that source chat. Delete or archive source history through the original agent or its local storage controls under the terms of the corresponding provider.",
            ],
          },
          {
            heading: "What happens at the relay",
            paragraphs: [
              "Forgetting a pairing asks the service to remove its APNs registration and makes locally deleted keys unavailable for future decryption. Pairing blobs are single-use and expire after 15 minutes. Encrypted queues are bounded and messages carry expirations. Some network or security logs can remain for the infrastructure provider's operational retention period.",
              "The relay has no account lookup and no decryption keys. Deleting an endpoint key makes any remaining ciphertext unreadable from that endpoint, but it does not retroactively erase a copy of plaintext already exported, logged, or stored by an authorized endpoint or third-party tool.",
            ],
          },
          {
            heading: "Privacy request or correction",
            paragraphs: [
              "Depending on where you live, you may request access, correction, deletion, restriction, portability, or objection for personal data GrantTap can identify and control. Email the support address below with the minimum information needed to explain the request.",
              "Because there is no GrantTap account index and encrypted payloads cannot be searched by identity, the developer may have no readable task record to return or delete centrally. We will explain what can be identified rather than ask for pairing tokens or encryption keys. Never send those secrets.",
            ],
            links: [
              { label: "Email a privacy request", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "Privacy Policy", href: "/privacy" },
            ],
          },
          {
            heading: "Apple Account and App Store data",
            paragraphs: [
              "Apple controls Apple Account, App Store purchase, receipt, and device-services data. Use Apple's Data and Privacy portal for Apple-held data or Apple's support channels for billing. GrantTap cannot delete those records for you.",
            ],
            links: [
              { label: "Apple Data and Privacy", href: "https://privacy.apple.com/" },
              { label: "Apple billing support", href: "https://support.apple.com/billing" },
            ],
          },
        ],
        ru: [
          {
            heading: "Без аккаунта GrantTap",
            paragraphs: [
              "Пейринг — разрешение устройства, а не регистрация. В GrantTap нет имени пользователя, пароля, профиля, аккаунта подписки или облачного списка людей. Запись Apple о загрузке или покупке относится к Apple Account и контролируется Apple.",
            ],
          },
          {
            heading: "Очистить приложение на iPhone",
            bullets: [
              "1. Откройте использование MCP и скилов в GrantTap и выберите очистку локальной истории.",
              "2. Откройте Настройки → Журнал действий и выберите очистку журнала.",
              "3. В Настройках выберите «Забыть спаренный компьютер» и подтвердите. Это отменит push-регистрацию, разорвёт связь и удалит ключи пейринга и задач, локальные сессии, доставки и архив.",
              "4. Удалите GrantTap с iPhone, чтобы стереть остаток контейнера приложения. Удалите приложение с Apple Watch отдельно, если watchOS не сделает это автоматически.",
            ],
            paragraphs: [
              "Историю MCP и журнал нужно очистить до удаления пейринга: это отдельные локальные элементы управления. Названия пунктов могут немного отличаться в разных версиях приложения или ОС.",
            ],
          },
          {
            heading: "Удалить данные с компьютера",
            bullets: [
              "Остановите фоновый помощник GrantTap и все процессы granttap-mcp.",
              "Удалите локальный каталог ~/.granttap только после проверки точного пути. Там могут находиться пейринг, расписания и конфигурация моста.",
              "Удалите MCP-запись GrantTap или hooks из каждого подключённого кодового агента, если больше не хотите их подключать.",
            ],
            paragraphs: [
              "Удаление ~/.granttap необратимо без резервной копии. GrantTap не хранит облачную копию локальных ключей или расписаний для восстановления.",
            ],
          },
          {
            heading: "Исходная история чатов хранится отдельно",
            paragraphs: [
              "GrantTap может показывать события локальных сессий поддерживаемых кодовых агентов. Архивирование задачи в GrantTap не удаляет исходный чат. Удаляйте или архивируйте его средствами исходного агента или его локального хранилища по условиям соответствующего поставщика.",
            ],
          },
          {
            heading: "Что происходит в relay",
            paragraphs: [
              "Удаление пейринга запрашивает удаление APNs-регистрации и лишает endpoint локальных ключей. Pairing blob одноразовый и истекает через 15 минут. Зашифрованные очереди ограничены, сообщения имеют срок. Сетевые и защитные логи могут оставаться на срок, установленный поставщиком инфраструктуры.",
              "У relay нет поиска по аккаунтам и ключей расшифровки. Удаление ключа делает оставшийся шифротекст нечитаемым для этого endpoint, но не удаляет задним числом открытый текст, ранее экспортированный или сохранённый разрешённым устройством или сторонним инструментом.",
            ],
          },
          {
            heading: "Запрос по данным или исправление",
            paragraphs: [
              "В зависимости от юрисдикции можно запросить доступ, исправление, удаление, ограничение, переносимость или возражение для данных, которые GrantTap способен идентифицировать и контролировать. Напишите в поддержку и сообщите минимум сведений для объяснения запроса.",
              "Из-за отсутствия индекса аккаунтов и невозможности искать зашифрованные payload по личности у разработчика может не быть читаемой записи для централизованной выдачи или удаления. Мы объясним доступные действия и не попросим токены или ключи. Никогда не отправляйте эти секреты.",
            ],
            links: [
              { label: "Отправить запрос по данным", href: "mailto:sergii.ziborov@gmail.com" },
              { label: "Политика конфиденциальности", href: "/privacy" },
            ],
          },
          {
            heading: "Apple Account и App Store",
            paragraphs: [
              "Данные Apple Account, покупки, чеки и сервисы устройств контролирует Apple. Для данных Apple используйте портал Data and Privacy, для оплаты — поддержку Apple. GrantTap не может удалить эти записи за вас.",
            ],
            links: [
              { label: "Apple Data and Privacy", href: "https://privacy.apple.com/" },
              { label: "Поддержка платежей Apple", href: "https://support.apple.com/billing" },
            ],
          },
        ],
      }}
    />
  );
}

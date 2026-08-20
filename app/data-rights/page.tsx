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
      updated={{ en: "August 20, 2026", ru: "20 августа 2026" }}
      updatedISO="2026-08-20"
      intro={{
        en: "GrantTap account login is optional for Personal/Team and required for managed Enterprise endpoints. Readable task data remains on your iPhone or paired computer. Use the ordered steps below for account and device cleanup.",
        ru: "Вход в аккаунт GrantTap необязателен для Personal/Team и обязателен для управляемого Enterprise. Читаемые данные задач остаются на iPhone или спаренном компьютере. Ниже описана очистка аккаунта и устройств.",
      }}
      sections={{
        en: [
          {
            heading: "GrantTap account is separate from pairing",
            paragraphs: [
              "Use granttap logout to remove the machine account session and Enterprise login receipt without changing phone pairing or provider logins. Pairing is separate device authorization. Apple's App Store records belong to your Apple Account and remain controlled by Apple.",
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
              "Run granttap logout first to remove the account session and Enterprise login receipt from protected storage.",
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
              "The relay has no decryption keys. Account services can identify account metadata but cannot decrypt task payloads. Deleting an endpoint key makes remaining ciphertext unreadable from that endpoint, but does not erase plaintext already exported or stored by an authorized endpoint or third-party tool.",
            ],
          },
          {
            heading: "Privacy request or correction",
            paragraphs: [
              "Depending on where you live, you may request access, correction, deletion, restriction, portability, or objection for personal data GrantTap can identify and control. Email the support address below with the minimum information needed to explain the request.",
              "An account record can be handled by identity, but encrypted task payloads cannot be searched or decrypted that way. The developer may have no readable task record to return or delete centrally. We will explain what can be identified rather than ask for pairing tokens or encryption keys. Never send those secrets.",
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
            heading: "Аккаунт GrantTap отделён от пейринга",
            paragraphs: [
              "Команда granttap logout удаляет сессию аккаунта компьютера и Enterprise login receipt, не меняя пейринг телефона или логины провайдеров. Пейринг остаётся отдельным разрешением устройства. Данные App Store относятся к Apple Account и контролируются Apple.",
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
              "Сначала выполните granttap logout, чтобы удалить сессию аккаунта и Enterprise login receipt из защищённого хранилища.",
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
              "У relay нет ключей расшифровки. Сервис аккаунтов может идентифицировать метаданные аккаунта, но не расшифровать payload задач. Удаление ключа делает шифротекст нечитаемым для endpoint, но не удаляет открытый текст, ранее сохранённый разрешённым устройством или сторонним инструментом.",
            ],
          },
          {
            heading: "Запрос по данным или исправление",
            paragraphs: [
              "В зависимости от юрисдикции можно запросить доступ, исправление, удаление, ограничение, переносимость или возражение для данных, которые GrantTap способен идентифицировать и контролировать. Напишите в поддержку и сообщите минимум сведений для объяснения запроса.",
              "Запись аккаунта можно обработать по личности, но зашифрованные payload задач нельзя так найти или расшифровать. У разработчика может не быть читаемой записи задачи для централизованной выдачи или удаления. Мы объясним доступные действия и не попросим токены или ключи.",
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

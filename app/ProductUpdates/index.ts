import type { OfferLocale } from "../ProductOffer";
import type { ProductDocument } from "../ProductInformation";

/** Published releases only. Add an app build after Apple makes it available. */
export function versionHistory(locale: OfferLocale): ProductDocument["sections"][number] {
  return locale === "ru" ? {
    heading: "История версий",
    paragraphs: ["Приложения для iPhone, iPad и Mac доступны по приглашению через TestFlight. Номер сборки указан в разделе «О приложении». Компьютерный MCP обновляется отдельно."],
    bullets: [
      "Приложения 202 · TestFlight · 18 октября 2026. Сообщения и очередь в новом чате сохраняются на relay до открытия задачи на компьютере. Смена временного ID чата и повторный Send now сохраняют статус доставки. Для этого обновите компьютерный MCP до 0.8.75.",
      "MCP 0.8.75. Очередь ожидает открытия исходной задачи и продолжает именно её после возвращения компьютера. Сохраняется проверка устройства, провайдера и проекта; повторная доставка не создаёт вторую задачу.",
      "Приложения 201 · TestFlight · 18 октября 2026. Полный доступ в тестовой версии без покупки подписки. Подтверждения и сообщения показывают сохранение на relay, не ожидая включения компьютера. Отдельная отправка новых сообщений очереди не блокируется ожиданием старых. Адаптирован чат для iPhone Duo, поворота экрана и клавиатуры.",
      "Приложения 199 · TestFlight · 17 октября 2026. В переносе доступны модели и уровень рассуждений Claude Code, Codex и Grok Build. Добавлен перенос в облако Claude или Codex через исходный компьютер с MCP 0.8.72. Исправлены повторные переподключения после отказа relay.",
      "MCP 0.8.74. Вопросы Cursor, варианты ответа и видимые предупреждения передаются в GrantTap. Сохранённые чаты Cursor открываются без ожидания проверки незакоммиченных изменений. Подготовка переноса поддерживает создание коммита до передачи задачи.",
    ],
    links: [{ label: "Версия компьютерного MCP в npm", href: "https://www.npmjs.com/package/granttap-mcp/v/0.8.75" }],
  } : {
    heading: "Version history",
    paragraphs: ["The iPhone, iPad and Mac apps are available by TestFlight invitation. Find the build number in About. The computer MCP updates separately."],
    bullets: [
      "Apps 202 · TestFlight · October 18, 2026. Messages and queues in a new chat save to the relay before the computer opens its task. Chat ID changes and repeated Send now preserve delivery state. Update the computer MCP to 0.8.75 for this behavior.",
      "MCP 0.8.75. Queued follow-ups wait for the original task and continue that chat after the computer returns. Controller, provider and Project checks remain in place; repeated delivery does not create a second task.",
      "Apps 201 · TestFlight · October 18, 2026. Full beta access without buying a subscription. Approvals and messages confirm relay storage without waiting for the computer. New queue uploads do not wait behind older receipt requests. Adaptive chat for iPhone Duo, rotation and the keyboard.",
      "Apps 199 · TestFlight · October 17, 2026. Transfer offers Claude Code, Codex and Grok Build models and reasoning effort. Claude or Codex cloud transfers run through the source computer with MCP 0.8.72. Fixed repeated reconnections after relay admission is refused.",
      "MCP 0.8.74. Cursor questions, answer choices and visible warnings reach GrantTap. Retained Cursor chats open without waiting for the working-tree check. Transfer preparation supports committing changes before handing off a task.",
    ],
    links: [{ label: "Computer MCP version on npm", href: "https://www.npmjs.com/package/granttap-mcp/v/0.8.75" }],
  };
}

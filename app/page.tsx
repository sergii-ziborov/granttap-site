"use client";

import { useEffect, useState } from "react";
import { useLocale } from "./components/Locale";
import { HomeView } from "./components/HomeView";

/** Target submission date. Move this one constant when the plan changes. */
const RELEASE_AT = new Date("2026-08-14T09:00:00Z");

function releaseCountdown() {
  const remaining = Math.max(0, RELEASE_AT.getTime() - Date.now());
  return {
    days: Math.floor(remaining / 86_400_000),
    hours: Math.floor((remaining % 86_400_000) / 3_600_000),
    minutes: Math.floor((remaining % 3_600_000) / 60_000),
    seconds: Math.floor((remaining % 60_000) / 1_000),
    reached: remaining === 0,
  };
}

export const copy = {
  en: {
    nav: ["How it works", "Product", "Security", "Connect"],
    status: "App Store launch",
    eyebrow: "Cursor · Claude · Codex · Copilot · Grok within reach",
    heroTitle: "Step away from your Mac.",
    heroAccent: "The work keeps moving.",
    hero:
      "GrantTap turns your iPhone and Apple Watch into a secure remote for coding-agent sessions already running on your computer — Cursor, Claude Code, Codex, Copilot, and Grok Build. Approve shell commands, answer questions, open chat, and keep the task moving.",
    see: "See the real app",
    securityModel: "How encryption works",
    highlights: ["Agents stay on your Mac", "Task-scoped E2EE", "Approvals + chat from your phone"],
    builtFor: "A companion for the agents you already run locally",
    workflowKicker: "One interruption, handled",
    workflowTitle: "When an agent needs you, you do not need your laptop.",
    workflowText:
      "GrantTap does not replace Cursor, Claude Code, Codex, Copilot, or Grok Build. It carries the small, important moments — approvals, questions, and chat — between their local session and your devices.",
    steps: [
      ["The agent asks", "A command, question, or finished turn appears from the real local session on your Mac."],
      ["You decide", "Read the task context and approve, deny, or answer from iPhone or Apple Watch."],
      ["The same task continues", "Your response returns to that session. No copied project, second agent, or cloud model proxy."],
    ],
    activityKicker: "More than approve or deny",
    activityTitle: "Open the task. See what matters. Send the next turn.",
    activityText:
      "The task view starts with the latest useful activity and keeps deeper controls nearby. You can move fast on Watch, then pick up the same task on iPhone when it needs more context.",
    activityItems: [
      ["A five-update glance", "The task opens on the latest visible activity; the full formatted chat stays one tap away."],
      ["Real context usage", "See tokens against the model window and start supported Codex compaction when the turn is idle."],
      ["Voice, photos, and files", "Reply naturally and attach up to five items to the next turn."],
      ["Controls for this task", "Inspect access, allowed MCP servers, and available project skills without changing unrelated sessions."],
      ["Recurring work by conversation", "Describe a schedule to local Codex or Claude Code, review the result, then save it."],
    ],
    controlsKicker: "Task-level control",
    controlsTitle: "The controls live where you need them: inside the task.",
    controls: [
      ["Agent access", "Inspect and change read-only, workspace, or full access for Codex turns sent from GrantTap."],
      ["MCP per task", "See the MCP servers configured for the task, then allow or deny one without changing unrelated sessions."],
      ["Codex context", "See the real context window and start supported compaction after the active turn finishes."],
    ],
    securityKicker: "Zero-knowledge relay",
    securityTitle: "The server can route your request. It cannot read it.",
    securityText:
      "Every route through the app is NaCl end-to-end encrypted. Pairing uses a relay-blind 256-bit transfer key, and each attached task gets an independent 256-bit key.",
    ciphertext: "ciphertext only",
    mac: ["Your Mac", "encrypts"],
    relay: ["Relay", "routes, cannot decrypt"],
    devices: ["Your devices", "decrypt"],
    facts: [
      ["Never touches", "Source repositories, model credentials, prompts to the model, or model traffic."],
      ["Can observe", "Opaque routes, timing, IP address, ciphertext size, expiry, and APNs routing data—not task content."],
      ["Keys live on", "Authorized endpoints only. A key from one task cannot decrypt another, and a device cannot open a task whose key it was never granted."],
    ],
    galleryKicker: "The actual product",
    galleryTitle: "Fast decisions on Watch. The full task on iPhone.",
    phoneCaption: "A live view of local agent tasks with approvals, questions, chat history, and MCP usage across Cursor, Claude Code, Codex, Copilot, and Grok Build.",
    watchCaption: "Scan active and recent tasks, open the latest updates, reply by voice or text, and handle a pending approval immediately.",
    historyCaption: "The task detail leads with recent activity, then exposes tokens, context, access, MCP, and the full chat only when you need them.",
    usageCaption: "The local usage ledger records observed MCP and skill calls. Token figures are estimated context footprint, never separate MCP billing.",
    securityCaption: "Face ID, private notification details, authenticated approvals, independent task keys, and a local audit log are visible—not hidden behind a security slogan.",
    installKicker: "Public and auditable machine bridge",
    installTitle: "Connect the agents you already use.",
    installText:
      "The machine-side bridge and relay are public, so you can inspect exactly what runs near your code before pairing a device. All five supported agents share the same encrypted phone channel.",
    codex: "Codex",
    claude: "Claude Code",
    cursor: "Cursor",
    copilot: "GitHub Copilot",
    grok: "Grok Build",
    hooks: "Approval hooks",
    source: "MCP source on GitHub",
    npm: "View on npm",
    relaySource: "Relay source on GitHub",
    pricingKicker: "Simple subscription",
    pricingTitle: "$2.99 per month after a 7-day free trial.",
    pricingText: "Personal connects up to 3 computers. Cancel through Apple at any time. Larger plans will follow without weakening the per-computer security boundary.",
    pricingAction: "See pricing and terms",
    localTitle: "Direct same-Wi-Fi transport is planned",
    localText: "A future local mode will deliver directly between your devices on the same network, with no server synchronization. It is not available yet.",
    releaseKicker: "Launch status",
    releaseTitle: "Preparing for App Store review.",
    releaseText:
      "GrantTap for iPhone and Apple Watch is not yet available on the App Store. A link to the listing will appear here once the app is approved.",
    appStore: "App Store — not yet available",
    countdownLabel: "Target submission",
    remaining: "to go",
    countdownReached: "Target date reached — submission in progress.",
    countdownUnits: ["days", "hours", "min", "sec"],
    tagline: "Keep your agents moving.",
    legal: ["Pricing", "Privacy", "Terms", "Support", "Security", "Data choices", "Accessibility", "Licenses"],
    rights:
      "© 2026 GrantTap. GrantTap is not affiliated with Anthropic, OpenAI, Microsoft, Anysphere, xAI, or Apple.",
  },
  ru: {
    nav: ["Как работает", "Приложение", "Безопасность", "Подключить"],
    status: "Запуск в App Store",
    eyebrow: "Cursor · Claude · Codex · Copilot · Grok под рукой",
    heroTitle: "Отойдите от Mac.",
    heroAccent: "Работа не остановится.",
    hero:
      "GrantTap превращает iPhone и Apple Watch в защищённый пульт для сессий кодовых агентов на вашем компьютере — Cursor, Claude Code, Codex, Copilot и Grok Build. Подтверждайте команды, отвечайте на вопросы, открывайте чат — и не останавливайте задачу.",
    see: "Посмотреть приложение",
    securityModel: "Как устроено шифрование",
    highlights: ["Агенты остаются на Mac", "E2EE для каждой задачи", "Подтверждения и чат с телефона"],
    builtFor: "Дополнение к агентам, которые уже работают локально",
    workflowKicker: "Одно прерывание — одно решение",
    workflowTitle: "Когда агенту нужен ответ, ноутбук не нужен.",
    workflowText:
      "GrantTap не заменяет Cursor, Claude Code, Codex, Copilot или Grok Build. Он переносит короткие, важные моменты — подтверждения, вопросы и чат — между локальной сессией и вашими устройствами.",
    steps: [
      ["Агент спрашивает", "Команда, вопрос или завершённый ход приходят из настоящей локальной сессии на Mac."],
      ["Вы решаете", "Прочитайте контекст задачи и разрешите, отклоните или ответьте с iPhone либо Apple Watch."],
      ["Та же задача продолжается", "Ответ возвращается в исходную сессию — без копии проекта, второго агента и облачного прокси модели."],
    ],
    activityKicker: "Больше, чем разрешить или отклонить",
    activityTitle: "Откройте задачу. Поймите главное. Отправьте следующий ход.",
    activityText:
      "Экран задачи начинается с последних полезных событий, а более глубокое управление остаётся рядом. На Watch вы реагируете быстро, на iPhone продолжаете ту же задачу с полным контекстом.",
    activityItems: [
      ["Пять последних обновлений", "Задача открывается на свежей видимой активности; полный форматированный чат доступен одним касанием."],
      ["Реальный расход контекста", "Смотрите токены относительно окна модели и запускайте поддерживаемое сжатие Codex, когда ход свободен."],
      ["Голос, фото и файлы", "Отвечайте естественно и прикладывайте до пяти элементов к следующему ходу."],
      ["Управление одной задачей", "Проверяйте доступ, разрешённые MCP и скилы проекта, не затрагивая другие сессии."],
      ["Расписание через диалог", "Опишите серию локальному Codex или Claude Code, проверьте результат и только потом сохраните."],
    ],
    controlsKicker: "Управление на уровне задачи",
    controlsTitle: "Нужные настройки находятся внутри самой задачи.",
    controls: [
      ["Доступ агента", "Смотрите и меняйте read-only, workspace или full access для ходов Codex из GrantTap."],
      ["MCP для задачи", "Смотрите MCP-серверы, настроенные для задачи, и разрешайте либо запрещайте один из них, не затрагивая остальные сессии."],
      ["Контекст Codex", "Следите за реальным окном и запускайте поддерживаемое сжатие после завершения активного хода."],
    ],
    securityKicker: "Relay с нулевым знанием",
    securityTitle: "Сервер маршрутизирует запрос, но не может его прочитать.",
    securityText:
      "Весь маршрут через приложение защищён сквозным NaCl-шифрованием. Пейринг использует невидимый relay 256-битный ключ, а каждая подключённая задача — отдельный 256-битный ключ.",
    ciphertext: "только шифротекст",
    mac: ["Ваш Mac", "шифрует"],
    relay: ["Relay", "маршрутизирует без расшифровки"],
    devices: ["Ваши устройства", "расшифровывают"],
    facts: [
      ["Никогда не получает", "Репозитории, ключи моделей, промпты модели и трафик модели."],
      ["Может видеть", "Непрозрачный маршрут, время, IP, размер шифротекста, срок и данные APNs — но не содержимое задач."],
      ["Ключи хранятся", "Только на разрешённых конечных устройствах. Ключ одной задачи не расшифровывает другую, а устройство не откроет задачу, ключ которой ему не выдавался."],
    ],
    galleryKicker: "Настоящее приложение",
    galleryTitle: "Быстрые решения на Watch. Вся задача — на iPhone.",
    phoneCaption: "Живой список локальных задач с подтверждениями, вопросами, историей чата и MCP для Cursor, Claude Code, Codex, Copilot и Grok Build.",
    watchCaption: "Просматривайте активные и недавние задачи, открывайте последние обновления, отвечайте голосом или текстом и сразу обрабатывайте подтверждения.",
    historyCaption: "Экран задачи начинается со свежих событий, а токены, контекст, доступ, MCP и полный чат открываются тогда, когда нужны.",
    usageCaption: "Локальная история хранит наблюдаемые вызовы MCP и скилов. Токены — оценка места в контексте, а не отдельный счёт MCP.",
    securityCaption: "Face ID, скрытие деталей уведомлений, подтверждение опасных действий, отдельные ключи задач и локальный журнал видны прямо в приложении.",
    installKicker: "Публичный и проверяемый мост",
    installTitle: "Подключите агентов, которыми уже пользуетесь.",
    installText:
      "Мост на компьютере и relay открыты: до пейринга можно проверить весь код рядом с проектами. Все пять поддерживаемых агентов используют один зашифрованный канал телефона.",
    codex: "Codex",
    claude: "Claude Code",
    cursor: "Cursor",
    copilot: "GitHub Copilot",
    grok: "Grok Build",
    hooks: "Approval hooks",
    source: "Исходники MCP на GitHub",
    npm: "Пакет на npm",
    relaySource: "Исходники relay на GitHub",
    pricingKicker: "Простая подписка",
    pricingTitle: "$2,99 в месяц после 7 бесплатных дней.",
    pricingText: "Personal подключает до 3 компьютеров. Отменить можно в Apple в любой момент. Для большего числа компьютеров позже появятся отдельные планы без ослабления границ безопасности.",
    pricingAction: "Тарифы и условия",
    localTitle: "Прямое соединение в одной Wi-Fi сети — в планах",
    localText: "Будущий локальный режим будет передавать данные напрямую между устройствами в одной сети, без серверной синхронизации. Сейчас он ещё недоступен.",
    releaseKicker: "Статус запуска",
    releaseTitle: "Готовим релиз к проверке App Store.",
    releaseText:
      "GrantTap для iPhone и Apple Watch пока недоступен в App Store. Ссылка на страницу приложения появится здесь после его одобрения.",
    appStore: "App Store — пока недоступно",
    countdownLabel: "Цель по отправке",
    remaining: "осталось",
    countdownReached: "Целевая дата наступила — идёт отправка.",
    countdownUnits: ["дней", "часов", "мин", "сек"],
    tagline: "Пусть агенты не простаивают.",
    legal: ["Тарифы", "Конфиденциальность", "Условия", "Поддержка", "Безопасность", "Управление данными", "Доступность", "Лицензии"],
    rights:
      "© 2026 GrantTap. GrantTap не связан с Anthropic, OpenAI, Microsoft, Anysphere, xAI или Apple.",
  },
} as const;

export type HomeCopy = typeof copy.en | typeof copy.ru;

export default function Home() {
  const { locale, setLocale } = useLocale();
  const t = copy[locale];

  // Starts null so server and first client render agree; the real figure lands
  // after hydration and then becomes the visible one-second launch clock.
  const [countdown, setCountdown] = useState<ReturnType<typeof releaseCountdown> | null>(null);
  useEffect(() => {
    const update = () => setCountdown(releaseCountdown());
    update();
    const id = setInterval(update, 1_000);
    return () => clearInterval(id);
  }, []);

  return <HomeView locale={locale} setLocale={setLocale} t={t} countdown={countdown} />;
}

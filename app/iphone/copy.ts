import type { Locale } from "../components/Locale";

type Pair = readonly [string, string];
type PageCopy = {
  title: string; seoTitle: string; description: string; kicker: string; intro: string;
  guide: string; pricing: string; featuresTitle: string; features: readonly Pair[];
  screensTitle: string; screensNote: string; startTitle: string; steps: readonly string[];
  priceTitle: string; priceText: string; faqTitle: string; faq: readonly Pair[]; privacy: string;
};

/** Screens shown on the page: real app captures made with deterministic sample work. */
export const iphoneScreens = [
  { file: "iphone-command-center", en: "Now: Needs You first", ru: "Сейчас: сначала то, что ждёт вас" },
  { file: "iphone-chat", en: "A Task's chat", ru: "Чат задачи" },
  { file: "iphone-tasks", en: "Tasks across computers", ru: "Задачи со всех компьютеров" },
  { file: "iphone-governance", en: "Mesh Governance", ru: "Правила Mesh" },
  { file: "iphone-weavatrix-graph", en: "Repository Graph", ru: "Graph репозитория" },
  { file: "iphone-mcp-usage", en: "Usage", ru: "Статистика" },
] as const;

export const iphoneCopy: Record<Locale, PageCopy> = {
  en: {
    title: "GrantTap for iPhone",
    seoTitle: "GrantTap for iPhone: Claude Code and Codex on your phone",
    description: "Follow Claude Code, Codex, Cursor and Grok Build on your own computers. Answer approvals and questions, then continue the same Task from iPhone and iPad.",
    kicker: "iPhone · iPad · Apple Watch",
    intro: "Your coding agents keep working on your computers. GrantTap puts their Tasks, questions and approvals in your pocket, so you can step in from anywhere and pick up the same conversation.",
    guide: "Setup guide",
    pricing: "Plans and terms",
    featuresTitle: "What you can do from the phone",
    features: [
      ["Needs You comes first", "Approvals, agent questions and failed deliveries appear before everything else, with the computer and agent that asked."],
      ["Answer with context", "Pick single or multiple choices in Claude question menus, type a custom answer, or allow and deny an action after reading its parameters."],
      ["Continue the same Task", "Send the next turn by text, voice, photo or file. Long progress notes stay folded, and the chat's model sits beside the composer."],
      ["See the subscription limit", "A small ring next to the model shows how much of the provider's subscription window is left. Tap it for each window's reset time."],
      ["Rules for a whole project", "Mesh Governance allows, asks or denies skills, MCP servers and shell. Auto allow for one chat counts only after the computer confirms it."],
      ["Architecture at a glance", "Open the repository Graph and code towers once the local Engine has analyzed a bound repository."],
      ["Sign in your way", "Use a passkey, scan a one-time QR, or sign in with a username and password. QR pairing also works without an account."],
      ["Private by design", "Agents and provider logins stay on your computers. The relay carries end-to-end encrypted messages it cannot read. No ads or tracking."],
    ],
    screensTitle: "The real app",
    screensNote: "Actual GrantTap screens captured with deterministic sample work. No private task, repository or pairing key appears in them.",
    startTitle: "Start in three steps",
    steps: [
      "Install GrantTap on iPhone or iPad and open the built-in demo to look around without connecting anything.",
      "On the computer where your agents run, install the GrantTap helper with Node.js 22.13 or later: npm install --global granttap-mcp, then granttap setup.",
      "Link the computer with the same account (passkey or password) or a one-time QR, then open a Task and answer from the phone.",
    ],
    priceTitle: "Free to download",
    priceText: "The app is free. Managed connection plans start at $4.99 a month for two computers; Apple shows local prices and any eligible seven-day trial. Models and tokens stay with your coding provider.",
    faqTitle: "Questions",
    faq: [
      ["Does GrantTap include an AI model?", "No. GrantTap controls the coding agents you already run, such as Claude Code and Codex. Model access and charges stay with your provider account, and GrantTap does not proxy model traffic."],
      ["Which coding agents work with it?", "Claude Code and Codex are the primary integrations. Cursor and Grok Build are supported with the capabilities their installed tools expose; each agent's guide lists the limits."],
      ["Does my code leave my computer?", "No. Agents run on your computers. Messages between your devices and computers pass the relay end to end encrypted; the relay sees routing metadata and ciphertext only."],
      ["What do I need on the computer?", "A computer with Node.js 22.13 or later, a signed-in coding agent and the GrantTap helper from npm. The Mac app can also act as a controller without the helper."],
      ["Does it work with Apple Watch?", "Yes, as a companion through the paired iPhone: glance at recent Tasks, approve or deny a request, or reply by voice."],
    ],
    privacy: "Privacy policy",
  },
  ru: {
    title: "GrantTap для iPhone",
    seoTitle: "GrantTap для iPhone: Claude Code и Codex с телефона",
    description: "Следите за Claude Code, Codex, Cursor и Grok Build на своих компьютерах. Отвечайте на запросы и вопросы и продолжайте ту же задачу с iPhone и iPad.",
    kicker: "iPhone · iPad · Apple Watch",
    intro: "Ваши coding-агенты продолжают работать на ваших компьютерах. GrantTap приносит их задачи, вопросы и запросы на телефон: можно вмешаться откуда угодно и продолжить тот же разговор.",
    guide: "Руководство по настройке",
    pricing: "Планы и условия",
    featuresTitle: "Что можно сделать с телефона",
    features: [
      ["Сначала то, что ждёт вас", "Запросы, вопросы агентов и неудавшиеся доставки показываются раньше всего остального, вместе с компьютером и агентом."],
      ["Ответ с контекстом", "Выберите один или несколько вариантов в меню вопроса Claude, напишите свой ответ или разрешите и запретите действие, прочитав его параметры."],
      ["Та же задача дальше", "Отправьте следующий ход текстом, голосом, фото или файлом. Длинные заметки о прогрессе свёрнуты, а модель чата видна рядом с полем ввода."],
      ["Остаток лимита подписки", "Маленькое кольцо рядом с моделью показывает, сколько осталось в окне подписки провайдера. По тапу — время сброса каждого окна."],
      ["Правила для всего проекта", "Правила Mesh разрешают, спрашивают или запрещают skills, MCP-серверы и shell. Auto allow для чата действует, только когда компьютер его подтвердил."],
      ["Архитектура одним взглядом", "Graph репозитория и башни кода открываются, когда локальный Engine проанализировал привязанный репозиторий."],
      ["Вход удобным способом", "Passkey, одноразовый QR или логин с паролем. Пара по QR работает и без аккаунта."],
      ["Приватность по умолчанию", "Агенты и входы провайдеров остаются на ваших компьютерах. Relay передаёт сообщения со сквозным шифрованием и не может их прочитать. Без рекламы и трекинга."],
    ],
    screensTitle: "Настоящее приложение",
    screensNote: "Настоящие экраны GrantTap, снятые на детерминированных учебных данных. Личных задач, репозиториев и ключей пары на них нет.",
    startTitle: "Начать в три шага",
    steps: [
      "Установите GrantTap на iPhone или iPad и откройте встроенное демо, чтобы осмотреться без подключения.",
      "На компьютере, где работают агенты, установите помощник GrantTap (нужен Node.js 22.13 или новее): npm install --global granttap-mcp, затем granttap setup.",
      "Свяжите компьютер тем же аккаунтом (passkey или пароль) или одноразовым QR, откройте задачу и отвечайте с телефона.",
    ],
    priceTitle: "Бесплатная загрузка",
    priceText: "Приложение бесплатное. Планы управляемого подключения — от $4,99 в месяц за два компьютера; локальную цену и доступный семидневный пробный период показывает Apple. Модели и токены остаются у вашего провайдера.",
    faqTitle: "Вопросы",
    faq: [
      ["Есть ли в GrantTap своя AI-модель?", "Нет. GrantTap управляет уже установленными у вас агентами, например Claude Code и Codex. Доступ к моделям и оплата остаются в аккаунте провайдера; GrantTap не проксирует трафик моделей."],
      ["С какими агентами он работает?", "Основные интеграции — Claude Code и Codex. Cursor и Grok Build поддерживаются в пределах возможностей их установленных инструментов; ограничения описаны в руководстве каждого агента."],
      ["Уходит ли мой код с компьютера?", "Нет. Агенты работают на ваших компьютерах. Сообщения между устройствами и компьютерами идут через relay в сквозном шифровании; relay видит только метаданные маршрута и шифротекст."],
      ["Что нужно на компьютере?", "Node.js 22.13 или новее, coding-агент с выполненным входом и помощник GrantTap из npm. Приложение для Mac может работать и просто как пульт, без помощника."],
      ["Работает ли с Apple Watch?", "Да, как дополнение через связанный iPhone: недавние задачи, разрешение или запрет запроса, ответ голосом."],
    ],
    privacy: "Политика конфиденциальности",
  },
};

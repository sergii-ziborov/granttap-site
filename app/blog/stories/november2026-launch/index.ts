import { composeStory } from "../compose";
import { body as launchEn } from "./launch-en";
import { body as launchRu } from "./launch-ru";
import { body as limitsEn } from "./limits-en";
import { body as limitsRu } from "./limits-ru";
import { body as meshEn } from "./mesh-en";
import { body as meshRu } from "./mesh-ru";

const published = "2026-11-16";
const image = (name: string) => `/blog/november2026-launch/${name}.webp`;
const generated = { en: "AI-generated conceptual illustration, not an application screen. ", ru: "Сгенерированная концептуальная иллюстрация, не экран приложения. " };
const archiveSlot = {
  en: (date: string) => `Prepared and published on November 16, 2026; ${date} is the editorial slot. Versions and availability are as of publication. Examples are illustrations, not measurements.`,
  ru: (date: string) => `Подготовлено и опубликовано 16 ноября 2026 года; ${date} — редакционный слот. Версии и доступность указаны на дату публикации. Примеры — иллюстрации, а не измерения.`,
};
const helper = { label: "granttap-mcp on npm", url: "https://www.npmjs.com/package/granttap-mcp" };

export const launchStory = composeStory({
  slug: "granttap-iphone-ipad-app-store-launch", date: "2026-11-16", publishedOn: published, reviewedOn: published,
  cover: image("launch-cover"), inlineIllustration: image("launch-surfaces"), additionalIllustration: image("launch-setup"),
  en: {
    title: "GrantTap for iPhone and iPad is on the App Store",
    summary: "Approve and answer Claude Code, Codex, Grok and Cursor from your phone. What the app does, how to set up a computer, what the plans cost and what 1.0.1 added.",
    category: "GrantTap release", body: launchEn,
    coverAlt: "A phone on a stone pedestal linked by a glowing orange thread, through a clear glass block, to two small computers.",
    illustrationCaption: generated.en + "Three trays beside a phone stand for Now, Tasks and Mesh: one waiting item, a stack of cards and a small network.",
    additionalIllustrationCaption: generated.en + "A parcel lowered into a computer and a thread to a phone stand for installing the helper and linking the computer.",
    closing: "Install the app, run granttap setup on each computer where agents work, and keep the app and the helper current: each decides part of what you see.",
    editorialNote: "Published on November 16, 2026. GrantTap 1.0.1 for iPhone and iPad is on the App Store; GrantTap 1.0.1 for Mac is in App Review and available by TestFlight invitation. Prices are US prices; the App Store shows local prices and trial eligibility.",
    practice: {
      title: "Set up one computer",
      intro: "Run these in your usual terminal on the computer where your agents work. Node.js 22.13 or newer is required.",
      steps: [
        { title: "Install the helper and run setup", detail: "Setup detects installed agents, installs GrantTap's hooks and prepares the background helper and MCP service.", code: "npm install -g granttap-mcp\ngranttap setup" },
        { title: "Read the summary", detail: "The Next line names the step still missing, for example linking the phone.", code: "granttap status" },
        { title: "Add the plugin to your coding app", detail: "Claude Code shown here; Codex, Cursor and Grok Build have their own steps in the installation guide.", code: "claude plugin marketplace add sergii-ziborov/granttap-mcp\nclaude plugin install granttap@granttap" },
      ],
    },
    sources: [
      { label: "GrantTap on the App Store", url: "https://apps.apple.com/app/id6809739366" },
      { label: "GrantTap installation guide (Russian)", url: "/guide/installation" },
      { label: "Pricing and purchase terms", url: "/pricing" },
      { label: "Version history in GrantTap Help", url: "/support" },
      helper,
    ],
  },
  ru: {
    title: "GrantTap для iPhone и iPad вышел в App Store",
    summary: "Отвечайте Claude Code, Codex, Grok и Cursor и согласовывайте их действия с телефона. Что умеет приложение, как подключить компьютер, сколько стоит и что нового в 1.0.1.",
    category: "Выпуск GrantTap", body: launchRu,
    coverAlt: "Телефон на каменном постаменте, связанный светящейся оранжевой нитью через прозрачный стеклянный блок с двумя небольшими компьютерами.",
    illustrationCaption: generated.ru + "Три лотка рядом с телефоном обозначают Now, Tasks и Mesh: ожидающий элемент, стопку карточек и небольшую сеть.",
    additionalIllustrationCaption: generated.ru + "Посылка, которую опускают в компьютер, и нить к телефону обозначают установку helper и привязку компьютера.",
    closing: "Установите приложение, выполните granttap setup на каждом компьютере, где работают агенты, и обновляйте и приложение, и helper: каждый отвечает за свою часть того, что вы видите.",
    editorialNote: "Опубликовано 16 ноября 2026 года. GrantTap 1.0.1 для iPhone и iPad доступен в App Store; GrantTap 1.0.1 для Mac на проверке App Review и доступен по приглашению в TestFlight. Цены указаны для США; локальные цены и право на пробный период показывает App Store.",
    practice: {
      title: "Подключите один компьютер",
      intro: "Выполните эти команды в обычном терминале на компьютере, где работают агенты. Нужен Node.js 22.13 или новее.",
      steps: [
        { title: "Установите helper и запустите настройку", detail: "Setup находит установленных агентов, ставит hooks GrantTap и подготавливает фоновый helper и MCP-сервис.", code: "npm install -g granttap-mcp\ngranttap setup" },
        { title: "Прочитайте сводку", detail: "Строка Next называет шаг, которого ещё не хватает, например привязку телефона.", code: "granttap status" },
        { title: "Добавьте плагин в coding-приложение", detail: "Здесь показан Claude Code; для Codex, Cursor и Grok Build шаги описаны в руководстве по установке.", code: "claude plugin marketplace add sergii-ziborov/granttap-mcp\nclaude plugin install granttap@granttap" },
      ],
    },
    sources: [
      { label: "GrantTap в App Store", url: "https://apps.apple.com/app/id6809739366" },
      { label: "Руководство: установка", url: "/guide/installation" },
      { label: "Цены и условия покупки", url: "/pricing" },
      { label: "История версий в справке GrantTap", url: "/support" },
      helper,
    ],
  },
});

export const limitsStory = composeStory({
  slug: "granttap-subscription-limits-auto-continue", date: "2026-11-15", publishedOn: published, reviewedOn: published,
  cover: image("limits-cover"), inlineIllustration: image("limits-windows"), additionalIllustration: image("limits-continue"),
  en: {
    title: "When a coding agent hits its subscription limit",
    summary: "How GrantTap shows the five-hour and weekly windows, per-model limits and a chat waiting on a reset, and how it continues that chat when the window has room again.",
    category: "GrantTap field guide", body: limitsEn,
    coverAlt: "A flat ring gauge with only a short orange arc left, beside a small computer with a dimmed screen and a phone.",
    illustrationCaption: generated.en + "A short inner track inside a long outer one stands for a five-hour window inside a weekly window.",
    additionalIllustrationCaption: generated.en + "A capsule waiting at an opening gate, with a switch beside the path, stands for continuing after a reset and turning that off.",
    closing: "Let long work continue by itself after a reset, turn it off where you want to be present, and keep the helper current so early and weekly continuations work.",
    editorialNote: archiveSlot.en("November 15"),
    practice: {
      title: "Check the versions that decide this",
      intro: "The app needs 1.0.1. The computer needs MCP 0.8.181 or later for early continuation and 0.8.183 or later for weekly limits; Claude Code must be signed in.",
      steps: [
        { title: "Read the installed helper version", detail: "Devices on the phone shows the same version and offers Check for MCP update and Restart MCP.", code: "granttap --version" },
        { title: "Update the helper if it is older", detail: "A normal update keeps chats, history and pairings. Restart the MCP from Devices afterwards.", code: "npm install -g granttap-mcp@latest" },
        { title: "Confirm the Claude integration is ready", detail: "If limits show an exclamation mark, Claude Code's own sign-in on this computer has usually expired.", code: "granttap status" },
      ],
    },
    sources: [
      { label: "Guide: model, effort and the limit ring (Russian)", url: "/guide/chat#model-effort" },
      { label: "Guide: Usage and subscription windows (Russian)", url: "/guide/usage-reports" },
      { label: "Limit continuation in the MCP source", url: "https://github.com/sergii-ziborov/granttap-mcp/tree/main/apps/bridge/src/limit-continuation" },
      { label: "Version history in GrantTap Help", url: "/support" },
      helper,
    ],
  },
  ru: {
    title: "Когда coding-агент упирается в лимит подписки",
    summary: "Как GrantTap показывает пятичасовое и недельное окна, лимиты отдельных моделей и чат, ждущий сброса, и как продолжает такой чат, когда в окне снова есть место.",
    category: "Практика GrantTap", body: limitsRu,
    coverAlt: "Плоское кольцо-индикатор, на котором остался лишь короткий оранжевый сегмент, рядом с небольшим компьютером с притушенным экраном и телефоном.",
    illustrationCaption: generated.ru + "Короткая внутренняя дорожка внутри длинной внешней обозначает пятичасовое окно внутри недельного.",
    additionalIllustrationCaption: generated.ru + "Капсула у открывающихся ворот и переключатель рядом с дорожкой обозначают продолжение после сброса и возможность его выключить.",
    closing: "Позвольте долгой работе продолжаться самой после сброса, выключайте это там, где хотите присутствовать, и обновляйте helper, чтобы работали раннее и недельное продолжение.",
    editorialNote: archiveSlot.ru("15 ноября"),
    practice: {
      title: "Проверьте версии, от которых это зависит",
      intro: "Приложению нужна версия 1.0.1. Компьютеру нужен MCP 0.8.181 или новее для раннего продолжения и 0.8.183 или новее для недельных лимитов; в Claude Code должен быть выполнен вход.",
      steps: [
        { title: "Узнайте версию установленного helper", detail: "Devices на телефоне показывает ту же версию и предлагает Check for MCP update и Restart MCP.", code: "granttap --version" },
        { title: "Обновите helper, если он старее", detail: "Обычное обновление сохраняет чаты, историю и пары устройств. После него перезапустите MCP из Devices.", code: "npm install -g granttap-mcp@latest" },
        { title: "Убедитесь, что интеграция с Claude готова", detail: "Если у лимитов восклицательный знак, обычно истёк собственный вход Claude Code на этом компьютере.", code: "granttap status" },
      ],
    },
    sources: [
      { label: "Руководство: модель, Effort и кольцо лимита", url: "/guide/chat#model-effort" },
      { label: "Руководство: Usage и окна подписки", url: "/guide/usage-reports" },
      { label: "Продолжение после лимита в исходниках MCP", url: "https://github.com/sergii-ziborov/granttap-mcp/tree/main/apps/bridge/src/limit-continuation" },
      { label: "История версий в справке GrantTap", url: "/support" },
      helper,
    ],
  },
});

export const meshStory = composeStory({
  slug: "granttap-mesh-repositories-computers", date: "2026-11-14", publishedOn: published, reviewedOn: published,
  cover: image("mesh-cover"), inlineIllustration: image("mesh-bindings"), additionalIllustration: image("mesh-helper"),
  en: {
    title: "Mesh: one project across repositories and computers",
    summary: "What a GrantTap Mesh holds, how repositories are bound on each computer, how to start and move Tasks inside it, and why image generation runs stay under their chat.",
    category: "GrantTap field guide", body: meshEn,
    coverAlt: "A woven net of orange and graphite threads holding several stone blocks, attached at both ends to two different computers.",
    illustrationCaption: generated.en + "Two desks with their own blocks, with matching blocks tied to one knot, stand for the same project bound separately on each computer.",
    additionalIllustrationCaption: generated.en + "A small framed picture tied under a large card stands for a helper run kept under the chat that started it.",
    closing: "Let Meshes form from real work, bind repositories per computer, move Tasks with Transfer to, and keep helper runs where they came from.",
    editorialNote: archiveSlot.en("November 14"),
    practice: {
      title: "Prepare two computers for one Mesh",
      intro: "Run this on each computer that holds a checkout of the project, then link both with the same passkey in the MCP connection card.",
      steps: [
        { title: "Install or update the helper", detail: "Editing a Mesh's repositories needs MCP 0.8.180 or later; helper runs under their chat need 0.8.175 or later.", code: "npm install -g granttap-mcp@latest\ngranttap setup" },
        { title: "Check pairing and integrations", detail: "Both computers should appear in Devices on the phone under their own names.", code: "granttap status" },
        { title: "Let an agent work in each repository", detail: "Ask a harmless question, such as explaining the README. The Mesh appears from that work; you do not create it by hand." },
      ],
    },
    sources: [
      { label: "Guide: Mesh projects (Russian)", url: "/guide/mesh-projects" },
      { label: "Guide: New Task (Russian)", url: "/guide/new-task" },
      { label: "Guide: Transfer to (Russian)", url: "/guide/handoff" },
      { label: "How Mesh works", url: "/project-mesh" },
      { label: "Helper runs in the MCP source", url: "https://github.com/sergii-ziborov/granttap-mcp/tree/main/apps/bridge/src/helper-runs" },
    ],
  },
  ru: {
    title: "Mesh: один проект на несколько репозиториев и компьютеров",
    summary: "Что содержит Mesh в GrantTap, как репозитории привязываются на каждом компьютере, как начинать и переносить Task и почему генерация изображений остаётся под своим чатом.",
    category: "Практика GrantTap", body: meshRu,
    coverAlt: "Сплетённая сеть из оранжевых и графитовых нитей с несколькими каменными блоками, закреплённая с двух сторон на двух разных компьютерах.",
    illustrationCaption: generated.ru + "Два стола со своими блоками и одинаковые блоки, связанные одним узлом, обозначают один проект, привязанный отдельно на каждом компьютере.",
    additionalIllustrationCaption: generated.ru + "Небольшая картинка в рамке, привязанная под большой карточкой, обозначает вспомогательный запуск, оставленный под начавшим его чатом.",
    closing: "Пусть Mesh складываются из реальной работы: привязывайте репозитории на каждом компьютере, переносите Task через Transfer to и оставляйте вспомогательные запуски там, откуда они пришли.",
    editorialNote: archiveSlot.ru("14 ноября"),
    practice: {
      title: "Подготовьте два компьютера для одного Mesh",
      intro: "Выполните это на каждом компьютере с checkout проекта, затем привяжите оба тем же passkey в карточке подключения MCP.",
      steps: [
        { title: "Установите или обновите helper", detail: "Для изменения репозиториев Mesh нужен MCP 0.8.180 или новее; для запусков под своим чатом — 0.8.175 или новее.", code: "npm install -g granttap-mcp@latest\ngranttap setup" },
        { title: "Проверьте пару и интеграции", detail: "Оба компьютера должны появиться в Devices на телефоне под своими именами.", code: "granttap status" },
        { title: "Дайте агенту поработать в каждом репозитории", detail: "Задайте безобидный вопрос, например попросите объяснить README. Mesh появится из этой работы; создавать его вручную не нужно." },
      ],
    },
    sources: [
      { label: "Руководство: Mesh проектов", url: "/guide/mesh-projects" },
      { label: "Руководство: New Task", url: "/guide/new-task" },
      { label: "Руководство: Transfer to", url: "/guide/handoff" },
      { label: "Как работает Mesh", url: "/project-mesh" },
      { label: "Вспомогательные запуски в исходниках MCP", url: "https://github.com/sergii-ziborov/granttap-mcp/tree/main/apps/bridge/src/helper-runs" },
    ],
  },
});

/** Newest first: the App Store launch, then the two field guides prepared with it. */
export const novemberLaunchStories = [launchStory, limitsStory, meshStory];

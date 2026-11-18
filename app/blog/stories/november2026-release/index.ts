import { composeStory } from "../compose";
import { body as releaseEn } from "./release-en";
import { body as releaseRu } from "./release-ru";

const published = "2026-11-18";
const image = (name: string) => `/blog/granttap-1-0-2-app-store-whats-new${name}.webp`;
const helper = { label: "granttap-mcp 0.8.195 on npm", url: "https://www.npmjs.com/package/granttap-mcp/v/0.8.195" };
const updates = "https://github.com/sergii-ziborov/granttap-mcp#automatic-runtime-updates";
const phones = "https://github.com/sergii-ziborov/granttap-mcp#phones-paired-with-a-computer";

/** Facts as of November 18, 2026: 1.0.2 on the App Store, MCP 0.8.195 on npm, Mac 1.0.1 in App Review. */
export const releaseStory = composeStory({
  slug: "granttap-1-0-2-app-store-whats-new", date: published, publishedOn: published, reviewedOn: published,
  cover: image("-cover"), inlineIllustration: image("-a"), additionalIllustration: image("-b"),
  en: {
    title: "GrantTap 1.0.2 is on the App Store: what’s new on your phone and your computer",
    summary: "GrantTap for iPhone and iPad is a free download on the App Store. What it does for Claude Code, Codex, Cursor and Grok Build, why approving from a phone is safe, what 1.0.2 and MCP 0.8.195 add, and what the next update brings.",
    category: "GrantTap release", body: releaseEn,
    coverAlt: "Diagram: iPhone and iPad 1.0.2 from the App Store and GrantTap MCP 0.8.195 from npm, joined by an end-to-end encrypted relay; below, Apple Watch through the paired iPhone, the next iPhone update being prepared, and Mac 1.0.1 in App Review.",
    illustrationCaption: "Infographic: one Claude Code chat with three Codex runs hanging beneath it, each with how it ended: working, hit the limit, or picture ready. The helper links them from MCP 0.8.189; the tree on the phone comes with the next iPhone update.",
    additionalIllustrationCaption: "Infographic: the helper checks for an update once an hour, stages and verifies it, then switches while running turns carry over. Claude's connection card lists the computer's phones, and connection_status says why an update waits.",
    closing: "Update the app and the helper, star the chats you come back to, and let the computer keep itself current; the next iPhone update builds on the helper you already have.",
    editorialNote: "Published on November 18, 2026. GrantTap 1.0.2 for iPhone and iPad is on the App Store and GrantTap MCP 0.8.195 is on npm. GrantTap 1.0.1 for Mac is in App Review and available by TestFlight invitation. Features of the next iPhone update are described as prepared, not released. Prices are US prices; the App Store shows local prices and trial eligibility.",
    practice: {
      title: "Bring one computer up to date",
      intro: "Run these in your usual terminal on a computer where your agents work. Node.js 22.13 or newer is required.",
      steps: [
        { title: "Read the helper version", detail: "0.8.195 or later has everything in this story. With Automatic updates on, the helper gets there by itself within an hour.", code: "granttap --version" },
        { title: "Update by hand if it is older", detail: "Then reopen the coding app's GrantTap integration if it still runs an older process. Pairings and history are kept.", code: "npm install -g granttap-mcp@latest" },
        { title: "Check what is still missing", detail: "The Next line names the missing step, for example linking a phone.", code: "granttap status" },
      ],
    },
    sources: [
      { label: "GrantTap on the App Store", url: "https://apps.apple.com/app/id6809739366" },
      { label: "Version history in GrantTap Help", url: "/support" },
      { label: "Automatic runtime updates in the MCP documentation", url: updates },
      { label: "Phones paired with a computer in the MCP documentation", url: phones },
      { label: "Security and encryption boundaries", url: "/security" },
      { label: "Pricing and purchase terms", url: "/pricing" },
      helper,
    ],
  },
  ru: {
    title: "GrantTap 1.0.2 в App Store: что нового на телефоне и на компьютере",
    summary: "GrantTap для iPhone и iPad бесплатно загружается из App Store. Что он делает для Claude Code, Codex, Cursor и Grok Build, почему подтверждать с телефона безопасно, что добавили 1.0.2 и MCP 0.8.195 и что принесёт следующее обновление.",
    category: "Выпуск GrantTap", body: releaseRu,
    coverAlt: "Схема: iPhone и iPad 1.0.2 из App Store и GrantTap MCP 0.8.195 из npm, связанные relay со сквозным шифрованием; ниже — Apple Watch через связанный iPhone, готовящееся обновление для iPhone и Mac 1.0.1 на проверке App Review.",
    illustrationCaption: "Инфографика: один чат Claude Code и три запуска Codex под ним, у каждого свой итог: работает, упёрся в лимит или картинка готова. Помощник связывает их с MCP 0.8.189; дерево на телефоне появится в следующем обновлении для iPhone.",
    additionalIllustrationCaption: "Инфографика: помощник раз в час проверяет обновление, подготавливает и проверяет его, затем переключается, не обрывая идущие ходы. Карточка подключения в Claude показывает телефоны компьютера, а connection_status объясняет, чего ждёт обновление.",
    closing: "Обновите приложение и помощник, добавьте в избранное чаты, к которым возвращаетесь, и дайте компьютеру обновляться самому: следующее обновление для iPhone опирается на тот помощник, что у вас уже есть.",
    editorialNote: "Опубликовано 18 ноября 2026 года. GrantTap 1.0.2 для iPhone и iPad доступен в App Store, GrantTap MCP 0.8.195 опубликован в npm. GrantTap 1.0.1 для Mac на проверке App Review и доступен по приглашению в TestFlight. Возможности следующего обновления для iPhone описаны как подготовленные, а не вышедшие. Цены указаны для США; локальные цены и право на пробный период показывает App Store.",
    practice: {
      title: "Обновите один компьютер",
      intro: "Выполните эти команды в обычном терминале на компьютере, где работают агенты. Нужен Node.js 22.13 или новее.",
      steps: [
        { title: "Узнайте версию помощника", detail: "В 0.8.195 и новее есть всё, о чём рассказано в статье. С включёнными Automatic updates помощник сам дойдёт до неё в течение часа.", code: "granttap --version" },
        { title: "Обновите вручную, если версия старше", detail: "Затем откройте заново интеграцию GrantTap в coding-приложении, если она ещё работает со старым процессом. Пары устройств и история сохраняются.", code: "npm install -g granttap-mcp@latest" },
        { title: "Проверьте, чего не хватает", detail: "Строка Next называет недостающий шаг, например привязку телефона.", code: "granttap status" },
      ],
    },
    sources: [
      { label: "GrantTap в App Store", url: "https://apps.apple.com/app/id6809739366" },
      { label: "История версий в справке GrantTap", url: "/support" },
      { label: "Автоматические обновления runtime в документации MCP", url: updates },
      { label: "Телефоны, подключённые к компьютеру, в документации MCP", url: phones },
      { label: "Безопасность и границы шифрования", url: "/security" },
      { label: "Цены и условия покупки", url: "/pricing" },
      { label: "granttap-mcp 0.8.195 в npm", url: helper.url },
    ],
  },
});

export const novemberReleaseStories = [releaseStory];

import { calendarDate, releaseAvailability, type OfferLocale } from "../ProductOffer";

type Column = { key: "app" | "computer" | "next"; label: string; status: string; items: string[] };
export type WhatsNew = {
  kicker: string; title: string; text: string; columns: Column[];
  facts: string; badgeAlt: string; history: string; mac: string; macLink: string;
};

/**
 * The current App Store release, the published computer helper and the next iPhone update.
 * Items follow the version history: the App Store column lists only what the published
 * version contains, and the next-update column names a version only as submitted to
 * App Review, never as released, and gives no release date.
 */
export function whatsNew(locale: OfferLocale): WhatsNew {
  const ios = releaseAvailability.ios;
  const mac = releaseAvailability.mac;
  const mcp = "0.8.203";
  const next = ios.inReview;
  if (locale === "ru") return {
    kicker: "Уже в App Store",
    title: `Что нового в GrantTap\u00a0${ios.version}`,
    text: `GrantTap для iPhone и iPad в App Store с ${calendarDate(ios.firstPublishedOn, "ru")}. Версия ${ios.version} вышла ${calendarDate(ios.publishedOn, "ru")}: видно, чем занят агент, а на вопросы и запросы можно ответить свайпом.`,
    columns: [
      { key: "app", label: `iPhone и iPad · ${ios.version}`, status: "В App Store", items: [
        "Карта работы: откройте её из меню чата и смотрите, что делает агент, по станциям — только по названиям инструментов.",
        "Требует внимания: смахните вопрос или запрос, чтобы скрыть его, не отвечать, остановить запуск, разрешить один раз или отклонить.",
        "Автоматизации: сообщения в чат по расписанию с паузой, правкой и «Запустить сейчас». Чаты Claude можно сжимать с телефона, а очередь ждёт сброса лимита.",
        "«Изменения» показывают worktree репозитория и их ветки, «Расход» — что запрашивал каждый вызов MCP или skill, а New Task предлагает режим разрешений Claude.",
      ] },
      { key: "computer", label: `GrantTap MCP ${mcp}`, status: "В npm для компьютера", items: [
        "Присылает телефону карту работы чата — только названия инструментов, без аргументов и результатов.",
        "Сам выполняет автоматизации GrantTap: сообщение по расписанию уходит в свободный чат любого агента как сообщение с телефона.",
        "Сжимает чаты Claude собственной командой /compact между ходами и держит сообщения очереди до сброса лимита.",
        "Перечисляет worktree чата, сохраняет короткую строку аргументов каждого вызова MCP и skill и отдаёт ранние запуски чата по запросу телефона.",
      ] },
      { key: "next", label: "Следующее обновление для iPhone", status: next ? `Версия ${next.version} на проверке App Review` : "После одобрения Apple", items: [
        "После «Создать задачу» новый чат открывается сразу, без спиннера.",
        "У строки «N более ранних запусков» под чатом появится «Показать»: она загрузит эти запуски с компьютера и нарисует их под чатом карточками.",
        "Задача, созданная в режиме «Принимать правки» или «Без подтверждений», и первый ход выполнит в этом режиме.",
        "Для ранних запусков и режима первого хода на компьютере нужен GrantTap MCP 0.8.203 или новее.",
      ] },
    ],
    facts: "Бесплатно · iOS 15 или новее · Apple Watch как дополнение",
    badgeAlt: "Загрузить в App Store",
    history: "Вся история версий",
    mac: `Mac: GrantTap ${mac.version} теперь в Mac App Store, а Mac Local покупается в нём один раз.${mac.inReview ? ` Версия ${mac.inReview.version} для Mac со всеми новинками iPhone на проверке App Review.` : ""}`,
    macLink: "GrantTap для Mac",
  };
  return {
    kicker: "Now on the App Store",
    title: `What’s new in GrantTap\u00a0${ios.version}`,
    text: `GrantTap for iPhone and iPad has been on the App Store since ${calendarDate(ios.firstPublishedOn, "en")}. Version ${ios.version} arrived on ${calendarDate(ios.publishedOn, "en")}: see what an agent is doing, and answer its questions and requests with a swipe.`,
    columns: [
      { key: "app", label: `iPhone and iPad · ${ios.version}`, status: "On the App Store", items: [
        "Live map: open it from a chat’s menu to watch the agent’s work station by station, by tool name only.",
        "Needs you: swipe a question or an approval to hide it, skip answering, stop the run, allow once or deny.",
        "Automations: schedule messages into a chat, with pause, edit and Run now. Compact Claude chats from the phone; queued messages wait for a usage-limit reset.",
        "Changes lists the repository’s worktrees and their branches, Usage shows what each MCP tool or skill call asked, and New Task lets you choose Claude’s permission mode.",
      ] },
      { key: "computer", label: `GrantTap MCP ${mcp}`, status: "On npm for your computer", items: [
        "Streams a chat’s live map to the phone by tool name only, with no arguments or results.",
        "Runs GrantTap automations: a scheduled message goes into a free chat of any agent as a phone turn.",
        "Compacts Claude chats with Claude Code’s own /compact between turns, and holds queued messages until a usage limit resets.",
        "Lists a chat’s worktrees, keeps one short line of what each MCP or skill call asked, and fetches a chat’s earlier runs when the phone asks.",
      ] },
      { key: "next", label: "Next iPhone update", status: next ? `Version ${next.version} in App Review` : "After Apple approves it", items: [
        "After Create Task, the new chat opens right away instead of a spinner.",
        "The “N earlier runs” line under a chat gains Show: it loads those runs from the computer and draws them beneath the chat as cards.",
        "A Task created with Accept edits or Bypass permissions runs its first turn in that mode too.",
        "Earlier runs and the first-turn mode need GrantTap MCP 0.8.203 or newer on the computer.",
      ] },
    ],
    facts: "Free · iOS 15 or later · Apple Watch companion",
    badgeAlt: "Download on the App Store",
    history: "See the full version history",
    mac: `Mac: GrantTap ${mac.version} is now on the Mac App Store, with Mac Local as a one-time purchase in the app.${mac.inReview ? ` Version ${mac.inReview.version} for Mac, with everything new on iPhone, is in App Review.` : ""}`,
    macLink: "GrantTap for Mac",
  };
}

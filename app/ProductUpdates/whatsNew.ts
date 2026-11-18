import { calendarDate, releaseAvailability, type OfferLocale } from "../ProductOffer";

type Column = { key: "app" | "computer" | "next"; label: string; status: string; items: string[] };
export type WhatsNew = {
  kicker: string; title: string; text: string; columns: Column[];
  facts: string; badgeAlt: string; history: string; mac: string; macLink: string;
};

/**
 * The current App Store release, the published computer helper and the next iPhone update.
 * Items follow the version history: the App Store column lists only what the published
 * version contains, and the next-update column never claims a release or a date.
 */
export function whatsNew(locale: OfferLocale): WhatsNew {
  const ios = releaseAvailability.ios;
  const mac = releaseAvailability.mac;
  const mcp = "0.8.195";
  if (locale === "ru") return {
    kicker: "Уже в App Store",
    title: `Что нового в GrantTap ${ios.version}`,
    text: `GrantTap для iPhone и iPad в App Store с ${calendarDate(ios.firstPublishedOn, "ru")}. Версия ${ios.version} вышла ${calendarDate(ios.publishedOn, "ru")}: длинный день работы агентов стало проще направлять с телефона.`,
    columns: [
      { key: "app", label: `iPhone и iPad · ${ios.version}`, status: "В App Store", items: [
        "Переименовывайте чаты, добавляйте в избранное и ставьте флажки. Избранные собраны вверху Now и Tasks.",
        "Меняйте репозитории Mesh и его название прямо с телефона.",
        "Mesh в New Task выбирается из списка с поиском, а Repositories ищутся по имени, адресу, Mesh или ветке.",
        "Кнопка модели показывает уровень рассуждений чата, даже если чат начат на компьютере.",
      ] },
      { key: "computer", label: `Компьютер · GrantTap MCP ${mcp}`, status: "В npm", items: [
        "Обновляется сам: проверяет новую версию раз в час и не обрывает идущий ход. Выключается в карточке подключения.",
        "Карточка подключения GrantTap в Claude показывает телефоны этого компьютера и удаляет старые.",
        "Запуски, которые начал чат, например генерации картинок в Codex, остаются при нём и сообщают, чем закончились.",
        "Изменения чата и коммиты отвечают быстро даже на загруженном Mac.",
      ] },
      { key: "next", label: "Следующее обновление для iPhone", status: "После одобрения Apple", items: [
        "Запуски, начатые чатом, висят под ним в Now, Tasks и History с итогом: работает, упёрся в лимит, остановлен или готовые картинки.",
        "Незакоммиченные изменения чата можно просмотреть и закоммитить с телефона (нужен GrantTap MCP 0.8.190 или новее).",
        "«Устройства» показывают все телефоны компьютера и всё, что вошло в ваш аккаунт.",
        "Вход на granttap.com по QR с iPhone и passkey прямо с первого экрана.",
      ] },
    ],
    facts: "Бесплатно · iOS 15 или новее · Apple Watch как дополнение",
    badgeAlt: "Загрузить в App Store",
    history: "Полная история версий",
    mac: `Mac: GrantTap ${mac.version} на проверке App Review. Пока Apple не одобрит версию, приложение для Mac доступно по приглашению в TestFlight.`,
    macLink: "GrantTap для Mac",
  };
  return {
    kicker: "Now on the App Store",
    title: `What’s new in GrantTap ${ios.version}`,
    text: `GrantTap for iPhone and iPad has been on the App Store since ${calendarDate(ios.firstPublishedOn, "en")}. Version ${ios.version} arrived on ${calendarDate(ios.publishedOn, "en")} and makes a long day of agent work easier to steer from your phone.`,
    columns: [
      { key: "app", label: `iPhone and iPad · ${ios.version}`, status: "On the App Store", items: [
        "Rename, star and flag chats. Starred chats get their own section at the top of Now and Tasks.",
        "Edit a Mesh’s repositories and rename it right from the phone.",
        "Pick a Mesh in New Task from a searchable list, and search Repositories by name, remote, Mesh or branch.",
        "The model button shows each chat’s reasoning effort, even for chats started on the computer.",
      ] },
      { key: "computer", label: `Your computer · GrantTap MCP ${mcp}`, status: "On npm", items: [
        "Keeps itself current: it checks for a new version every hour and carries a running turn over. Turn it off in the connection card.",
        "In Claude, the GrantTap connection card lists the phones paired with this computer and removes old ones.",
        "Runs a chat starts, such as Codex image generations, stay attached to that chat and report how they ended.",
        "A chat’s changes and commits answer quickly, even on a busy Mac.",
      ] },
      { key: "next", label: "Next iPhone update", status: "After Apple approves it", items: [
        "Runs a chat started hang beneath it on Now, Tasks and History, with how each ended: working, hit the limit, stopped, or the pictures it made.",
        "Review a chat’s uncommitted changes and commit them from your phone (needs GrantTap MCP 0.8.190 or newer).",
        "Devices shows every phone a computer accepts and everything signed in to your account.",
        "Sign in on granttap.com by scanning a QR with your iPhone, and use a passkey right from the first screen.",
      ] },
    ],
    facts: "Free · iOS 15 or later · Apple Watch companion",
    badgeAlt: "Download on the App Store",
    history: "Full version history",
    mac: `Mac: GrantTap ${mac.version} is in App Review. Until Apple approves it, the Mac app is available by TestFlight invitation.`,
    macLink: "GrantTap for Mac",
  };
}

import type { Device } from "../client";

type Kind = Device["kind"];
type SignIn = NonNullable<Device["signIn"]>;
const plural = (count: number, one: string, few: string, many: string) => {
  const mod10 = count % 10, mod100 = count % 100;
  return mod10 === 1 && mod100 !== 11 ? one : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14) ? few : many;
};

export const devicesCopy = {
  en: {
    lead: "Everything signed in to your account. Sign out anything you don't recognise.",
    kind: { browser: "Browser", iphone: "iPhone", ipad: "iPad", mac: "Mac app", app: "GrantTap app",
      unknown: "Signed-in device", computer: "Computer with GrantTap MCP" } satisfies Record<Kind, string>,
    signIn: { passkey: "passkey", password: "password", qr: "QR from iPhone", token: "sign-in token",
      invite: "device invitation" } satisfies Record<SignIn, string>,
    thisBrowser: (kind: Kind) => kind === "browser" ? "This browser" : "This device",
    encrypted: (id: string) => `Encrypted · ${id}`,
    active: (when: string) => `active ${when}`,
    neverSeen: "not seen yet",
    signOut: "Sign out", remove: "Remove", keepSession: "Keep signed in", keepComputer: "Keep computer", keepAll: "Keep them",
    confirmSignOut: (name: string) => `Sign out ${name}? It will need to sign in again.`,
    confirmSelf: "Sign out of this browser?",
    confirmRemove: (name: string) => `Remove ${name} from your account? Its chats stay on the computer; GrantTap MCP there will need to sign in again.`,
    prune: (days: number) => `Remove devices not seen for ${days} days`,
    nothingStale: (days: number) => `Every device was active in the last ${days} days.`,
    confirmPrune: (count: number) => `Remove ${count} ${count === 1 ? "device" : "devices"} not seen for 30 days?`,
    pruneConfirm: (count: number) => `Remove ${count} ${count === 1 ? "device" : "devices"}`,
    empty: "No devices yet.",
    failed: "Couldn't change your devices. Check your connection, refresh the page and try again.",
    olderName: "Older sign-in",
    olderTitle: "Older sign-ins",
    olderLead: "These signed in before GrantTap noted which device signs in. Remove any you don't recognise; a device still using one signs in again.",
    since: (date: string) => `since ${date}`,
    lastUsed: (when: string) => `last used ${when}`,
    noUse: "no use recorded",
    removeOlder: (count: number) => `Remove ${count} older ${count === 1 ? "sign-in" : "sign-ins"}`,
    confirmOlder: (count: number) => `Sign out ${count} older ${count === 1 ? "sign-in" : "sign-ins"}? A device still using one will need to sign in again.`,
  },
  ru: {
    lead: "Всё, что вошло в ваш аккаунт. Выйдите из всего, что не узнаёте.",
    kind: { browser: "Браузер", iphone: "iPhone", ipad: "iPad", mac: "Приложение для Mac", app: "Приложение GrantTap",
      unknown: "Устройство с входом", computer: "Компьютер с GrantTap MCP" } satisfies Record<Kind, string>,
    signIn: { passkey: "passkey", password: "пароль", qr: "QR с iPhone", token: "токен входа",
      invite: "приглашение устройства" } satisfies Record<SignIn, string>,
    thisBrowser: (kind: Kind) => kind === "browser" ? "Этот браузер" : "Это устройство",
    encrypted: (id: string) => `Зашифровано · ${id}`,
    active: (when: string) => `активность ${when}`,
    neverSeen: "ещё не появлялся",
    signOut: "Выйти", remove: "Удалить", keepSession: "Не выходить", keepComputer: "Оставить компьютер", keepAll: "Оставить",
    confirmSignOut: (name: string) => `Выйти на устройстве «${name}»? Ему придётся войти заново.`,
    confirmSelf: "Выйти из аккаунта в этом браузере?",
    confirmRemove: (name: string) => `Удалить «${name}» из аккаунта? Чаты останутся на компьютере; GrantTap MCP там нужно будет войти заново.`,
    prune: (days: number) => `Удалить устройства, неактивные ${days} дней`,
    nothingStale: (days: number) => `Все устройства были активны за последние ${days} дней.`,
    confirmPrune: (count: number) => `Удалить ${count} ${plural(count, "устройство", "устройства", "устройств")}, неактивных 30 дней?`,
    pruneConfirm: (count: number) => `Удалить ${count} ${plural(count, "устройство", "устройства", "устройств")}`,
    empty: "Устройств пока нет.",
    failed: "Не удалось изменить устройства. Проверьте соединение, обновите страницу и попробуйте снова.",
    olderName: "Прежний вход",
    olderTitle: "Прежние входы",
    olderLead: "Эти входы были до того, как GrantTap стал отмечать, какое устройство входит. Удалите те, что не узнаёте; устройство, которое ещё пользуется таким входом, войдёт заново.",
    since: (date: string) => `с ${date}`,
    lastUsed: (when: string) => `использовался ${when}`,
    noUse: "использование не записано",
    removeOlder: (count: number) => `Удалить ${count} ${plural(count, "прежний вход", "прежних входа", "прежних входов")}`,
    confirmOlder: (count: number) => `Завершить ${count} ${plural(count, "прежний вход", "прежних входа", "прежних входов")}? Устройству, которое ещё пользуется одним из них, придётся войти заново.`,
  },
};

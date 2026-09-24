import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Support", description: "Install, connect, and troubleshoot GrantTap Personal.", alternates: { canonical: "/support" } };

export default function SupportPage() {
  return <LegalPage
    title={{ en: "Support", ru: "Поддержка" }}
    updated={{ en: "September 19, 2026", ru: "19 сентября 2026" }}
    updatedISO="2026-09-19"
    intro={{ en: "The normal path is one install, one setup command, and Authenticate in the coding app. Pairing stays on granttap.com/connect and in the GrantTap app — not in chat.", ru: "Обычный путь — одна установка, одна setup-команда и Authenticate в coding app. Сопряжение остаётся на granttap.com/connect и в приложении GrantTap, не в чате." }}
    sections={{
      en: [
        { heading: "Connect a computer", bullets: ["Install Node.js 22 or newer.", "Run npm install -g granttap-mcp.", "Run granttap setup. It detects providers, installs supported hooks, and starts or repairs the helper.", "Open the GrantTap connection card in the coding app and choose Add a device. Scan its QR in GrantTap on iPhone. Use Add another device for a second phone or Reconnect for the same phone.", "Authenticate opens granttap.com/connect to approve the coding app; that page does not show a pairing QR.", "Use granttap status for a read-only readiness summary."] },
        { heading: "Provider readiness", bullets: ["Claude Code and Codex are the primary integrations.", "Codex may require you to trust the exact GrantTap hooks before restarting Codex.", "Cursor is Beta. Install the GrantTap Marketplace listing, then granttap setup. Do not add GrantTap in Customize → MCPs.", "Cursor Cloud · fetch failed is a leftover user HTTP MCP at 127.0.0.1:17342, or the unused cloud plugin source — not proof the phone is unpaired.", "A provider that is not installed is not an error."] },
        { heading: "Pairing or delivery does not work", bullets: ["Confirm internet access and use a wss:// relay URL.", "A website “seen” or Connected label is the mailbox claim, not Live. Live is only in the GrantTap app after the helper and the phone share the room.", "An empty phone joins the website room. If the phone is already Live, it keeps that room. Reconnect mints a QR for the same room.", "Open GrantTap on the unlocked iPhone. A locked phone stays offline.", "Check iOS Notifications and Background App Refresh. APNs timing is controlled by Apple and cannot be guaranteed.", "Never send pairing tokens, room credentials, provider credentials, prompts, or repository paths in support messages."] },
        { heading: "Contact and diagnostics", paragraphs: ["Email sergii.ziborov@gmail.com with app, iOS/watchOS, Node.js, helper, and provider versions plus sanitized reproduction steps. Export diagnostics from the app's Troubleshooting destination when available."], links: [{ label: "MCP/helper issues", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" }, { label: "Relay issues", href: "https://github.com/sergii-ziborov/granttap-relay/issues" }] },
      ],
      ru: [
        { heading: "Подключить компьютер", bullets: ["Установите Node.js 22 или новее.", "Выполните npm install -g granttap-mcp.", "Выполните granttap setup. Команда найдёт providers, установит hooks и запустит или исправит helper.", "Откройте панель GrantTap в coding app и нажмите Add a device. Отсканируйте QR приложением на iPhone. Для второго телефона используйте Add another device, для того же — Reconnect.", "Authenticate открывает granttap.com/connect для подтверждения coding app; QR сопряжения на этой странице нет.", "granttap status показывает read-only readiness summary."] },
        { heading: "Готовность providers", bullets: ["Claude Code и Codex — основные интеграции.", "Codex может потребовать доверить точные GrantTap hooks и перезапустить Codex.", "Cursor — Beta. Карточка GrantTap в Marketplace, затем granttap setup. Не добавляйте GrantTap в Customize → MCPs.", "Cursor Cloud · fetch failed — лишний user HTTP MCP на 127.0.0.1:17342 или cloud-источник плагина, а не доказательство, что телефон не спарен.", "Неустановленный provider не является ошибкой."] },
        { heading: "Не работает pairing или delivery", bullets: ["Проверьте интернет и wss:// relay URL.", "«Seen» или Connected на сайте — это mailbox, не Live. Live только в приложении GrantTap, когда helper и телефон в одной комнате.", "Пустой телефон входит в комнату сайта. Если телефон уже Live — он держит свою комнату. Reconnect даёт QR той же комнаты.", "Откройте GrantTap на разблокированном iPhone. Заблокированный телефон остаётся offline.", "Проверьте iOS Notifications и Background App Refresh. Время APNs определяет Apple и оно не гарантируется.", "Не отправляйте в поддержку pairing tokens, room credentials, provider credentials, prompts или repository paths."] },
        { heading: "Контакт и diagnostics", paragraphs: ["Напишите на sergii.ziborov@gmail.com версии приложения, iOS/watchOS, Node.js, helper и provider, а также очищенные шаги воспроизведения. При наличии экспортируйте diagnostics из Troubleshooting."], links: [{ label: "Проблемы MCP/helper", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" }, { label: "Проблемы relay", href: "https://github.com/sergii-ziborov/granttap-relay/issues" }] },
      ],
    }}
  />;
}

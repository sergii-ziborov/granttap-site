import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Support", description: "Install, connect, and troubleshoot GrantTap Personal.", alternates: { canonical: "/support" } };

export default function SupportPage() {
  return <LegalPage
    title={{ en: "Support", ru: "Поддержка" }}
    updated={{ en: "August 23, 2026", ru: "23 августа 2026" }}
    updatedISO="2026-08-23"
    intro={{ en: "The normal path is one install and one setup command. Technical details stay here, outside everyday Settings.", ru: "Обычный путь — одна установка и одна setup-команда. Технические детали остаются здесь, а не в обычных Settings." }}
    sections={{
      en: [
        { heading: "Connect a computer", bullets: ["Install Node.js 22 or newer.", "Run npm install -g granttap-mcp.", "Run granttap setup. It detects providers, installs supported hooks, starts or repairs the helper, and shows a one-time QR if pairing is needed.", "Scan the QR in GrantTap, verify one provider, and send a test notification.", "Use granttap status for a read-only readiness summary."] },
        { heading: "Provider readiness", bullets: ["Claude Code and Codex are the primary integrations.", "Codex may require you to trust the exact GrantTap hooks before restarting Codex.", "Cursor is Beta; setup opens the local authorization flow when required. Use granttap cursor repair only as an advanced fallback.", "A provider that is not installed is not an error."] },
        { heading: "Pairing or delivery does not work", bullets: ["Confirm internet access and use a wss:// relay URL.", "Generate a fresh QR; pairing mailboxes are single-use and expire after 15 minutes.", "Open GrantTap on iPhone after a long offline period to reconnect and reconcile delivery state.", "Check iOS Notifications and Background App Refresh. APNs timing is controlled by Apple and cannot be guaranteed.", "Never send pairing tokens, room credentials, provider credentials, prompts, or repository paths in support messages."] },
        { heading: "Contact and diagnostics", paragraphs: ["Email sergii.ziborov@gmail.com with app, iOS/watchOS, Node.js, helper, and provider versions plus sanitized reproduction steps. Export diagnostics from the app's Troubleshooting destination when available."], links: [{ label: "MCP/helper issues", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" }, { label: "Relay issues", href: "https://github.com/sergii-ziborov/granttap-relay/issues" }] },
      ],
      ru: [
        { heading: "Подключить компьютер", bullets: ["Установите Node.js 22 или новее.", "Выполните npm install -g granttap-mcp.", "Выполните granttap setup. Команда найдёт providers, установит hooks, запустит или исправит helper и покажет одноразовый QR при необходимости.", "Отсканируйте QR в GrantTap, проверьте один provider и отправьте test notification.", "granttap status показывает read-only readiness summary."] },
        { heading: "Готовность providers", bullets: ["Claude Code и Codex — основные интеграции.", "Codex может потребовать доверить точные GrantTap hooks и перезапустить Codex.", "Cursor — Beta; setup открывает local authorization flow. granttap cursor repair — только advanced fallback.", "Неустановленный provider не является ошибкой."] },
        { heading: "Не работает pairing или delivery", bullets: ["Проверьте интернет и wss:// relay URL.", "Создайте свежий QR: pairing mailbox одноразовый и истекает через 15 минут.", "После долгого offline откройте GrantTap на iPhone для reconnect и reconciliation.", "Проверьте iOS Notifications и Background App Refresh. Время APNs определяет Apple и оно не гарантируется.", "Не отправляйте в поддержку pairing tokens, room credentials, provider credentials, prompts или repository paths."] },
        { heading: "Контакт и diagnostics", paragraphs: ["Напишите на sergii.ziborov@gmail.com версии приложения, iOS/watchOS, Node.js, helper и provider, а также очищенные шаги воспроизведения. При наличии экспортируйте diagnostics из Troubleshooting."], links: [{ label: "Проблемы MCP/helper", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" }, { label: "Проблемы relay", href: "https://github.com/sergii-ziborov/granttap-relay/issues" }] },
      ],
    }}
  />;
}

import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Support",
  description: "GrantTap setup, troubleshooting, and support links.",
  alternates: { canonical: "/support" },
};

export default function SupportPage() {
  return (
    <LegalPage
      title={{ en: "Support", ru: "Поддержка" }}
      updated={{ en: "July 24, 2026", ru: "24 июля 2026" }}
      intro={{
        en: "GrantTap for iPhone and Apple Watch is preparing for release. The public MCP bridge is available now.",
        ru: "GrantTap для iPhone и Apple Watch готовится к выпуску. Публичный MCP-мост уже доступен.",
      }}
      sections={{
        en: [
          {
            heading: "Install",
            bullets: [
              "Codex: codex mcp add granttap -- npx -y granttap-mcp",
              "Claude Code: claude mcp add granttap -- npx -y granttap-mcp",
              "Pairing and approval hooks: npm install -g granttap-mcp, then granttap-mcp connect",
            ],
          },
          {
            heading: "Before reporting a problem",
            bullets: [
              "Confirm Node.js 20 or newer is installed.",
              "Check that the relay URL begins with wss:// for cloud use.",
              "Re-run granttap-mcp setup after updating the package.",
              "Use a test chat before enabling remote approval on important work.",
            ],
          },
          {
            heading: "Get help",
            paragraphs: [
              "Support email: sergii.ziborov@gmail.com. Include the GrantTap app version, iOS/watchOS version, MCP package version, and steps to reproduce. Never send pairing codes, secret keys, or real command payloads.",
            ],
            links: [
              { label: "MCP issues", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" },
              { label: "Relay issues", href: "https://github.com/sergii-ziborov/granttap-relay/issues" },
              { label: "Security advisories", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
              { label: "npm package", href: "https://www.npmjs.com/package/granttap-mcp" },
            ],
          },
        ],
        ru: [
          {
            heading: "Установка",
            bullets: [
              "Codex: codex mcp add granttap -- npx -y granttap-mcp",
              "Claude Code: claude mcp add granttap -- npx -y granttap-mcp",
              "Пейринг и approval hooks: npm install -g granttap-mcp, затем granttap-mcp connect",
            ],
          },
          {
            heading: "Перед сообщением о проблеме",
            bullets: [
              "Проверьте, что установлен Node.js 20 или новее.",
              "Для облачного relay адрес должен начинаться с wss://.",
              "После обновления пакета повторно запустите granttap-mcp setup.",
              "Сначала проверяйте удалённые подтверждения в тестовом чате.",
            ],
          },
          {
            heading: "Получить помощь",
            paragraphs: [
              "Email поддержки: sergii.ziborov@gmail.com. Укажите версию GrantTap, iOS/watchOS, версию MCP-пакета и шаги воспроизведения. Не отправляйте коды пейринга, секретные ключи или реальные команды.",
            ],
            links: [
              { label: "Проблемы MCP", href: "https://github.com/sergii-ziborov/granttap-mcp/issues" },
              { label: "Проблемы relay", href: "https://github.com/sergii-ziborov/granttap-relay/issues" },
              { label: "Закрытое сообщение об уязвимости", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" },
              { label: "Пакет npm", href: "https://www.npmjs.com/package/granttap-mcp" },
            ],
          },
        ],
      }}
    />
  );
}

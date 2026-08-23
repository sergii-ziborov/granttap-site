import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = { title: "Security", description: "The exact GrantTap Personal encryption and trust boundary.", alternates: { canonical: "/security" } };

export default function SecurityPage() {
  return <LegalPage
    title={{ en: "Security", ru: "Безопасность" }}
    updated={{ en: "August 23, 2026", ru: "23 августа 2026" }}
    updatedISO="2026-08-23"
    intro={{
      en: "GrantTap Personal is a native end-to-end encrypted control channel for local coding-agent sessions. It is not a model proxy, terminal, identity service, or universal agent security layer.",
      ru: "GrantTap Personal — native end-to-end encrypted control channel для локальных coding-agent sessions. Это не model proxy, terminal, identity service или универсальный security layer.",
    }}
    sections={{
      en: [
        { heading: "What remains local", bullets: ["Source repositories and workspaces.", "Provider credentials and model traffic.", "Readable prompts, commands, replies, attachments, and decisions except on authorized endpoints."] },
        { heading: "What the relay can see", bullets: ["Opaque room and mailbox identifiers, sender/recipient roles, timing, expiry, message size, IP address, and APNs routing metadata.", "Authenticated nonce and ciphertext.", "No browser approval, browser pairing, vault, or plaintext rendering endpoint exists in the Personal relay."] },
        { heading: "Keys and isolation", paragraphs: ["Pairing uses an independent transfer key that never leaves the QR/manual token. Authorized endpoints create and store device and per-task keys locally. One task key cannot decrypt another task."], bullets: ["Every WebSocket and push registration route requires the random room credential.", "Offline ciphertext queues are bounded, expiring, and retained until decrypt acknowledgement where supported.", "APNs receives a generic wake with no task content."] },
        { heading: "Scope and reporting", paragraphs: ["GrantTap reduces exposure of its control channel; it cannot make a provider, MCP server, skill, CLI, operating system, or user-approved command safe. Use provider controls and review risky actions."], links: [{ label: "Private vulnerability report", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" }, { label: "Public relay source", href: "https://github.com/sergii-ziborov/granttap-relay" }] },
      ],
      ru: [
        { heading: "Что остаётся локально", bullets: ["Репозитории и workspaces.", "Provider credentials и model traffic.", "Читаемые prompts, commands, replies, attachments и decisions — кроме разрешённых endpoints."] },
        { heading: "Что видит relay", bullets: ["Непрозрачные room/mailbox IDs, роли, время, expiry, размер, IP и APNs routing metadata.", "Аутентифицированные nonce и шифротекст.", "В Personal relay нет browser approval, browser pairing, vault или plaintext rendering endpoint."] },
        { heading: "Ключи и изоляция", paragraphs: ["Пейринг использует независимый transfer key, который не выходит из QR/manual token. Device и per-task keys создаются и хранятся локально. Ключ одной задачи не открывает другую."], bullets: ["WebSocket и push registration требуют случайный room credential.", "Offline ciphertext queues ограничены, истекают и при поддержке хранятся до decrypt acknowledgement.", "APNs получает нейтральный wake без task content."] },
        { heading: "Границы и сообщения", paragraphs: ["GrantTap защищает свой control channel, но не может сделать безопасными provider, MCP server, skill, CLI, OS или разрешённую пользователем команду. Проверяйте risky actions."], links: [{ label: "Закрытое сообщение об уязвимости", href: "https://github.com/sergii-ziborov/granttap-relay/security/advisories/new" }, { label: "Исходники relay", href: "https://github.com/sergii-ziborov/granttap-relay" }] },
      ],
    }}
  />;
}

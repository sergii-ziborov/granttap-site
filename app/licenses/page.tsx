import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Licenses",
  description: "GrantTap product and open-source license notices.",
  alternates: { canonical: "/licenses" },
};

export default function LicensesPage() {
  return (
    <LegalPage
      title={{ en: "Licenses and notices", ru: "Лицензии и уведомления" }}
      updated={{ en: "August 2, 2026", ru: "2 августа 2026" }}
      updatedISO="2026-08-02"
      intro={{
        en: "The mobile application is private software. Its public supporting components remain independently auditable.",
        ru: "Мобильное приложение является закрытым ПО. Его публичные вспомогательные компоненты доступны для независимой проверки.",
      }}
      sections={{
        en: [
          { heading: "GrantTap app", paragraphs: ["Copyright © 2026 Serhii Ziborov. All rights reserved. No source-code license is granted for the iPhone or Apple Watch application."] },
          {
            heading: "GrantTap open-source projects",
            links: [
              { label: "MCP bridge — MIT", href: "https://github.com/sergii-ziborov/granttap-mcp/blob/main/LICENSE" },
              { label: "Relay — MIT", href: "https://github.com/sergii-ziborov/granttap-relay/blob/main/LICENSE" },
              { label: "Website — MIT", href: "https://github.com/sergii-ziborov/granttap-site/blob/main/LICENSE" },
            ],
          },
          { heading: "Third-party software", bullets: ["TweetNacl SwiftWrap — MIT", "tweetnacl-js — Unlicense", "Model Context Protocol SDK — MIT", "ws — MIT", "Zod — MIT", "React and Next.js — MIT", "Cloudflare Workers tooling — applicable open-source licenses"] },
          { heading: "Trademarks", paragraphs: ["Apple, Apple Watch, iPhone, and App Store are trademarks of Apple Inc. Claude and Claude Code are trademarks of Anthropic. OpenAI and Codex are trademarks of OpenAI. Cursor belongs to Anysphere. Grok and xAI belong to xAI. All other names belong to their respective owners."] },
        ],
        ru: [
          { heading: "Приложение GrantTap", paragraphs: ["Copyright © 2026 Serhii Ziborov. Все права защищены. Лицензия на исходный код приложения для iPhone или Apple Watch не предоставляется."] },
          {
            heading: "Открытые проекты GrantTap",
            links: [
              { label: "MCP-мост — MIT", href: "https://github.com/sergii-ziborov/granttap-mcp/blob/main/LICENSE" },
              { label: "Relay — MIT", href: "https://github.com/sergii-ziborov/granttap-relay/blob/main/LICENSE" },
              { label: "Сайт — MIT", href: "https://github.com/sergii-ziborov/granttap-site/blob/main/LICENSE" },
            ],
          },
          { heading: "Стороннее ПО", bullets: ["TweetNacl SwiftWrap — MIT", "tweetnacl-js — Unlicense", "Model Context Protocol SDK — MIT", "ws — MIT", "Zod — MIT", "React и Next.js — MIT", "Инструменты Cloudflare Workers — соответствующие открытые лицензии"] },
          { heading: "Товарные знаки", paragraphs: ["Apple, Apple Watch, iPhone и App Store являются товарными знаками Apple Inc. Claude и Claude Code принадлежат Anthropic. OpenAI и Codex принадлежат OpenAI. Cursor принадлежит Anysphere. Grok и xAI принадлежат xAI. Остальные названия принадлежат соответствующим владельцам."] },
        ],
      }}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Licenses",
  description: "GrantTap commercial and open-source license notices.",
  alternates: { canonical: "/licenses" },
};

export default function LicensesPage() {
  return (
    <LegalPage
      title={{ en: "Licenses and notices", ru: "Лицензии и уведомления" }}
      updated={{ en: "September 25, 2026", ru: "25 сентября 2026" }}
      updatedISO="2026-09-25"
      intro={{
        en: "GrantTap app, desktop, relay, and website are commercial software. Public source access does not make them MIT-licensed. The MCP project has its own MIT license.",
        ru: "Приложение GrantTap, desktop, relay и сайт — коммерческое ПО. Публичный доступ к исходникам не делает их MIT-проектами. У MCP-проекта отдельная лицензия MIT.",
      }}
      sections={{
        en: [
          {
            heading: "GrantTap apps",
            paragraphs: ["Copyright © 2026 Serhii Ziborov. All rights reserved. The iPhone, iPad, and Apple Watch app uses the applicable App Store end-user license. A directly distributed Mac app uses the separate Desktop commercial end-user license when offered. The publicly readable first-party app source is governed by the GrantTap Commercial Source License."],
            links: [
              { label: "Commercial Source License", href: "https://github.com/sergii-ziborov/granttap/blob/main/LICENSE" },
              { label: "Desktop end-user license", href: "https://github.com/sergii-ziborov/granttap/blob/main/apps/macos/DESKTOP_EULA.md" },
            ],
          },
          {
            heading: "Open-source project",
            links: [
              { label: "MCP bridge — MIT", href: "https://github.com/sergii-ziborov/granttap-mcp/blob/main/LICENSE" },
            ],
          },
          {
            heading: "Relay and website source",
            paragraphs: ["Current first-party source versions are under the GrantTap Commercial Source License. Copies of earlier versions validly released under MIT retain their original MIT permissions; the change does not revoke them."],
            links: [
              { label: "Relay commercial source license", href: "https://github.com/sergii-ziborov/granttap-relay/blob/main/LICENSE" },
              { label: "Website commercial source license", href: "https://github.com/sergii-ziborov/granttap-site/blob/main/LICENSE" },
            ],
          },
          { heading: "Third-party software", bullets: ["TweetNacl SwiftWrap — MIT", "tweetnacl-js — Unlicense", "Model Context Protocol SDK — MIT", "ws — MIT", "Zod — MIT", "React and Next.js — MIT", "Weavatrix Rust graph and repository crates in the separate Engine — MIT where identified by their package licenses", "Cortex Context in the separate Engine — MIT OR Apache-2.0", "Cloudflare Workers tooling — applicable open-source licenses"] },
          { heading: "Related engineering projects", paragraphs: ["Cortex Loom contains both dual-licensed public crates and reserved-rights components; its unpublished cortex-weavatrix adapter is not covered by the public crate licenses. Weavatrix Loom is a separate dual-licensed MIT OR Apache-2.0 project, not a bundled GrantTap component. Their own repositories define the scope of each grant."], links: [{ label: "Cortex Loom licensing", href: "https://github.com/sergii-ziborov/cortex-loom/blob/main/docs/licensing.md" }, { label: "Weavatrix Loom", href: "https://github.com/Weavatrix/weavatrix-loom" }] },
          { heading: "Trademarks", paragraphs: ["Apple, Apple Watch, iPhone, and App Store are trademarks of Apple Inc. Claude and Claude Code are trademarks of Anthropic. OpenAI and Codex are trademarks of OpenAI. Cursor belongs to Anysphere. Grok and xAI belong to xAI. All other names belong to their respective owners."] },
        ],
        ru: [
          {
            heading: "Приложения GrantTap",
            paragraphs: ["Copyright © 2026 Serhii Ziborov. Все права защищены. Для приложения iPhone, iPad и Apple Watch действует применимая пользовательская лицензия App Store. Для Mac-приложения при прямом распространении действует отдельная коммерческая пользовательская лицензия. Публично доступный собственный код приложений регулируется GrantTap Commercial Source License."],
            links: [
              { label: "Коммерческая лицензия на исходный код", href: "https://github.com/sergii-ziborov/granttap/blob/main/LICENSE" },
              { label: "Пользовательская лицензия Desktop", href: "https://github.com/sergii-ziborov/granttap/blob/main/apps/macos/DESKTOP_EULA.md" },
            ],
          },
          {
            heading: "Проект с открытой лицензией",
            links: [
              { label: "MCP-мост — MIT", href: "https://github.com/sergii-ziborov/granttap-mcp/blob/main/LICENSE" },
            ],
          },
          {
            heading: "Исходный код relay и сайта",
            paragraphs: ["Текущие версии собственного кода регулируются GrantTap Commercial Source License. Копии прежних версий, законно выпущенных под MIT, сохраняют прежние права; новая лицензия их не отменяет."],
            links: [
              { label: "Коммерческая лицензия relay", href: "https://github.com/sergii-ziborov/granttap-relay/blob/main/LICENSE" },
              { label: "Коммерческая лицензия сайта", href: "https://github.com/sergii-ziborov/granttap-site/blob/main/LICENSE" },
            ],
          },
          { heading: "Стороннее ПО", bullets: ["TweetNacl SwiftWrap — MIT", "tweetnacl-js — Unlicense", "Model Context Protocol SDK — MIT", "ws — MIT", "Zod — MIT", "React и Next.js — MIT", "Крейты графа и анализа репозитория Weavatrix Rust в отдельном Engine — MIT там, где это указано в лицензии пакета", "Cortex Context в отдельном Engine — MIT OR Apache-2.0", "Инструменты Cloudflare Workers — соответствующие открытые лицензии"] },
          { heading: "Связанные инженерные проекты", paragraphs: ["В Cortex Loom есть как открытые крейты с двойной лицензией, так и компоненты с сохранёнными правами; неопубликованный адаптер cortex-weavatrix не покрывается лицензиями открытых крейтов. Weavatrix Loom — отдельный проект под MIT OR Apache-2.0, не встроенный в GrantTap. Область каждой лицензии определяют репозитории проектов."], links: [{ label: "Лицензии Cortex Loom", href: "https://github.com/sergii-ziborov/cortex-loom/blob/main/docs/licensing.md" }, { label: "Weavatrix Loom", href: "https://github.com/Weavatrix/weavatrix-loom" }] },
          { heading: "Товарные знаки", paragraphs: ["Apple, Apple Watch, iPhone и App Store являются товарными знаками Apple Inc. Claude и Claude Code принадлежат Anthropic. OpenAI и Codex принадлежат OpenAI. Cursor принадлежит Anysphere. Grok и xAI принадлежат xAI. Остальные названия принадлежат соответствующим владельцам."] },
        ],
      }}
    />
  );
}

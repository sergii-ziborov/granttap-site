import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "About GrantTap",
  description: "The people, devices, and engineering systems behind GrantTap.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <LegalPage
    title={{ en: "About GrantTap", ru: "О GrantTap" }}
    updated={{ en: "September 28, 2026", ru: "28 сентября 2026" }}
    updatedISO="2026-09-28"
    intro={{
      en: "GrantTap coordinates local coding agents, Mesh spaces, repository evidence, and human decisions across Apple devices.",
      ru: "GrantTap координирует локальных coding-агентов, пространства Mesh, сведения о репозиториях и решения человека на устройствах Apple.",
    }}
    sections={{
      en: [
        { heading: "Four surfaces, one Mesh", paragraphs: ["The proposed one-time Mac license and optional Personal subscription cover different needs: licensed local control and own relay remain available without Personal. Mac, iPhone, and iPad use the shared Apple client for Mesh spaces, Tasks, decisions, usage, and graph evidence where their connection supports it. Apple Watch keeps urgent work visible and sends short decisions through its paired iPhone."] },
        { heading: "Engineering system", paragraphs: ["GrantTap MCP connects coding agents and machine hooks. GrantTap Engine stores chat and Task records and combines Weavatrix repository evidence with Cortex context compilation. Mesh preserves Task identity across executions and machines while the relay carries encrypted envelopes without reading their contents."] },
        { heading: "Independent product", paragraphs: ["GrantTap is developed by Serhii Ziborov. References to Claude Code, Codex, Cursor, Grok Build, Apple, Weavatrix, and Cortex describe integrations or separately licensed components; they do not imply endorsement by their providers. The current legal licensor is identified in the product licenses and Terms of Use."], links: [{ label: "Terms of Use", href: "/terms" }, { label: "Licenses and notices", href: "/licenses" }] },
      ],
      ru: [
        { heading: "Единая Mesh на четырёх устройствах", paragraphs: ["Разовая лицензия Mac и необязательная Personal решают разные задачи: локальное управление и свой relay доступны без Personal. Mac, iPhone и iPad показывают одни и те же пространства Mesh, Tasks, решения, статистику и граф через общий Apple-клиент. Apple Watch держит срочные события на виду и отправляет короткие решения через связанный iPhone."] },
        { heading: "Инженерная система", paragraphs: ["GrantTap MCP связывает coding-агентов и машинные hooks. GrantTap Engine хранит записи чатов и Tasks и соединяет сведения Weavatrix о репозиториях с контекстом Cortex. Mesh сохраняет идентичность Task при смене исполнения и компьютера, а relay переносит зашифрованные сообщения без доступа к содержимому."] },
        { heading: "Независимый продукт", paragraphs: ["GrantTap разрабатывает Serhii Ziborov. Названия Claude Code, Codex, Cursor, Grok Build, Apple, Weavatrix и Cortex обозначают интеграции или отдельно лицензированные компоненты и не означают одобрения их владельцами. Действующий правообладатель указан в лицензиях и условиях использования."], links: [{ label: "Условия использования", href: "/terms" }, { label: "Лицензии и уведомления", href: "/licenses" }] },
      ],
    }}
  />;
}

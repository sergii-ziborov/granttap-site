import type { Metadata } from "next";
import { GuideShell } from "./GuideNavigation";
import { GuideHome } from "./GuideReader/Home";
import { localizedMetadata } from "../SearchMetadata";

export const metadata: Metadata = localizedMetadata("/guide", "ru",
  "Полное руководство GrantTap — подключение, задачи и управление агентами",
  "49 глав о GrantTap: подключение, чат, Files, Agents, Automations, перенос, Devices, вход и обновления провайдеров, кэш, Mesh и Governance. Настоящие скриншоты и поиск.",
  { bilingual: false });

export default function GuidePage() { return <GuideShell><GuideHome /></GuideShell>; }

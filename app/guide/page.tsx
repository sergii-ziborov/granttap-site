import type { Metadata } from "next";
import { GuideShell } from "./GuideNavigation";
import { GuideHome } from "./GuideReader/Home";

export const metadata: Metadata = {
  title: "Полное руководство GrantTap — подключение, задачи и управление агентами",
  description: "49 глав о GrantTap: подключение, чат, Files, Agents, Automations, перенос, Devices, вход и обновления провайдеров, кэш, Mesh и Governance. Настоящие скриншоты и поиск.",
  alternates: { canonical: "/guide" },
  openGraph: { title: "GrantTap, шаг за шагом", locale: "ru_RU", images: ["/guide/screens/now.png"] },
};

export default function GuidePage() { return <GuideShell><GuideHome /></GuideShell>; }

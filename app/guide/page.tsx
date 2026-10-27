import type { Metadata } from "next";
import { GuideShell } from "./GuideNavigation";
import { GuideHome } from "./GuideReader/Home";
import { guideSearchIndex } from "./GuideContent";

export const metadata: Metadata = {
  title: "Руководство GrantTap — от подключения до Governance",
  description: "Подробный гайд по GrantTap: MCP, Mac и iPhone, доставка сообщений, очередь, Governance, Mesh, Usage. Реальные экраны и поиск по всем главам.",
  alternates: { canonical: "/guide" },
  openGraph: { title: "GrantTap, шаг за шагом", locale: "ru_RU", images: ["/guide/screens/now.png"] },
};

export default function GuidePage() { return <GuideShell searchIndex={guideSearchIndex}><GuideHome /></GuideShell>; }

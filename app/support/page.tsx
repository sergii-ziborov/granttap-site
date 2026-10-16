import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { documentProps } from "../ProductInformation";

export const metadata: Metadata = {
  title: "Support", description: "GrantTap setup, connection guides, troubleshooting and frequently asked questions.",
  alternates: { canonical: "/support" },
};

export default function Page() { return <LegalPage {...documentProps("support")} />; }

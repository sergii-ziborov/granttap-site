import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { documentProps } from "../ProductInformation";

export const metadata: Metadata = {
  title: "Licenses", description: "GrantTap commercial licenses and exact third-party notices.",
  alternates: { canonical: "/licenses" },
};

export default function Page() { return <LegalPage {...documentProps("licenses")} />; }

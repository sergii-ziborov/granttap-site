import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { documentProps } from "../ProductInformation";

export const metadata: Metadata = {
  title: "Terms of Use", description: "GrantTap commercial purchase and service terms.",
  alternates: { canonical: "/terms" },
};

export default function Page() { return <LegalPage {...documentProps("terms")} />; }

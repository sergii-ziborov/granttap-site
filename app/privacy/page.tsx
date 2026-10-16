import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";
import { documentProps } from "../ProductInformation";

export const metadata: Metadata = {
  title: "Privacy Policy", description: "GrantTap account, encrypted delivery, local storage and privacy choices.",
  alternates: { canonical: "/privacy" },
};

export default function Page() { return <LegalPage {...documentProps("privacy")} />; }

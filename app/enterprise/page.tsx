import type { Metadata } from "next";
import { EnterpriseView } from "../components/EnterpriseView";

export const metadata: Metadata = {
  title: "Enterprise endpoint control",
  description: "Signed organization policy, device-bound login, and fail-closed controls for coding-agent endpoints.",
  alternates: { canonical: "/enterprise" },
};

export default function EnterprisePage() {
  return <EnterpriseView />;
}

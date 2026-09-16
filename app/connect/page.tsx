import type { Metadata } from "next";
import { ConnectView } from "./ConnectView";

export const metadata: Metadata = {
  title: "Connect your coding app",
  description: "Approve a local coding app on GrantTap without exposing pairing keys.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/connect" },
};

export default function ConnectPage() {
  return <ConnectView />;
}

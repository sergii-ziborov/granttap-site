import type { Metadata } from "next";
import { AccountView } from "./AccountView";

export const metadata: Metadata = {
  title: "Account",
  description: "Sign in to your GrantTap account with a passkey, your iPhone, a password or a sign-in token, and manage its devices.",
  alternates: { canonical: "/account" },
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}

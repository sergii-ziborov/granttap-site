import type { Metadata } from "next";
import { SignInView } from "./SignInView";

export const metadata: Metadata = {
  title: "Open your GrantTap sign-in link",
  description: "Continue securely in the GrantTap app.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sign-in" },
};

export default function SignInPage() { return <SignInView />; }

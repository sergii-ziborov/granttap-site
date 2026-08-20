import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Secure account sign-in",
  description: "Open GrantTap Web and sign in with a one-time QR approved on your iPhone.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <main className="account-launch">
    <meta httpEquiv="refresh" content="0;url=https://granttap.com/account/index.html" />
    <Link className="brand" href="/"><Image src="/app-icon.png" alt="" width={1024} height={1024} priority /><span>GrantTap</span></Link>
    <section><p className="eyebrow">Secure web vault</p><h1>Opening QR sign-in…</h1><p>GrantTap Web will create a one-time request for your iPhone.</p><a className="button button-primary" href="https://granttap.com/account/index.html">Continue</a></section>
  </main>;
}

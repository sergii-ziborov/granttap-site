import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://granttap.com"),
  title: {
    default: "GrantTap — Keep Codex and Claude Code moving",
    template: "%s · GrantTap",
  },
  description:
    "A secure iPhone and Apple Watch remote for Codex and Claude Code sessions already running on your Mac.",
  applicationName: "GrantTap",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Apple Watch",
    "Claude Code",
    "Codex",
    "coding agent",
    "developer tools",
    "remote approval",
  ],
  icons: {
    icon: "/favicon.png",
    apple: "/app-icon.png",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "GrantTap",
    title: "Step away from your Mac. Keep the work moving.",
    description:
      "Approve, reply, and inspect real Codex and Claude Code tasks from iPhone and Apple Watch.",
  },
  twitter: {
    card: "summary",
    title: "Step away from your Mac. Keep the work moving.",
    description:
      "A secure iPhone and Apple Watch remote for local Codex and Claude Code sessions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

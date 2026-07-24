import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://granttap.com"),
  title: {
    default: "GrantTap — Control coding agents from Apple Watch",
    template: "%s · GrantTap",
  },
  description:
    "Approve commands, answer questions, and inspect visible activity from Claude Code and Codex on Apple Watch and iPhone.",
  applicationName: "GrantTap",
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
    title: "GrantTap — Keep coding agents moving from your wrist",
    description:
      "Review commands, answer questions, and inspect visible agent activity from Apple Watch and iPhone.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GrantTap — Approve the next move from Apple Watch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GrantTap — Keep coding agents moving from your wrist",
    description:
      "Secure remote approvals and visible activity for Claude Code and Codex.",
    images: ["/og.png"],
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

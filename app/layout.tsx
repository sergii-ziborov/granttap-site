import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://granttap.com"),
  title: {
    default: "GrantTap — Keep Cursor, Claude, Codex, Copilot, and Grok moving",
    template: "%s · GrantTap",
  },
  description:
    "A secure iPhone and Apple Watch remote for Cursor, Claude Code, Codex, Copilot, and Grok Build — approvals, questions, and chat for sessions already on your computer.",
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
    "Cursor",
    "GitHub Copilot",
    "Grok Build",
    "coding agent",
    "developer tools",
    "remote approval",
    "MCP",
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
      "Approve commands, answer questions, and chat with Cursor, Claude Code, Codex, Copilot, and Grok Build from iPhone and Apple Watch.",
    images: [
      {
        url: "/og-granttap.png",
        width: 1659,
        height: 948,
        alt: "GrantTap securely connects coding-agent tasks on a Mac to iPhone and Apple Watch.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Step away from your Mac. Keep the work moving.",
    description:
      "A secure iPhone and Apple Watch remote for local Cursor, Claude Code, Codex, Copilot, and Grok Build sessions.",
    images: ["/og-granttap.png"],
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

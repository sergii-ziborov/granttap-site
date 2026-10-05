import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://granttap.com"),
  title: {
    default: "GrantTap — All your coding agents. One live control center.",
    template: "%s · GrantTap",
  },
  description:
    "Coordinate Claude Code, Codex, Cursor, and Grok Build across computers with Mesh, Governance, and a distributed evidence graph on Mac, iPhone, iPad, and Apple Watch.",
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
    "Mac",
    "iPhone",
    "iPad",
    "Apple Watch",
    "Claude Code",
    "Codex",
    "Cursor",
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
    title: "All your coding agents. One live control center.",
    description:
      "Coordinate local Claude Code, Codex, Cursor, and Grok Build tasks across Mac, iPhone, iPad, and Apple Watch.",
    images: [
      {
        url: "/product/iphone-command-center.png?v=20260828-1",
        width: 1320,
        height: 2868,
        alt: "The current GrantTap task list and composer on iPhone.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "All your coding agents. One live control center.",
    description:
      "A secure Personal live control center for local Claude Code, Codex, Cursor, and Grok Build sessions.",
    images: ["/product/iphone-command-center.png?v=20260828-1"],
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

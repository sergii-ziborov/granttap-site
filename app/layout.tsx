import type { Metadata } from "next";
import "./globals.css";
import { headers } from "next/headers";
import { AppearanceController } from "./Appearance";
import { appearanceBootstrap } from "./Appearance/bootstrap";

export const metadata: Metadata = {
  metadataBase: new URL("https://granttap.com"),
  title: { default: "GrantTap — Claude Code and Codex on iPhone, iPad & Mac", template: "%s · GrantTap" },
  description: "Follow local coding agents, review approvals and continue Tasks from iPhone, iPad, Mac and Apple Watch.",
  applicationName: "GrantTap",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: [{ url: "/brand/favicon-32.png", sizes: "32x32", type: "image/png" }], apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }] },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#090a0c", colorScheme: "dark light" };

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = (await headers()).get("x-granttap-locale") === "ru" ? "ru" : "en";
  return (
    <html lang={locale} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: appearanceBootstrap }} /></head>
      <body><AppearanceController />{children}</body>
    </html>
  );
}

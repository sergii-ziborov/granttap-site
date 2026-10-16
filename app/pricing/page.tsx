import type { Metadata } from "next";
import { PricingView } from "../ProductOffer/PricingView";

export const metadata: Metadata = {
  title: "Pricing and subscriptions",
  description: "Three monthly managed-computer plans and a separate one-time Mac Local license. Planned US launch prices and purchase conditions.",
  alternates: { canonical: "/pricing", languages: { en: "/pricing", ru: "/pricing?lang=ru" } },
};

export default function PricingPage() { return <PricingView />; }

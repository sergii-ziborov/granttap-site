import type { Metadata } from "next";
import { ControlCenter } from "./ControlCenter";
export const metadata: Metadata = { title: "Control center", description: "Your coding agents, Tasks and Mesh in the browser.",
  alternates: { canonical: "/control" }, robots: { index: false, follow: false } };
export default function ControlPage() { return <ControlCenter />; }

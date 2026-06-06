import type { Metadata } from "next";
import { RegulatoryUpdatesPage } from "@/features/regulatory-updates/components/regulatory-updates-page";

export const metadata: Metadata = {
  title: "Regulatory Updates | LaunchSafe",
};

export default function RegulatoryUpdatesRoute() {
  return <RegulatoryUpdatesPage />;
}

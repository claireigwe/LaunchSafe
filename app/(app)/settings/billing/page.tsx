import type { Metadata } from "next";
import { BillingPage } from "@/features/billing/components/billing-page";

export const metadata: Metadata = {
  title: "Billing | LaunchSafe",
};

export default function BillingSettingsPage() {
  return <BillingPage />;
}

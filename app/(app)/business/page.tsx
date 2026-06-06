import type { Metadata } from "next";
import { BusinessPage } from "@/features/businesses/components/business-page";

export const metadata: Metadata = {
  title: "Business | LaunchSafe",
};

export default function BusinessRoute() {
  return <BusinessPage />;
}

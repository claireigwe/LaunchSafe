import type { Metadata } from "next";
import { DashboardPage } from "@/features/compliance/components/dashboard/dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | LaunchSafe",
};

export default function Dashboard() {
  return <DashboardPage />;
}

import type { Metadata } from "next";
import { ReportingPage } from "@/features/reporting/components/reporting-page";

export const metadata: Metadata = {
  title: "Advanced Reporting | LaunchSafe",
};

export default function ReportsRoute() {
  return <ReportingPage />;
}

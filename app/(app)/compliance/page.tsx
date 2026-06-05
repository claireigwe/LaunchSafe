import type { Metadata } from "next";
import { TaskListPage } from "@/features/compliance/components/tasks/task-list-page";

export const metadata: Metadata = {
  title: "Compliance Tasks | LaunchSafe",
};

export default function CompliancePage() {
  return <TaskListPage />;
}

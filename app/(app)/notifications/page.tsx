import type { Metadata } from "next";
import { NotificationCenter } from "@/features/notifications/components/notification-center";

export const metadata: Metadata = {
  title: "Notifications | LaunchSafe",
};

export default function NotificationsPage() {
  return <NotificationCenter />;
}

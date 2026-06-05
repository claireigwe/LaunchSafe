import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = {
  title: "Settings | LaunchSafe",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}

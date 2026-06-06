import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = {
  title: "Settings | LaunchSafe",
};

export default function SettingsRoute() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</div>}>
      <SettingsPage />
    </Suspense>
  );
}

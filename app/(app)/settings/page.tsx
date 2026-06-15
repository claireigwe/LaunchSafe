import { Suspense } from "react";
import type { Metadata } from "next";
import { SettingsPage } from "@/features/settings/components/settings-page";

export const metadata: Metadata = {
  title: "Settings | LaunchSafe",
};

export default function SettingsRoute() {
  return (
    <Suspense fallback={<div style={{ maxWidth: 800, margin: "0 auto", padding: "100px 24px" }}><div className="sk" style={{ width: 200, height: 28, marginBottom: 32 }} /><div className="sk" style={{ width: "100%", height: 200, marginBottom: 24 }} /><div className="sk" style={{ width: "100%", height: 120 }} /></div>}>
      <SettingsPage />
    </Suspense>
  );
}

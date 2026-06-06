import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BusinessOnboardingWizard } from "@/features/businesses/components/business-onboarding-wizard";

export const metadata: Metadata = {
  title: "Add Your Business | LaunchSafe",
  description: "Set up your business compliance workspace.",
};

export default function BusinessOnboardingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-role-light-surfaceContainerLowest)" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "16px 24px 0" }}>
        <Link
          href="/business"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 500, color: "var(--color-role-light-onSurfaceVariant)", textDecoration: "none", padding: "8px 0" }}
        >
          <ChevronLeft size={16} />
          Back to Business
        </Link>
      </div>
      <main>
        <Suspense fallback={<div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</div>}>
          <BusinessOnboardingWizard />
        </Suspense>
      </main>
    </div>
  );
}

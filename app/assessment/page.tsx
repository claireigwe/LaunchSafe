import { Suspense } from "react";
import type { Metadata } from "next";
import { AssessmentShell } from "@/features/assessments/components/assessment-shell";

export const metadata: Metadata = {
  title: "Business Compliance Assessment | LaunchSafe",
  description:
    "Discover your compliance requirements in minutes. Free assessment for African businesses.",
};

export default function AssessmentPage() {
  return (
    <Suspense fallback={<div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</div>}>
      <AssessmentShell />
    </Suspense>
  );
}

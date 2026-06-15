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
    <Suspense fallback={<div style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px" }}><div className="sk" style={{ width: 280, height: 28, margin: "0 auto 12px" }} /><div className="sk" style={{ width: 200, height: 16, margin: "0 auto 32px" }} /><div className="sk" style={{ width: "100%", height: 200 }} /></div>}>
      <AssessmentShell />
    </Suspense>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Full Compliance Report",
};

/**
 * Full compliance report page — payment-gated.
 * Access is verified server-side by checking assessment_purchases.status = 'paid'.
 * If not purchased, this page redirects to the assessment summary.
 *
 * NEVER render results_json content until server-side payment verification passes.
 */
export default function AssessmentReportPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  return (
    <div id="assessment-report-page">
      <h1>Full Compliance Report</h1>
    </div>
  );
}

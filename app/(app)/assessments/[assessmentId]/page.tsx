import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Summary",
};

/**
 * Assessment summary page — visible before payment.
 * Only shows: business type, location, requirement count, agency count,
 * compliance complexity score, and categories.
 * NEVER shows: requirements, costs, risks, or roadmap.
 */
export default function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  return (
    <div id="assessment-detail-page">
      <h1>Assessment Summary</h1>
    </div>
  );
}

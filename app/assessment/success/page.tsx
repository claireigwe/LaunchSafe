import { Suspense } from "react";
import { AssessmentSuccessContent } from "./content";

export default function AssessmentSuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 16, color: "var(--color-role-light-onSurfaceVariant)" }}>Loading...</p>
      </main>
    }>
      <AssessmentSuccessContent />
    </Suspense>
  );
}

import { Suspense } from "react";
import { AssessmentSuccessContent } from "./content";

export default function AssessmentSuccessPage() {
  return (
    <Suspense fallback={
      <main style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
        <div className="sk" style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto 24px" }} /><div className="sk" style={{ width: 280, height: 24, margin: "0 auto 8px" }} /><div className="sk" style={{ width: 200, height: 14, margin: "0 auto" }} />
      </main>
    }>
      <AssessmentSuccessContent />
    </Suspense>
  );
}

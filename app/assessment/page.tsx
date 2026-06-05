import { Suspense } from "react";
import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AssessmentWizard } from "@/features/assessments/components/assessment-wizard";
import { FullReportScreen } from "@/features/assessments/components/full-report-screen";

export const metadata: Metadata = {
  title: "Business Compliance Assessment | LaunchSafe",
  description:
    "Discover your compliance requirements in minutes. Free assessment for African businesses.",
};

export default function AssessmentPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <>
      <Header />
      <main>
        <AssessmentContent searchParamsPromise={searchParams} />
      </main>
      <Footer />
    </>
  );
}

async function AssessmentContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParamsPromise;
  const isPaidCallback = params.paid && params.trxref;

  if (isPaidCallback) {
    return (
      <Suspense fallback={<div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading report...</div>}>
        <FullReportScreen />
      </Suspense>
    );
  }

  return <AssessmentWizard />;
}

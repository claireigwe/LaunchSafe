import type { Metadata } from "next";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { AssessmentWizard } from "@/features/assessments/components/assessment-wizard";

export const metadata: Metadata = {
  title: "Business Compliance Assessment | LaunchSafe",
  description:
    "Discover your compliance requirements in minutes. Free assessment for African businesses.",
};

export default function AssessmentPage() {
  return (
    <>
      <Header />
      <main>
        <AssessmentWizard />
      </main>
      <Footer />
    </>
  );
}

import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import { ReportContent } from "./report-content";
import { FileText } from "lucide-react";

async function ReportFetcher({ reportId }: { reportId: string }) {
  const user = await getRequiredUser();
  const supabase = createAdminClient() as any;

  let report: any;
  try {
    report = await AssessmentEngine.getFullReport(reportId, user.id);
  } catch {
    redirect("/dashboard");
    return null;
  }

  let businessInfo: Record<string, any> | null = null;
  const { data: assessment } = await supabase
    .from("assessments")
    .select("wizard_data")
    .eq("id", reportId)
    .maybeSingle();

  if (assessment?.wizard_data) {
    const wd = assessment.wizard_data;
    businessInfo = {
      businessType: wd.basics?.businessType || wd.basics?.businessStage || "",
      industry: wd.basics?.industry || "",
      location: wd.location?.state ? `${wd.location.state}, Nigeria` : "Nigeria",
      businessStage: wd.basics?.businessStage || "",
      employeeCount: wd.team?.employeeCount || "",
    };
  }

  if (assessment && !assessment.user_id) {
    await supabase.from("assessments").update({ user_id: user.id }).eq("id", reportId);
  }

  return <ReportContent report={report} businessInfo={businessInfo} reportId={reportId} />;
}

export default function AssessmentReportPage({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  return (
    <Suspense fallback={
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div className="sk" style={{ width: 140, height: 16 }} />
          <div className="sk" style={{ width: 120, height: 36, borderRadius: 12 }} />
        </div>
        <div style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 24, overflow: "hidden", marginBottom: 24 }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <FileText size={20} style={{ color: "var(--color-role-light-primary)" }} />
              <div className="sk" style={{ width: 200, height: 22 }} />
            </div>
          </div>
          <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {[1,2,3,4,5].map((i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "rgba(255,255,255,0.4)", borderRadius: 16, border: "1px solid var(--color-role-light-outlineVariant)" }}>
                <div className="sk" style={{ width: 80, height: 10 }} />
                <div className="sk" style={{ width: 120, height: 16 }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {[1,2].map((i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 12, padding: "12px 16px" }}>
              <div className="sk" style={{ width: 120, height: 16 }} />
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          {[1,2,3].map((i) => (
            <div key={i} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
              <div className="sk" style={{ width: 60, height: 10, marginBottom: 4 }} />
              <div className="sk" style={{ width: 100, height: 18 }} />
            </div>
          ))}
        </div>
      </div>
    }>
      <ReportFetcherWrapper params={params} />
    </Suspense>
  );
}

async function ReportFetcherWrapper({
  params,
}: {
  params: Promise<{ reportId: string }>;
}) {
  const { reportId } = await params;
  return <ReportFetcher reportId={reportId} />;
}

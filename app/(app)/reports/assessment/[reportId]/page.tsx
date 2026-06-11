"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FileText, AlertTriangle, Building2, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AssessmentFullReport, AssessmentRequirement } from "@/types/domain/assessment";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "rgba(255,255,255,0.4)", borderRadius: 16, border: "1px solid var(--color-role-light-outlineVariant)" }}>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 11, fontWeight: 600, color: "var(--color-role-light-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurface)" }}>{value}</span>
    </div>
  );
}

export default function AssessmentReportPage() {
  const { reportId } = useParams<{ reportId: string }>();
  const router = useRouter();
  const [report, setReport] = useState<AssessmentFullReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!reportId) return;
    fetch(`/api/assessments/${reportId}/report`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setReport(json.data);
        else setError(json.error?.message || "Report not found");
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [reportId]);

  if (loading) return <div style={{ padding: "100px 24px", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading report...</div>;

  if (error) return (
    <div style={{ padding: "100px 24px", textAlign: "center" }}>
      <p style={{ color: "var(--color-role-light-error)", marginBottom: 16 }}>{error}</p>
      <Button variant="primary" onClick={() => router.push("/dashboard")}>Go to Dashboard</Button>
    </div>
  );

  if (!report) return null;

  const totalCost = (report.totalOfficialCost || 0) + (report.totalEstimatedCost || 0);
  const complexity = report.requirements && report.requirements.length > 8 ? "high" : report.requirements && report.requirements.length > 4 ? "medium" : "low";
  const complexityColor = complexity === "high" ? "var(--color-role-light-error)" : complexity === "medium" ? "#d97706" : "var(--color-role-light-success)";

  return (
    <div>
      <button type="button" onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--color-role-light-primary)", fontSize: 14, marginBottom: 24, padding: 0, fontFamily: "var(--font-label-label-medium-fontFamily)" }}>
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, overflow: "hidden", marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <FileText size={20} style={{ color: "var(--color-role-light-primary)" }} />
            <h1 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 20, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Compliance Report</h1>
          </div>
          <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: complexityColor + "20", color: complexityColor }}>{complexity.toUpperCase()} COMPLEXITY</span>
        </div>
        <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <DetailRow label="Total Requirements" value={String(report.requirements?.length || 0)} />
          <DetailRow label="Risk Level" value={report.riskLevel} />
          <DetailRow label="Official Fees" value={`₦${(report.totalOfficialCost || 0).toLocaleString("en-US")}`} />
          <DetailRow label="Estimated Total" value={`₦${totalCost.toLocaleString("en-US")}`} />
        </div>
      </div>

      {report.requirements && report.requirements.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Requirements & Obligations</h2>
          {report.requirements.map((req, idx) => (
            <div key={idx} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>{req.name}</h3>
                <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, background: req.confidenceLevel === "verified" ? "#eef2ff" : req.confidenceLevel === "estimated" ? "#fefce8" : "#f5f5f5", color: req.confidenceLevel === "verified" ? "#2563eb" : req.confidenceLevel === "estimated" ? "#d97706" : "#666" }}>
                  {req.confidenceLevel === "verified" ? "Verified" : req.confidenceLevel === "estimated" ? "Estimated" : "Community"}
                </span>
              </div>
              <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 12px", lineHeight: 1.5 }}>{req.description}</p>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}><Building2 size={12} /> {req.agencyName}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}><Clock size={12} /> {req.frequency}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)" }}><Shield size={12} /> {req.requirementType}</span>
              </div>
              {(req.officialCost || req.estimatedCost) && (
                <div style={{ marginTop: 12, display: "flex", gap: 16 }}>
                  {req.officialCost && <span style={{ fontSize: 12, color: "var(--color-key-success)" }}>Official: ₦{req.officialCost.toLocaleString("en-US")}</span>}
                  {req.estimatedCost && <span style={{ fontSize: 12, color: "#d97706" }}>Estimated: ₦{req.estimatedCost.toLocaleString("en-US")}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {report.riskFactors && report.riskFactors.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <AlertTriangle size={16} style={{ color: "#d97706" }} />
            <h2 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Risk Analysis</h2>
          </div>
          <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.6 }}>
            {report.riskFactors.map((f, i) => (<span key={i}>{f}{i < report.riskFactors.length - 1 ? <br/> : ""}</span>))}
          </p>
        </div>
      )}
    </div>
  );
}

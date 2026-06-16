"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, AlertTriangle, Building2, Shield, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { formatKobo } from "@/lib/utils/currency";
import type { AssessmentFullReport } from "@/types/domain/assessment";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "rgba(255,255,255,0.4)", borderRadius: 16, border: "1px solid var(--color-role-light-outlineVariant)" }}>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 11, fontWeight: 600, color: "var(--color-role-light-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurface)" }}>{value}</span>
    </div>
  );
}

interface Props {
  report: AssessmentFullReport;
  businessInfo: Record<string, any> | null;
  reportId: string;
}

export function ReportContent({ report, businessInfo, reportId }: Props) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  async function downloadPdf() {
    setDownloading(true);
    try {
      const element = reportRef.current;
      if (!element) return;
      await generatePdfFromHtml(element, "LaunchSafe-Compliance-Report.pdf");
    } catch (err) {
      console.error("[Report] PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  const complexity = report.requirements && report.requirements.length > 8 ? "high" : report.requirements && report.requirements.length > 4 ? "medium" : "low";
  const complexityColor = complexity === "high" ? "var(--color-role-light-error)" : complexity === "medium" ? "#d97706" : "var(--color-role-light-success)";

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <button type="button" onClick={() => router.push("/dashboard")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: "var(--color-role-light-primary)", fontSize: 14, padding: 0, fontFamily: "var(--font-label-label-medium-fontFamily)" }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
        <Button variant="primary" size="sm" onClick={downloadPdf} isLoading={downloading}>
          <Download size={16} style={{ marginRight: 6 }} />
          Download PDF
        </Button>
      </div>

      <div ref={reportRef}>
        {/* Summary header */}
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
            <DetailRow label="Official Costs" value={`${formatKobo(report.officialCosts?.min || 0)} – ${formatKobo(report.officialCosts?.max || 0)}`} />
            <DetailRow label="Setup Costs" value={`${formatKobo(report.commonSetupCostRange?.min || 0)} – ${formatKobo(report.commonSetupCostRange?.max || 0)}`} />
            <DetailRow label="Budget Estimate" value={`${formatKobo(report.estimatedBudget?.min || 0)} – ${formatKobo(report.estimatedBudget?.max || 0)}+`} />
          </div>
        </div>

        {/* Business Profile */}
        {businessInfo && (
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 24, padding: 20, marginBottom: 20 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, margin: "0 0 12px" }}>Business Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              {businessInfo.businessType && (
                <div>
                  <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>Business Type</span>
                  <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)" }}>{businessInfo.businessType}</span>
                </div>
              )}
              {businessInfo.industry && (
                <div>
                  <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>Industry</span>
                  <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)" }}>{businessInfo.industry.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}</span>
                </div>
              )}
              {businessInfo.location && (
                <div>
                  <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>Location</span>
                  <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)" }}>{businessInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Stats row */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Building2 size={18} style={{ color: "var(--color-role-light-primary)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)" }}>{report.agencies?.length || 0} agencies involved</span>
          </div>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
            <Shield size={18} style={{ color: report.riskLevel === "high" ? "var(--color-role-light-error)" : report.riskLevel === "medium" ? "#d97706" : "var(--color-key-success)", flexShrink: 0 }} />
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)", textTransform: "capitalize" }}>{report.riskLevel} risk</span>
          </div>
        </div>

        {/* Cost Summary - 3 Categories */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>OFFICIAL COSTS</span>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "var(--color-key-success)" }}>{formatKobo(report.officialCosts?.min || 0)} – {formatKobo(report.officialCosts?.max || 0)}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>SETUP COSTS</span>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "#d97706" }}>{report.commonSetupCostRange ? `${formatKobo(report.commonSetupCostRange.min)} – ${formatKobo(report.commonSetupCostRange.max)}` : "Varies"}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>LOCAL COSTS</span>
            <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "var(--color-role-light-onSurfaceVariant)" }}>Varies</span>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderLeft: "4px solid var(--color-role-light-primary)", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
          <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 2 }}>ESTIMATED LAUNCH BUDGET</span>
          <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 22, fontWeight: 700, color: "var(--color-role-light-primary)" }}>
            {formatKobo(report.estimatedBudget?.min || 0)} – {formatKobo(report.estimatedBudget?.max || 0)}+
          </span>
        </div>

        {/* Common Setup Costs */}
        {report.commonSetupCosts && report.commonSetupCosts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Common Setup Costs</h3>
            <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 12px" }}>Typical expenses when launching your business (not regulatory requirements).</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.commonSetupCosts.map((item: any, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: "14px 16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                    <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{item.label}</span>
                    <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 12, fontWeight: 500, color: "var(--color-role-light-primary)" }}>{item.range}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.4 }}>{item.reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Potential Local Costs */}
        {report.localCosts && report.localCosts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Potential Local Costs & Levies</h3>
            <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-error)", margin: "0 0 12px" }}>{report.localCostNote}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.localCosts.map((item: any, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: "14px 16px" }}>
                  <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)", display: "block", marginBottom: 2 }}>{item.label}</span>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.4 }}>{item.note}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How We Calculated */}
        <div style={{ border: "1.5px dashed var(--color-role-light-outlineVariant)", borderRadius: 16, padding: 20, marginBottom: 24, background: "var(--color-role-light-surfaceBright)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="var(--color-role-light-primary)" strokeWidth="1.5" fill="none" /><path d="M9 5V9M9 12V12.01" stroke="var(--color-role-light-primary)" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-primary)", margin: 0 }}>How We Calculated This Estimate</h3>
          </div>
          <div style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 13, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "var(--color-key-success)" }}>Official Compliance Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on verified government fee schedules from regulatory agencies. These are the minimum fees required to meet regulatory obligations.</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#d97706" }}>Common Setup Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on typical expenses Nigerian businesses incur during registration and launch. These are estimates and may vary.</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "var(--color-role-light-onSurfaceVariant)" }}>Potential Local Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on common local government and association charges. These are not official federal requirements and vary significantly.</span>
            </p>
            <p style={{ margin: "4px 0 0", fontStyle: "italic", color: "var(--color-role-light-onSurfaceVariant)" }}>All figures are estimates. Verify actual costs with the relevant agencies before budgeting.</p>
          </div>
        </div>

        {/* Requirements */}
        {report.requirements && report.requirements.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Requirements ({report.requirements.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.requirements.map((req: any, idx: number) => (
                <div key={idx} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, flex: 1 }}>{req.name}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: req.confidenceLevel === "verified" ? "#eef2ff" : req.confidenceLevel === "estimated" ? "#fefce8" : "#f5f5f5", color: req.confidenceLevel === "verified" ? "#2563eb" : req.confidenceLevel === "estimated" ? "#d97706" : "#666", flexShrink: 0, marginLeft: 8 }}>
                      {req.confidenceLevel === "verified" ? "Verified" : req.confidenceLevel === "estimated" ? "Estimated" : "Community"}
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 6px", lineHeight: 1.4 }}>{req.description}</p>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>
                    <span>{req.agencyName}</span>
                    <span>· {req.frequency}</span>
                    {req.officialCost != null && req.officialCost > 0 && <span style={{ color: "var(--color-key-success)" }}>Official: {formatKobo(req.officialCost)}</span>}
                    {req.estimatedCost != null && req.estimatedCost > 0 && <span style={{ color: "#d97706" }}>Est: {formatKobo(req.estimatedCost)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Analysis */}
        {report.riskFactors && report.riskFactors.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Risk Analysis</h3>
            <div style={{
              background: report.riskLevel === "high"
                ? "var(--color-palette-error-95)"
                : report.riskLevel === "medium"
                ? "var(--color-palette-warning-95)"
                : "rgba(255,255,255,0.75)",
              border: report.riskLevel === "high"
                ? "1px solid var(--color-palette-error-80)"
                : report.riskLevel === "medium"
                ? "1px solid var(--color-palette-warning-80)"
                : "1px solid rgba(255,255,255,0.9)",
              borderRadius: 16, padding: 20
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <AlertTriangle size={16} style={{ color: report.riskLevel === "high" ? "var(--color-role-light-error)" : report.riskLevel === "medium" ? "#d97706" : "var(--color-key-success)" }} />
                <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, textTransform: "capitalize" }}>{report.riskLevel} Risk</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                {report.riskFactors.map((factor: string, i: number) => (
                  <li key={i} style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 13, lineHeight: 1.5 }}>{factor}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Compliance Roadmap */}
        {report.roadmap && report.roadmap.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Your Compliance Roadmap</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.roadmap.map((phase: any, i: number) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.75)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-role-light-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>{i + 1}</div>
                    <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 600 }}>{phase.title}</span>
                    <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)", marginLeft: "auto" }}>{phase.estimatedDuration}</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 6px", lineHeight: 1.4 }}>{phase.description}</p>
                  {phase.requirements.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {phase.requirements.map((req: string, j: number) => (
                        <span key={j} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "var(--color-role-light-surfaceContainerLow)", color: "var(--color-role-light-onSurfaceVariant)" }}>{req}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

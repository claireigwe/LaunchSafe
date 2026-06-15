"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { Header } from "@/components/shared/header";
import { Footer } from "@/components/shared/footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, UserPlus, Building2, Clock, Shield } from "lucide-react";
import type { AssessmentFullReport, AssessmentRequirement } from "@/types/domain/assessment";

export function AssessmentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [report, setReport] = useState<AssessmentFullReport | null>(null);
  const [businessInfo, setBusinessInfo] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const assessmentId = searchParams.get("assessmentId");
  const trxref = searchParams.get("trxref");

  useEffect(() => {
    if (!assessmentId || !trxref) {
      setError("Missing payment information.");
      setLoading(false);
      return;
    }

    fetch("/api/assessments/verify-public", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ assessmentId, trxref }),
    })
    .then(r => r.json())
    .then(json => {
      if (json.success && json.data?.report) {
        setReport(json.data.report);
        if (json.data.businessInfo) setBusinessInfo(json.data.businessInfo);
      } else {
        setError(json.error?.message || "Failed to verify payment.");
      }
    })
    .catch(() => setError("Network error. Please try again."))
    .finally(() => {
      setLoading(false);
      // Preload PDF library in background for instant download
      // @ts-expect-error - html2pdf.js has no types
      import("html2pdf.js/dist/html2pdf.bundle.js").catch(() => {});
    });
  }, [assessmentId, trxref]);

  function formatCurrency(amount: number) {
    return `₦${Math.round(amount / 100).toLocaleString("en-US")}`;
  }

  async function downloadPdf() {
    setDownloading(true);
    try {
      const element = reportRef.current;
      if (!element) return;
      await generatePdfFromHtml(element, "LaunchSafe-Compliance-Report.pdf");
    } catch (err) {
      console.error("[Success] PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 700, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", border: "3px solid var(--color-role-light-primary)", borderTopColor: "transparent", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
          <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 16, color: "var(--color-role-light-onSurfaceVariant)" }}>Verifying your payment...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 600, margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-headline-headline-small-fontFamily)", fontSize: 24, fontWeight: 600, color: "var(--color-role-light-error)", margin: "0 0 12px" }}>Payment Verification Failed</h1>
          <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 24px" }}>{error}</p>
          <Button variant="primary" size="md" onClick={() => router.push("/assessment")}>Try Again</Button>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "100px 24px 60px" }}>
        <div ref={reportRef}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--color-role-light-successContainer)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <CheckCircle size={28} style={{ color: "var(--color-role-light-onSuccessContainer)" }} />
            </div>
            <h1 style={{ fontFamily: "var(--font-headline-headline-small-fontFamily)", fontSize: 24, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 8px" }}>Your Compliance Report</h1>
            <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 15, color: "var(--color-role-light-onSurfaceVariant)", margin: 0 }}>Payment verified successfully. Here is your full compliance breakdown.</p>
          </div>

        {report && (
          <>
            {businessInfo && (
              <div style={{ background: "var(--color-role-light-surfaceContainerLowest)", borderRadius: 16, padding: 20, marginBottom: 24 }}>
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

            {/* Stats row — agencies & risk above costs */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Building2 size={18} style={{ color: "var(--color-role-light-primary)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)" }}>{report.agencies?.length || 0} agencies involved</span>
              </div>
              <div style={{ flex: 1, background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                <Shield size={18} style={{ color: report.riskLevel === "high" ? "var(--color-role-light-error)" : report.riskLevel === "medium" ? "var(--color-key-warning)" : "var(--color-key-success)", flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)", textTransform: "capitalize" }}>{report.riskLevel} risk</span>
              </div>
            </div>

            {/* Cost Summary - 3 Categories */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 16, padding: 16 }}>
                <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>OFFICIAL COSTS</span>
                <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "var(--color-key-success)" }}>{formatCurrency(report.officialCosts.min)} – {formatCurrency(report.officialCosts.max)}</span>
              </div>
              <div style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 16, padding: 16 }}>
                <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>SETUP COSTS</span>
                <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "var(--color-palette-warning-40)" }}>{formatCurrency(report.commonSetupCostRange.min)} – {formatCurrency(report.commonSetupCostRange.max)}</span>
              </div>
              <div style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 16, padding: 16 }}>
                <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 4 }}>LOCAL COSTS</span>
                <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 16, fontWeight: 700, color: "var(--color-role-light-onSurfaceVariant)" }}>Varies</span>
              </div>
            </div>
            <div style={{ background: "var(--color-role-light-surfaceBright)", borderLeft: "4px solid var(--color-role-light-primary)", borderRadius: 12, padding: "14px 16px", marginBottom: 24 }}>
              <span style={{ display: "block", fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 2 }}>ESTIMATED LAUNCH BUDGET</span>
              <span style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 22, fontWeight: 700, color: "var(--color-role-light-primary)" }}>
                {formatCurrency(report.estimatedBudget.min)} – {formatCurrency(report.estimatedBudget.max)}+
              </span>
            </div>

            {/* Common Setup Costs */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Common Setup Costs</h3>
              <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 12px" }}>Typical expenses when launching your business (not regulatory requirements).</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {report.commonSetupCosts.map((item, i) => (
                  <div key={i} style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{item.label}</span>
                      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 12, fontWeight: 500, color: "var(--color-role-light-primary)" }}>{item.range}</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.4 }}>{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Potential Local Costs */}
            {report.localCosts.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Potential Local Costs & Levies</h3>
                <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-error)", margin: "0 0 12px" }}>{report.localCostNote}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {report.localCosts.map((item, i) => (
                    <div key={i} style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: "12px 14px" }}>
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
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="9" r="8" stroke="var(--color-role-light-primary)" strokeWidth="1.5" fill="none" />
                  <path d="M9 5V9M9 12V12.01" stroke="var(--color-role-light-primary)" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-primary)", margin: 0 }}>How We Calculated This Estimate</h3>
              </div>
              <div style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurface)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 8 }}>
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

            {/* Requirements List */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Requirements ({report.requirements?.length || 0})</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {report.requirements?.map((req, i) => (
                  <div key={i} style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: "14px 16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)", flex: 1 }}>{req.name}</span>
                      <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: req.confidenceLevel === "verified" ? "var(--color-role-light-successContainer)" : req.confidenceLevel === "estimated" ? "var(--color-role-light-warningContainer)" : "var(--color-role-light-surfaceContainer)", color: req.confidenceLevel === "verified" ? "var(--color-role-light-onSuccessContainer)" : req.confidenceLevel === "estimated" ? "var(--color-role-light-onWarningContainer)" : "var(--color-role-light-onSurfaceVariant)", textTransform: "capitalize", flexShrink: 0, marginLeft: 8 }}>
                        {req.confidenceLevel === "verified" ? "Verified" : req.confidenceLevel === "estimated" ? "Estimated" : "Reported"}
                      </span>
                    </div>
                    <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 8px", lineHeight: 1.5 }}>{req.description}</p>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>{req.agencyName}</span>
                      <span style={{ fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)" }}>· {req.frequency}</span>
                      {req.officialCost != null && req.officialCost > 0 && <span style={{ fontSize: 11, color: "var(--color-key-success)" }}>Official: {formatCurrency(req.officialCost)}</span>}
                      {req.estimatedCost != null && req.estimatedCost > 0 && <span style={{ fontSize: 11, color: "#d97706" }}>Est: {formatCurrency(req.estimatedCost)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Factors */}
            {report.riskFactors && report.riskFactors.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Risk Analysis</h3>
                <div style={{
                  background: report.riskLevel === "high"
                    ? "var(--color-palette-error-95)"
                    : report.riskLevel === "medium"
                    ? "var(--color-palette-warning-95)"
                    : "var(--color-role-light-surfaceContainerLow)",
                  border: report.riskLevel === "high"
                    ? "1px solid var(--color-palette-error-80)"
                    : report.riskLevel === "medium"
                    ? "1px solid var(--color-palette-warning-80)"
                    : "1px solid var(--color-role-light-outlineVariant)",
                  borderRadius: 12, padding: 16
                }}>
                  <ul style={{ margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.riskFactors.map((factor, i) => (
                      <li key={i} style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurface)", lineHeight: 1.6 }}>{factor}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Roadmap */}
            {report.roadmap && report.roadmap.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Your Compliance Roadmap</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {report.roadmap.map((phase, i) => (
                    <div key={i} style={{ background: "var(--color-role-light-surfaceContainerLow)", borderRadius: 12, padding: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-role-light-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 11, fontWeight: 600, flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{phase.title}</span>
                        <span style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 11, color: "var(--color-role-light-onSurfaceVariant)", marginLeft: "auto" }}>{phase.estimatedDuration}</span>
                      </div>
                      <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 6px", lineHeight: 1.5 }}>{phase.description}</p>
                      {phase.requirements.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                          {phase.requirements.map((req, j) => (
                            <span key={j} style={{ fontFamily: "var(--font-label-label-small-fontFamily)", fontSize: 10, padding: "3px 8px", borderRadius: 6, background: "var(--color-role-light-surfaceBright)", color: "var(--color-role-light-onSurfaceVariant)" }}>{req}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        </div>

        {/* Download + Account prompt */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          <Button variant="outline" size="lg" fullWidth onClick={downloadPdf} isLoading={downloading}>
            <Download size={16} /> Download PDF
          </Button>
        </div>

        <div style={{ background: "linear-gradient(135deg, var(--color-role-light-primaryContainer), var(--color-role-light-surfaceBright))", borderRadius: 16, padding: 24, textAlign: "center" }}>
          <UserPlus size={24} style={{ color: "var(--color-role-light-primary)", marginBottom: 12 }} />
          <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 8px" }}>Don't Lose Your Report</h3>
          <p style={{ fontFamily: "var(--font-body-body-large-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 20px", lineHeight: 1.5 }}>
            Create a free account to save your report permanently, track compliance deadlines, and manage your regulatory obligations.
          </p>
          <Button variant="primary" size="lg" fullWidth onClick={() => router.push(`/signup?redirect=/reports/assessment/${assessmentId}`)}>
            Create Free Account
          </Button>
          <button
            type="button"
            style={{ background: "none", border: "none", marginTop: 12, fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)", cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Maybe Later
          </button>
        </div>
      </main>
      <Footer />
    </>
  );
}

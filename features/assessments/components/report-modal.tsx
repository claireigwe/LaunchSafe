"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Download, FileText, AlertTriangle, Building2, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateAssessmentPayment } from "../api/assessment-api";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import type { AssessmentFullReport } from "@/types/domain/assessment";

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: 16, background: "rgba(255,255,255,0.4)", borderRadius: 16, border: "1px solid var(--color-role-light-outlineVariant)" }}>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 11, fontWeight: 600, color: "var(--color-role-light-primary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurface)" }}>{value}</span>
    </div>
  );
}

export function ReportModal({ reportId, isOpen, onClose }: { reportId: string | null; isOpen: boolean; onClose: () => void }) {
  const [report, setReport] = useState<AssessmentFullReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !reportId) return;
    setLoading(true);
    setReport(null);
    setError("");

    fetch(`/api/assessments/${reportId}/report`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data) setReport(json.data.report ?? json.data);
        else setError(json.error?.message || "Report not found");
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [reportId, isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

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

  const modalContent = (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px"
    }}>
      <div style={{
        background: "#fafafa",
        width: "100%",
        maxWidth: "800px",
        maxHeight: "90vh",
        borderRadius: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--color-role-light-outlineVariant)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#fff"
        }}>
          <h2 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, margin: 0, color: "var(--color-role-light-onSurface)" }}>
            Compliance Report
          </h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {report && (
              <Button variant="primary" size="sm" onClick={downloadPdf} isLoading={downloading}>
                <Download size={16} style={{ marginRight: 6 }} />
                Download
              </Button>
            )}
            <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 4, color: "var(--color-role-light-onSurfaceVariant)" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {loading && <div style={{ padding: "40px 24px" }}><div className="sk" style={{ width: 160, height: 20, marginBottom: 20 }} /><div className="sk" style={{ width: "100%", height: 14, marginBottom: 8 }} /><div className="sk" style={{ width: "80%", height: 14, marginBottom: 8 }} /><div className="sk" style={{ width: "60%", height: 14 }} /></div>}
          
          {error && (
            <div style={{ padding: "100px 0", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <AlertTriangle size={48} style={{ color: "#d97706", marginBottom: 24 }} />
              <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 24, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: "0 0 16px" }}>
                {error === "Payment required" ? "Premium Report Locked" : "Unable to load report"}
              </h3>
              <p style={{ color: "var(--color-role-light-onSurfaceVariant)", marginBottom: 32, maxWidth: 400, lineHeight: 1.6 }}>
                {error === "Payment required" 
                  ? "This full compliance report requires a one-time purchase. Unlock to see exact requirements, costs, risks, and your personalized roadmap."
                  : error}
              </p>
              {error === "Payment required" && reportId && (
                <Button 
                  variant="primary" 
                  size="lg" 
                  isLoading={downloading}
                  onClick={async () => {
                    try {
                      setDownloading(true);
                      const { authorizationUrl } = await initiateAssessmentPayment(reportId);
                      window.location.href = authorizationUrl;
                    } catch (e: any) {
                      alert(e.message || "Payment initiation failed");
                      setDownloading(false);
                    }
                  }}
                >
                  Unlock Full Report - ₦10,000
                </Button>
              )}
            </div>
          )}

          {report && (
            <div ref={reportRef} style={{ padding: "0 8px" }}>
              {/* Summary header */}
              <div style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 24, overflow: "hidden", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--color-role-light-outlineVariant)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <FileText size={20} style={{ color: "var(--color-role-light-primary)" }} />
                    <h3 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 20, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Report Summary</h3>
                  </div>
                  <span style={{ padding: "4px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: (report.requirements && report.requirements.length > 8 ? "var(--color-role-light-error)" : report.requirements && report.requirements.length > 4 ? "#d97706" : "var(--color-role-light-success)") + "20", color: (report.requirements && report.requirements.length > 8 ? "var(--color-role-light-error)" : report.requirements && report.requirements.length > 4 ? "#d97706" : "var(--color-role-light-success)") }}>
                    {(report.requirements && report.requirements.length > 8 ? "HIGH" : report.requirements && report.requirements.length > 4 ? "MEDIUM" : "LOW")} COMPLEXITY
                  </span>
                </div>
                <div style={{ padding: "20px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
                  <DetailRow label="Total Requirements" value={String(report.requirements?.length || 0)} />
                  <DetailRow label="Risk Level" value={report.riskLevel} />
                  <DetailRow label="Official Costs" value={`₦${Math.round((report.officialCosts?.min || 0) / 100).toLocaleString("en-US")} – ₦${Math.round((report.officialCosts?.max || 0) / 100).toLocaleString("en-US")}`} />
                  <DetailRow label="Setup Costs" value={`₦${Math.round((report.commonSetupCostRange?.min || 0) / 100).toLocaleString("en-US")} – ₦${Math.round((report.commonSetupCostRange?.max || 0) / 100).toLocaleString("en-US")}`} />
                  <DetailRow label="Budget Estimate" value={`₦${Math.round((report.estimatedBudget?.min || 0) / 100).toLocaleString("en-US")} – ₦${Math.round((report.estimatedBudget?.max || 0) / 100).toLocaleString("en-US")}+`} />
                </div>
              </div>

              {/* Common Setup Costs */}
              {report.commonSetupCosts && report.commonSetupCosts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Common Setup Costs</h4>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: "0 0 12px" }}>Typical expenses when launching your business (not regulatory requirements).</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.commonSetupCosts.map((item: any, i: number) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: "14px 16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)" }}>{item.label}</span>
                          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 12, fontWeight: 500, color: "var(--color-role-light-primary)" }}>{item.range}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.4 }}>{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Local Costs */}
              {report.localCosts && report.localCosts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 4px" }}>Potential Local Costs & Levies</h4>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-error)", margin: "0 0 12px" }}>{report.localCostNote}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.localCosts.map((item: any, i: number) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, fontWeight: 600, color: "var(--color-role-light-onSurface)", display: "block", marginBottom: 2 }}>{item.label}</span>
                        <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 12, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.4 }}>{item.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* How We Calculated */}
              <div style={{ border: "1.5px dashed var(--color-role-light-outlineVariant)", borderRadius: 16, padding: 20, marginBottom: 20, background: "var(--color-role-light-surfaceBright)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="8" stroke="var(--color-role-light-primary)" strokeWidth="1.5" fill="none" /><path d="M9 5V9M9 12V12.01" stroke="var(--color-role-light-primary)" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 14, fontWeight: 600, color: "var(--color-role-light-primary)", margin: 0 }}>How We Calculated This Estimate</h4>
                </div>
                <div style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 13, lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 8 }}>
                  <p style={{ margin: 0 }}><span style={{ fontWeight: 600, color: "var(--color-key-success)" }}>Official Compliance Costs</span><span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on verified government fee schedules.</span></p>
                  <p style={{ margin: 0 }}><span style={{ fontWeight: 600, color: "#d97706" }}>Common Setup Costs</span><span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on typical business launch expenses.</span></p>
                  <p style={{ margin: 0 }}><span style={{ fontWeight: 600, color: "var(--color-role-light-onSurfaceVariant)" }}>Potential Local Costs</span><span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on common local charges. Not official federal requirements.</span></p>
                  <p style={{ margin: "4px 0 0", fontStyle: "italic", color: "var(--color-role-light-onSurfaceVariant)" }}>All figures are estimates. Verify actual costs with relevant agencies.</p>
                </div>
              </div>

              {/* Requirements */}
              {report.requirements && report.requirements.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, margin: "0 0 12px" }}>Requirements & Obligations</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.requirements.map((req: any, idx: number) => (
                      <div key={idx} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
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
                          {req.officialCost != null && req.officialCost > 0 && <span style={{ color: "var(--color-key-success)" }}>Official: ₦{Math.round(req.officialCost / 100).toLocaleString("en-US")}</span>}
                          {req.estimatedCost != null && req.estimatedCost > 0 && <span style={{ color: "#d97706" }}>Est: ₦{Math.round(req.estimatedCost / 100).toLocaleString("en-US")}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Risk Analysis */}
              {report.riskFactors && report.riskFactors.length > 0 && (
                <div style={{ background: report.riskLevel === "high" ? "var(--color-palette-error-95)" : report.riskLevel === "medium" ? "var(--color-palette-warning-95)" : "var(--color-role-light-surfaceContainerLow)", border: "1px solid " + (report.riskLevel === "high" ? "var(--color-palette-error-80)" : report.riskLevel === "medium" ? "var(--color-palette-warning-80)" : "var(--color-role-light-outlineVariant)"), borderRadius: 16, padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <AlertTriangle size={16} style={{ color: report.riskLevel === "high" ? "var(--color-role-light-error)" : report.riskLevel === "medium" ? "#d97706" : "var(--color-key-success)" }} />
                    <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: 0, textTransform: "capitalize" }}>{report.riskLevel} Risk</h4>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.riskFactors.map((factor: string, i: number) => (
                      <li key={i} style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 13, lineHeight: 1.5 }}>{factor}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Roadmap */}
              {report.roadmap && report.roadmap.length > 0 && (
                <div style={{ marginTop: 20 }}>
                  <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, margin: "0 0 12px" }}>Compliance Roadmap</h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {report.roadmap.map((phase: any, i: number) => (
                      <div key={i} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", borderRadius: 16, padding: 16 }}>
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
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

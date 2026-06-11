"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, Download, FileText, AlertTriangle, Building2, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initiateAssessmentPayment } from "../api/assessment-api";
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
        if (json.success && json.data) setReport(json.data);
        else setError(json.error?.message || "Report not found");
      })
      .catch(() => setError("Failed to load report"))
      .finally(() => setLoading(false));
  }, [reportId, isOpen]);

  if (!isOpen || typeof document === "undefined") return null;

  async function downloadPdf() {
    setDownloading(true);
    try {
      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = reportRef.current;
      if (!element) return;

      const opt: any = {
        margin:       [10, 10, 10, 10],
        filename:     "LaunchSafe-Compliance-Report.pdf",
        image:        { type: "jpeg", quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, logging: false },
        jsPDF:        { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak:    { mode: ["css", "legacy"] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch {
      // Ignored
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
          {loading && <div style={{ padding: "100px 0", textAlign: "center", color: "var(--color-role-light-onSurfaceVariant)" }}>Loading report...</div>}
          
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
              <div style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, overflow: "hidden", marginBottom: 24, pageBreakInside: "avoid" }}>
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
                  <DetailRow label="Official Fees" value={`₦${(report.totalOfficialCost || 0).toLocaleString("en-US")}`} />
                  <DetailRow label="Estimated Total" value={`₦${((report.totalOfficialCost || 0) + (report.totalEstimatedCost || 0)).toLocaleString("en-US")}`} />
                </div>
              </div>

              {report.requirements && report.requirements.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
                  <h4 style={{ fontFamily: "var(--font-title-title-large-fontFamily)", fontSize: 18, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Requirements & Obligations</h4>
                  {report.requirements.map((req, idx) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, padding: 20, pageBreakInside: "avoid" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                        <h5 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>{req.name}</h5>
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
                          {req.officialCost != null && req.officialCost > 0 && <span style={{ fontSize: 12, color: "var(--color-key-success)" }}>Official: ₦{req.officialCost.toLocaleString("en-US")}</span>}
                          {req.estimatedCost != null && req.estimatedCost > 0 && <span style={{ fontSize: 12, color: "#d97706" }}>Estimated: ₦{req.estimatedCost.toLocaleString("en-US")}</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {report.riskFactors && report.riskFactors.length > 0 && (
                <div style={{ background: "rgba(255,255,255,0.75)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "0 8px 32px rgba(0,0,0,0.04)", borderRadius: 24, padding: 20, pageBreakInside: "avoid" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                    <AlertTriangle size={16} style={{ color: "#d97706" }} />
                    <h4 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-onSurface)", margin: 0 }}>Risk Analysis</h4>
                  </div>
                  <p style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurfaceVariant)", margin: 0, lineHeight: 1.6 }}>
                    {report.riskFactors.map((f, i) => (<span key={i}>{f}{i < report.riskFactors.length - 1 ? <br/> : ""}</span>))}
                  </p>
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

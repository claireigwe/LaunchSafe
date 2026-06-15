"use client";

import { useEffect, useState, useRef } from "react";
import { generatePdfFromHtml } from "@/lib/pdf/generator";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { loadAssessmentFromLocalStorage, trackEvent, clearPendingUnlockIntent } from "../api/assessment-api";
import type { AssessmentFullReport } from "@/types/domain/assessment";
import styles from "./full-report-screen.module.css";

export function FullReportScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const assessmentId = searchParams.get("assessmentId") || searchParams.get("paid");
  const trxref = searchParams.get("trxref") || searchParams.get("reference");
  const [report, setReport] = useState<AssessmentFullReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verifyAndLoad() {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push(`/login?redirect=/assessment?paid=${assessmentId}&trxref=${trxref}`);
          return;
        }

        if (!assessmentId || !trxref) {
          setError("Missing payment information");
          setLoading(false);
          return;
        }

        const saved = await loadAssessmentFromLocalStorage();
        const assessmentData = saved.data;

        const res = await fetch(`/api/assessments/${assessmentId}/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ trxref, assessmentData }),
        });

        const json = await res.json();

        if (!json.success) {
          setError(json.error?.message || "Payment verification failed");
          setLoading(false);
          return;
        }

        setReport(json.data.report);
        trackEvent("Payment Completed", { assessmentId });
        localStorage.removeItem("launchsafe-pending-unlock");

        // Preload PDF library in background for instant download
        // @ts-expect-error - html2pdf.js has no types
        import("html2pdf.js/dist/html2pdf.bundle.js").catch(() => {});

      } catch {
        setError("An error occurred during verification");
      } finally {
        setLoading(false);
      }
    }

    verifyAndLoad();
  }, [assessmentId, trxref, router]);

  if (loading) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className="sk" style={{ width: 200, height: 24, margin: "0 auto 8px" }} />
          <div className="sk" style={{ width: 140, height: 14, margin: "0 auto 24px" }} />
          <div className="sk" style={{ width: "100%", height: 160, marginBottom: 24 }} />
          <div className="sk" style={{ width: "100%", height: 200, marginBottom: 24 }} />
          <div className="sk" style={{ width: "100%", height: 120 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.errorCard}>
            <h2 className={styles.errorTitle}>Payment Verification Failed</h2>
            <p className={styles.errorText}>{error}</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Button variant="primary" onClick={() => { clearPendingUnlockIntent(); router.push("/assessment"); }}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => { clearPendingUnlockIntent(); router.push("/dashboard"); }}>
                Go to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!report) return null;

  const formatCurrency = (amount: number) =>
    `₦${Math.round(amount / 100).toLocaleString("en-US")}`;

  async function downloadPdf() {
    setDownloading(true);
    try {
      const element = reportRef.current;
      if (!element) return;

      await generatePdfFromHtml(element, "LaunchSafe-Compliance-Report.pdf");
      trackEvent("Report Downloaded");
    } catch (err) {
      console.error("[Report] PDF download failed:", err);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container} ref={reportRef}>
        <div className={styles.header}>
          <div className={styles.successBadge}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="10" cy="10" r="10" fill="var(--color-key-success)" />
              <path d="M6 10L8.5 12.5L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Payment Verified
          </div>
          <h1 className={styles.title}>Your Full Compliance Report</h1>
          <p className={styles.subtitle}>
            Generated on {new Date(report.generatedAt).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Requirements Overview</h2>
          <div className={styles.requirementsList}>
            {report.requirements.map((req) => (
              <div key={req.id} className={styles.requirementCard}>
                <div className={styles.requirementHeader}>
                  <span className={styles.requirementName}>{req.name}</span>
                  <span className={`${styles.confidenceBadge} ${styles[`confidence_${req.confidenceLevel}`]}`}>
                    {req.confidenceLevel === "verified" ? "Verified" : req.confidenceLevel === "estimated" ? "Estimated" : "Community"}
                  </span>
                </div>
                <p className={styles.requirementDescription}>{req.description}</p>
                <div className={styles.requirementMeta}>
                  <span className={styles.metaItem}>
                    <strong>Agency:</strong> {req.agencyName}
                  </span>
                  {req.officialCost !== null && (
                    <span className={styles.metaItem}>
                      <strong>Official Cost:</strong> {formatCurrency(req.officialCost)}
                    </span>
                  )}
                  <span className={styles.metaItem}>
                    <strong>Frequency:</strong> {req.frequency}
                  </span>
                  {req.deadline && (
                    <span className={styles.metaItem}>
                      <strong>Deadline:</strong> {req.deadline}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Agencies Involved</h2>
          <div className={styles.agenciesList}>
            {report.agencies.map((agency) => (
              <div key={agency.id} className={styles.agencyCard}>
                <span className={styles.agencyName}>
                  {agency.name}
                  {agency.acronym && <span className={styles.agencyAcronym}> ({agency.acronym})</span>}
                </span>
                <span className={styles.agencyCount}>{agency.requirementCount} requirement{agency.requirementCount > 1 ? "s" : ""}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Risk Analysis</h2>
          <div className={`${styles.riskBadge} ${styles[`risk_${report.riskLevel}`]}`}>
            {report.riskLevel === "low" ? "Low Risk" : report.riskLevel === "medium" ? "Medium Risk" : "High Risk"}
          </div>
          <ul className={styles.riskList}>
            {report.riskFactors.map((factor, i) => (
              <li key={i} className={styles.riskFactor}>{factor}</li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Cost Summary</h2>
          <div className={styles.costGrid}>
            <div className={styles.costCard}>
              <span className={styles.costLabel}>Official Compliance Costs</span>
              <span className={styles.costValue}>{formatCurrency(report.officialCosts.min)} – {formatCurrency(report.officialCosts.max)}</span>
              <span className={styles.costNote}>Verified regulatory fees</span>
            </div>
            <div className={styles.costCard}>
              <span className={styles.costLabel}>Common Setup Costs</span>
              <span className={styles.costValue}>{formatCurrency(report.commonSetupCostRange.min)} – {formatCurrency(report.commonSetupCostRange.max)}</span>
              <span className={styles.costNote}>Legal, documentation, processing</span>
            </div>
            <div className={styles.costCard}>
              <span className={styles.costLabel}>Potential Local Costs</span>
              <span className={styles.costValue}>Varies by location</span>
              <span className={styles.costNote}>Levies, association fees, local charges</span>
            </div>
            <div className={styles.costCard} style={{ borderColor: "var(--color-role-light-primary)", background: "var(--color-role-light-surfaceBright)" }}>
              <span className={styles.costLabel} style={{ fontWeight: 600, color: "var(--color-role-light-primary)" }}>Estimated Launch Budget</span>
              <span className={styles.costValue} style={{ color: "var(--color-role-light-primary)", fontSize: 28 }}>{formatCurrency(report.estimatedBudget.min)} – {formatCurrency(report.estimatedBudget.max)}+</span>
              <span className={styles.costNote}>Combined estimate across all categories</span>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Common Setup Costs</h2>
          <p className={styles.sectionSubtitle}>Typical expenses when launching your business (not regulatory requirements).</p>
          <div className={styles.commonList}>
            {report.commonSetupCosts.map((item, i) => (
              <div key={i} className={styles.commonItem}>
                <div className={styles.commonItemHead}>
                  <span className={styles.commonItemLabel}>{item.label}</span>
                  <span className={styles.commonItemRange}>{item.range}</span>
                </div>
                <p className={styles.commonItemReason}>{item.reason}</p>
              </div>
            ))}
          </div>
        </section>

        {report.localCosts.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Potential Local Costs & Levies</h2>
            <p className={styles.sectionSubtitle}>{report.localCostNote}</p>
            <div className={styles.localList}>
              {report.localCosts.map((item, i) => (
                <div key={i} className={styles.commonItem}>
                  <span className={styles.commonItemLabel}>{item.label}</span>
                  <p className={styles.commonItemReason}>{item.note}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className={styles.section} style={{ border: "1.5px dashed var(--color-role-light-outlineVariant)", borderRadius: 16, padding: 20, marginBottom: 24, background: "var(--color-role-light-surfaceBright)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8.5" stroke="var(--color-role-light-primary)" strokeWidth="1.5" fill="none" />
              <path d="M10 6V10.5M10 14V14.01" stroke="var(--color-role-light-primary)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <h2 style={{ fontFamily: "var(--font-label-label-large-fontFamily)", fontSize: 16, fontWeight: 600, color: "var(--color-role-light-primary)", margin: 0 }}>How We Calculated This Estimate</h2>
          </div>
          <div style={{ fontFamily: "var(--font-body-body-medium-fontFamily)", fontSize: 14, color: "var(--color-role-light-onSurface)", lineHeight: 1.6, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "var(--color-key-success)" }}>Official Compliance Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on verified government fee schedules from regulatory agencies. These are the minimum fees required.</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "#d97706" }}>Common Setup Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on typical expenses Nigerian businesses incur during registration and launch. Estimates may vary.</span>
            </p>
            <p style={{ margin: 0 }}>
              <span style={{ fontWeight: 600, color: "var(--color-role-light-onSurfaceVariant)" }}>Potential Local Costs</span>
              <span style={{ color: "var(--color-role-light-onSurfaceVariant)" }}> — Based on common local charges. Not official federal requirements. Vary significantly by location.</span>
            </p>
            <p style={{ margin: "4px 0 0", fontStyle: "italic", color: "var(--color-role-light-onSurfaceVariant)" }}>All figures are estimates. Verify actual costs with relevant agencies before budgeting.</p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Compliance Roadmap</h2>
          <div className={styles.roadmap}>
            {report.roadmap.map((phase) => (
              <div key={phase.phase} className={styles.phaseCard}>
                <div className={styles.phaseNumber}>Phase {phase.phase}</div>
                <h3 className={styles.phaseTitle}>{phase.title}</h3>
                <p className={styles.phaseDescription}>{phase.description}</p>
                <div className={styles.phaseDuration}>{phase.estimatedDuration}</div>
                <ul className={styles.phaseRequirements}>
                  {phase.requirements.map((req, i) => (
                    <li key={i} className={styles.phaseRequirement}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            isLoading={downloading}
            onClick={downloadPdf}
          >
            Download Report
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => router.push("/dashboard")}
          >
            Go to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}

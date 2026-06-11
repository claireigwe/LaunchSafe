"use client";

import { useEffect, useState, useRef } from "react";
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
          <div className={styles.spinner} />
          <p className={styles.verifyingText}>Verifying your payment...</p>
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
    `₦${amount.toLocaleString("en-US")}`;

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
      trackEvent("Report Downloaded");
    } catch {
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
          <h2 className={styles.sectionTitle}>Cost Summary</h2>
          <div className={styles.costGrid}>
            <div className={styles.costCard}>
              <span className={styles.costLabel}>Official Fees</span>
              <span className={styles.costValue}>{formatCurrency(report.totalOfficialCost)}</span>
            </div>
            <div className={styles.costCard}>
              <span className={styles.costLabel}>Estimated Total</span>
              <span className={styles.costValue}>{formatCurrency(report.totalEstimatedCost)}</span>
            </div>
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

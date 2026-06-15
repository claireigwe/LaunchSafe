"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateReportData, canExport } from "../api/reporting-engine";
import { canAccess, getCurrentPlanId } from "@/features/billing/api/feature-access";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import { useHasBusiness } from "@/features/businesses/hooks/use-has-business";
import { BusinessRequiredOverlay } from "@/features/businesses/components/business-required-overlay";
import { HealthTrendChart } from "./health-trend-chart";
import { ComplianceExecutionSection } from "./compliance-execution";
import { RiskAssessmentSection } from "./risk-assessment";
import { DocumentationHealthSection } from "./documentation-health";
import { ComparisonTable } from "./comparison-table";
import { ExportSection } from "./export-section";
import type { ReportData } from "../types/reporting.types";
import styles from "./reporting-page.module.css";

export function ReportingPage() {
  const router = useRouter();
  const planId = getCurrentPlanId() || "";
  const hasAccess = canAccess("advanced_reporting");
  const canExportReport = canExport(planId);
  const hasBusiness = useHasBusiness();
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    generateReportData().then(setData);
    trackEvent("Advanced Reporting Viewed");
  }, []);

  if (!hasAccess) {
    return (
      <div className={styles.page}>
        <div className={styles.upgradeBanner}>
          <BarChart size={32} className={styles.upgradeIcon} />
          <h2 className={styles.upgradeTitle}>Advanced Reporting</h2>
          <p className={styles.upgradeText}>Upgrade to Growth or Enterprise to access compliance reports, trends, and analytics.</p>
          <Button variant="primary" size="md" onClick={() => router.push("/business-onboarding?mode=change-plan")}>
            <ArrowUp size={16} /> Upgrade to Growth
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className={styles.loading}>Loading reports...</div>;
  }

  return (
    <BusinessRequiredOverlay hasBusiness={hasBusiness}>
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Advanced Reporting</h1>
          <p className={styles.subtitle}>Executive compliance intelligence for your business.</p>
        </div>
        <div className={styles.headerMeta}>
          <span className={styles.planTag}>{planId === "enterprise" ? "Enterprise Plan" : planId === "growth" ? "Growth Plan" : "Starter Plan"}</span>
          {!canExportReport && (
            <Button variant="outline" size="sm" onClick={() => router.push("/business-onboarding?mode=change-plan")}>
              <ArrowUp size={12} /> Enterprise
            </Button>
          )}
        </div>
      </div>

      <div className={styles.flow}>
        <HealthTrendChart data={[]} />
        <div className={styles.twoColumnFlow}>
          <ComplianceExecutionSection taskData={data.taskAnalytics} deadlineData={data.deadlinePerformance} />
          <RiskAssessmentSection data={data.riskReport} />
        </div>
        <DocumentationHealthSection data={data.documentReport} />
        {data.comparisons.length > 0 && <ComparisonTable data={data.comparisons} />}
        {canExportReport && <ExportSection />}
      </div>

      {data.taskAnalytics.totalTasks === 0 && (
        <div className={styles.emptyState}>
          <p>Not enough data available yet. Continue using LaunchSafe to generate reporting insights.</p>
        </div>
      )}
    </div>
    </BusinessRequiredOverlay>
  );
}

"use client";

import { useRef } from "react";
import { Download, FileText, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { generatePdfFromText } from "@/lib/pdf/generator";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./export-section.module.css";

export function ExportSection() {
  const saved = getBusinessData() as any;
  const bizName = saved?.info?.businessName || "Your Business";

  const reportTemplates: Record<string, string> = {
    health: `COMPLIANCE HEALTH REPORT\n\nBusiness: ${bizName}\n\nThis report provides an overview of your compliance health score, period-over-period changes, and risk status. It helps you understand trends in your compliance performance and identify areas requiring attention.\n\nKey areas covered:\n- Current compliance score and trend\n- Period-over-period change analysis\n- Risk level assessment\n- Positive and negative contributors\n- Strategic insights for improvement`,
    execution: `COMPLIANCE EXECUTION REPORT\n\nBusiness: ${bizName}\n\nThis report measures how effectively your business completes compliance activities. It tracks task completion rates, deadline performance, and overall execution efficiency.\n\nKey areas covered:\n- Task completion rate\n- Total, completed, pending, and overdue tasks\n- Deadlines met, missed, and upcoming\n- Performance trend analysis\n- Execution insights and recommendations`,
    risk: `COMPLIANCE RISK ASSESSMENT REPORT\n\nBusiness: ${bizName}\n\nThis report evaluates your compliance risk profile based on overdue tasks, missed deadlines, missing documents, and overall compliance activity.\n\nKey areas covered:\n- Risk score and level\n- Risk drivers and contributing factors\n- Recommended actions to reduce risk\n- Compliance health improvement opportunities`,
    docs: `DOCUMENTATION HEALTH REPORT\n\nBusiness: ${bizName}\n\nThis report assesses your document compliance readiness. It tracks uploaded, missing, and recently added compliance documents.\n\nKey areas covered:\n- Documentation completeness score\n- Uploaded vs. missing documents\n- Recently added documents\n- Missing critical document recommendations\n- Potential compliance impact analysis`,
  };

  const reports = [
    { id: "health", label: "Compliance Health", icon: FileText },
    { id: "execution", label: "Compliance Execution", icon: FileText },
    { id: "risk", label: "Compliance Risk Assessment", icon: FileText },
    { id: "docs", label: "Documentation Health", icon: Table },
  ];

  function handleExport(reportId: string) {
    trackEvent("Report Exported", { reportId });
    const content = reportTemplates[reportId] || `${reportId.toUpperCase()} Report for ${bizName}`;
    generatePdfFromText(`${reports.find((r) => r.id === reportId)?.label || reportId} Report`, content, bizName, `${reportId}-report.pdf`);
  }

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Export Reports</h2>
        <p className={styles.subtitle}>Download compliance reports for your records or audits.</p>
      </div>

      <div className={styles.reportList}>
        {reports.map((r) => (
          <div key={r.id} className={styles.reportRow}>
            <div className={styles.reportInfo}>
              <r.icon size={16} className={styles.reportIcon} />
              <div>
                <span className={styles.reportName}>{r.label}</span>
                <span className={styles.reportMeta}>PDF</span>
              </div>
            </div>
            <div className={styles.reportActions}>
              <Button variant="outline" size="sm" onClick={() => handleExport(r.id)}>
                <Download size={12} /> Export
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

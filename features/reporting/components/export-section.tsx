"use client";

import { useRef } from "react";
import { Download, FileText, ListChecks, ShieldAlert, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { generatePdfFromText } from "@/lib/pdf/generator";
import { trackEvent } from "@/lib/analytics/track";
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
    { id: "health", label: "Compliance Health", desc: "Performance summary", icon: FileText },
    { id: "execution", label: "Compliance Execution", desc: "Activity records", icon: ListChecks },
    { id: "risk", label: "Compliance Risk Assessment", desc: "Vulnerability report", icon: ShieldAlert },
    { id: "docs", label: "Documentation Health", desc: "Archival status", icon: FolderOpen },
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

      <div className={styles.reportGrid}>
        {reports.map((r) => (
          <div key={r.id} className={styles.reportCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconWrapper}>
                <r.icon size={20} className={styles.reportIcon} />
              </div>
              <span className={styles.pdfLabel}>PDF</span>
            </div>
            
            <div className={styles.cardBody}>
              <h3 className={styles.reportName}>{r.label}</h3>
              <p className={styles.reportDesc}>{r.desc}</p>
            </div>

            <div className={styles.cardFooter}>
              <Button variant="outline" className={styles.exportBtn} onClick={() => handleExport(r.id)}>
                <Download size={14} /> Export
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FileText, ExternalLink, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAssessment } from "../api/assessment-api";
import { ReportModal } from "./report-modal";
import styles from "./past-reports-widget.module.css";

interface PastReport {
  id: string;
  status: string;
  summary: any;
  hasReport: boolean;
  createdAt: string;
}

export function PastReportsWidget() {
  const router = useRouter();
  const [reports, setReports] = useState<PastReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const loadReports = () => {
    setLoading(true);
    fetch("/api/assessments", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          const paid = (json.data || []).filter((a: PastReport) => a.hasReport);
          setReports(paid);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setConfirmDeleteId(id);
  };

  const handleConfirmDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    
    setIsDeleting(id);
    const success = await deleteAssessment(id);
    if (success) {
      setReports((prev) => prev.filter((r) => r.id !== id));
    } else {
      alert("Failed to delete assessment. Please try again.");
    }
    setIsDeleting(null);
    setConfirmDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteId(null);
  };

  if (loading && reports.length === 0) return null;
  if (!loading && reports.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FileText size={16} />
        <span className={styles.title}>Past Compliance Reports</span>
      </div>
      <div className={styles.list}>
        {reports.map((r) => (
          <div key={r.id} className={styles.item}>
            <div className={styles.info}>
              <span className={styles.name}>
                {r.summary?.businessType || "Compliance Report"}
              </span>
              <span className={styles.date}>
                {new Date(r.createdAt).toLocaleDateString("en-NG", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className={styles.actions}>
              {confirmDeleteId === r.id ? (
                <div className={styles.confirmWrapper}>
                  <span className={styles.confirmText}>Delete?</span>
                  <button type="button" className={styles.confirmBtn} onClick={(e) => handleConfirmDelete(e, r.id)} disabled={isDeleting === r.id}>{isDeleting === r.id ? '...' : 'Yes'}</button>
                  <button type="button" className={styles.cancelBtn} onClick={handleCancelDelete} disabled={isDeleting === r.id}>No</button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    className={styles.viewBtn}
                    onClick={(e) => { e.stopPropagation(); setSelectedReportId(r.id); }}
                    title="View Report"
                  >
                    <ExternalLink size={14} />
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={(e) => handleDeleteClick(e, r.id)}
                    title="Delete Assessment"
                  >
                    <Trash2 size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <ReportModal 
        reportId={selectedReportId} 
        isOpen={!!selectedReportId} 
        onClose={() => setSelectedReportId(null)} 
      />
    </div>
  );
}

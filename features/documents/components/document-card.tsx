"use client";

import { FileText, Download, Eye } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatFileSize } from "../api/documents-api";
import { DOC_TYPE_LABELS } from "../types/documents.types";
import type { AppDocument } from "../types/documents.types";
import styles from "./document-card.module.css";

interface Props {
  doc: AppDocument;
  onView: (doc: AppDocument) => void;
  onDownload: (doc: AppDocument) => void;
  viewMode: "table" | "card";
}

export function DocumentCard({ doc, onView, onDownload, viewMode }: Props) {
  if (viewMode === "table") {
    return (
      <div className={styles.tableRow}>
        <button type="button" className={styles.tableTitle} onClick={() => onView(doc)}>
          <FileText size={16} className={styles.icon} />
          <span>{doc.title}</span>
        </button>
        <span className={styles.tableCell}>{DOC_TYPE_LABELS[doc.docType]}</span>
        <span className={styles.tableCell}>{formatFileSize(doc.fileSize)}</span>
        <span className={styles.tableCell}>{new Date(doc.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
        <div className={styles.tableActions}>
          <button type="button" className={styles.actionBtn} onClick={() => onView(doc)} aria-label="View document"><Eye size={14} /></button>
          <button type="button" className={styles.actionBtn} onClick={() => onDownload(doc)} aria-label="Download document"><Download size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <button type="button" className={styles.card} onClick={() => onView(doc)}>
      <div className={styles.cardIcon}>
        <FileText size={24} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardTitle}>{doc.title}</span>
        <span className={styles.cardType}>{DOC_TYPE_LABELS[doc.docType]}</span>
        <span className={styles.cardMeta}>{formatFileSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
      </div>
      <button type="button" className={styles.cardDownload} onClick={(e) => { e.stopPropagation(); onDownload(doc); }} aria-label="Download">
        <Download size={14} />
      </button>
    </button>
  );
}

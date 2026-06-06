"use client";

import { useState } from "react";
import { FileText, Download, Eye, Trash2 } from "lucide-react";
import { formatFileSize } from "../api/documents-api";
import { DOC_TYPE_LABELS } from "../types/documents.types";
import type { AppDocument } from "../types/documents.types";
import styles from "./document-card.module.css";

interface Props {
  doc: AppDocument;
  onView: (doc: AppDocument) => void;
  onDownload: (doc: AppDocument) => void;
  onDelete: (id: string) => void;
  viewMode: "table" | "card";
}

export function DocumentCard({ doc, onView, onDownload, onDelete, viewMode }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (confirmDelete) {
    return (
      <div className={styles.confirmOverlay}>
        <span className={styles.confirmText}>Delete this document?</span>
        <div className={styles.confirmActions}>
          <button type="button" className={styles.confirmCancel} onClick={() => setConfirmDelete(false)}>Cancel</button>
          <button type="button" className={styles.confirmBtn} onClick={() => { onDelete(doc.id); setConfirmDelete(false); }}>Delete</button>
        </div>
      </div>
    );
  }

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
          <button type="button" className={styles.actionBtn} onClick={() => setConfirmDelete(true)} aria-label="Delete document"><Trash2 size={14} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={() => onView(doc)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === "Enter") onView(doc); }}>
      <div className={styles.cardIcon}>
        <FileText size={24} />
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardTitle}>{doc.title}</span>
        <span className={styles.cardType}>{DOC_TYPE_LABELS[doc.docType]}</span>
        <span className={styles.cardMeta}>{formatFileSize(doc.fileSize)} · {new Date(doc.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short" })}</span>
      </div>
      <div className={styles.cardActions}>
        <button type="button" className={styles.cardDownload} onClick={(e) => { e.stopPropagation(); onDownload(doc); }} aria-label="Download">
          <Download size={14} />
        </button>
        <button type="button" className={styles.cardDelete} onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }} aria-label="Delete">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

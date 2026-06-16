import Link from "next/link";
import { FileText } from "lucide-react";
import { formatFileSize } from "@/features/documents/api/documents-api";
import { DOC_TYPE_LABELS } from "@/features/documents/types/documents.types";
import type { AppDocument } from "@/features/documents/types/documents.types";
import styles from "./dashboard-page.module.css";

interface Props {
  docs: AppDocument[];
}

export function DocumentsSection({ docs }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <FileText size={20} className={styles.cardHeaderIcon} />
        <h2 className={styles.cardHeaderTitle}>Recent Documents</h2>
        <Link href="/documents" className={styles.cardAction}>View All</Link>
      </div>
      {docs.map((d) => (
        <Link key={d.id} href="/documents" className={styles.cardItem} style={{ gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-role-light-primaryContainer)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-role-light-primary)", flexShrink: 0 }}><FileText size={20} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 15, fontWeight: 500, color: "var(--color-role-light-onSurface)", marginBottom: 4 }}>{d.title}</span>
            <span style={{ display: "block", fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)" }}>{DOC_TYPE_LABELS[d.docType]}</span>
          </div>
          <span style={{ fontFamily: "var(--font-label-label-medium-fontFamily)", fontSize: 13, color: "var(--color-role-light-onSurfaceVariant)", fontWeight: 500 }}>{formatFileSize(d.fileSize)}</span>
        </Link>
      ))}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateDocument, DOC_TYPE_LABELS_GEN, DOC_TYPE_DESCRIPTIONS } from "../api/document-generation";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { generatePdfFromText } from "@/lib/pdf/generator";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import type { DocumentType } from "@/types/domain/document";
import styles from "./document-generator-modal.module.css";

interface Props {
  onClose: () => void;
  onComplete: () => void;
}

const DOC_TYPES = Object.entries(DOC_TYPE_LABELS_GEN) as [DocumentType, string][];

export function DocumentGeneratorModal({ onClose, onComplete }: Props) {
  const [docType, setDocType] = useState<DocumentType>("application_letter");
  const [context, setContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ title: string; content: string } | null>(null);

  const saved = getBusinessData() as any;
  const businessName = saved?.info?.businessName || "Your Business";

  async function handleGenerate() {
    setGenerating(true);
    trackEvent("Document Generated", { docType });
    const doc = generateDocument(docType, context, businessName);
    setResult({ title: doc.title, content: doc.content || "" });
    setGenerating(false);
    onComplete();
  }

  function handleDownloadPdf() {
    if (!result) return;
    generatePdfFromText(result.title, result.content, businessName, `${result.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    trackEvent("PDF Downloaded", { title: result.title });
  }

  if (result) {
    return (
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h2 className={styles.title}>Document Generated</h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
          </div>
          <div className={styles.body}>
            <h3 className={styles.docTitle}>{result.title}</h3>
            <pre className={styles.content}>{result.content}</pre>
            <p className={styles.note}>Document saved to your library. Download a formatted PDF below.</p>
            <div className={styles.actions}>
              <Button variant="outline" size="md" onClick={handleDownloadPdf}>Download PDF</Button>
              <Button variant="primary" size="md" onClick={onClose}>Done</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Generate Document</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className={styles.body}>
          <p className={styles.info}>Generate a compliance document from a template. Fill in optional context to customize it.</p>
          <div className={styles.field}>
            <label className={styles.label}>Document Type</label>
            <select className={styles.select} value={docType} onChange={(e) => setDocType(e.target.value as DocumentType)}>
              {DOC_TYPES.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
            <p className={styles.hint}>{DOC_TYPE_DESCRIPTIONS[docType]}</p>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Context <span className={styles.opt}>(optional)</span></label>
            <textarea className={styles.textarea} value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. Business registration with CAC, Food safety certification application" rows={3} />
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>Cancel</Button>
            <Button type="button" variant="primary" size="md" onClick={handleGenerate} isLoading={generating}>Generate Document</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

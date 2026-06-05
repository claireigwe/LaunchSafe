"use client";

import { useState, useEffect } from "react";
import { FileText, X, Check } from "lucide-react";
import { generateDocumentSuggestions } from "../data/document-suggestions";
import { getBusinessData } from "@/features/businesses/api/onboarding-api";
import { DOC_TYPE_LABELS } from "../types/documents.types";
import type { SuggestedDocument } from "../types/documents.types";
import styles from "./suggested-documents-widget.module.css";

const DISMISSED_KEY = "launchsafe-dismissed-doc-suggestions";
const ACCEPTED_KEY = "launchsafe-accepted-doc-suggestions";

function loadSet(key: string): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(key) || "[]")); } catch { return new Set(); }
}
function saveSet(key: string, s: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...s])); } catch {} }


export function SuggestedDocumentsWidget({ onUpload }: { onUpload?: (title: string, docType: string) => void }) {
  const [suggestions, setSuggestions] = useState<SuggestedDocument[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(() => loadSet(DISMISSED_KEY));
  const [accepted, setAccepted] = useState<Set<string>>(() => loadSet(ACCEPTED_KEY));

  useEffect(() => {
    const saved = getBusinessData() as any;
    const profile = saved ? {
      industry: saved.info?.industry || "",
      isRegistered: saved.status?.isRegistered ?? null,
      hasCAC: saved.status?.hasCAC ?? null,
      hasPhysicalLocation: saved.operations?.hasPhysicalLocation ?? null,
      hasOnlineOperations: saved.operations?.hasOnlineOperations ?? null,
    } : null;
    setSuggestions(generateDocumentSuggestions(profile));
  }, []);

  const visible = suggestions.filter((s) => !dismissed.has(s.id) && !accepted.has(s.id)).slice(0, 4);

  if (visible.length === 0) return null;

  function handleAccept(s: SuggestedDocument) {
    const next = new Set(accepted);
    next.add(s.id);
    setAccepted(next);
    saveSet(ACCEPTED_KEY, next);
    onUpload?.(s.title, s.docType);
  }

  function handleDismiss(id: string) {
    const next = new Set(dismissed);
    next.add(id);
    setDismissed(next);
    saveSet(DISMISSED_KEY, next);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <FileText size={16} className={styles.icon} />
        <h2 className={styles.title}>Suggested Documents</h2>
      </div>
      <div className={styles.list}>
        {visible.map((s) => (
          <div key={s.id} className={styles.item}>
            <div className={styles.itemBody}>
              <span className={styles.itemTitle}>{s.title}</span>
              <span className={styles.itemType}>{DOC_TYPE_LABELS[s.docType]}</span>
              <p className={styles.itemReason}>{s.reason}</p>
            </div>
            <div className={styles.itemActions}>
              <button type="button" className={styles.actionBtn} onClick={() => handleAccept(s)} aria-label="Accept suggestion"><Check size={14} /></button>
              <button type="button" className={styles.actionBtn} onClick={() => handleDismiss(s.id)} aria-label="Dismiss suggestion"><X size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

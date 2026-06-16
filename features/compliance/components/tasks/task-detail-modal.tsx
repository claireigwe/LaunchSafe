"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, Loader2, Upload, Sparkles, X } from "lucide-react";
import { daysUntil } from "@/lib/utils/time";
import { fetchEvidence, linkDocumentAsEvidenceAPI, removeEvidence } from "@/features/compliance/api/evidence-api";
import { getDocuments, uploadDocument, downloadDocument } from "@/features/documents/api/documents-api";
import { DocumentUploadModal } from "@/features/documents/components/document-upload-modal";
import { DocumentDetailModal } from "@/features/documents/components/document-detail-modal";
import { canAccess } from "@/features/billing/api/feature-access";
import type { ComplianceTaskItem, UpdateTaskInput, TaskPriority, TaskStatus } from "../../types/tasks.types";
import type { EvidenceRecord } from "@/features/compliance/api/evidence-api";
import type { UploadDocumentInput } from "@/features/documents/api/documents-api";
import type { AppDocument } from "@/features/documents/types/documents.types";
import styles from "./task-detail-modal.module.css";

interface Props {
  task: ComplianceTaskItem;
  onUpdate: (id: string, input: UpdateTaskInput) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function TaskDetailModal({ task, onUpdate, onDelete, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState<TaskPriority>(task.priority);
  const [status, setStatus] = useState<TaskStatus>(task.status);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [availableDocs, setAvailableDocs] = useState<any[]>([]);
  const [showLinkDoc, setShowLinkDoc] = useState(false);
  const [showEvidenceWarning, setShowEvidenceWarning] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [evidenceDoc, setEvidenceDoc] = useState<AppDocument | null>(null);
  const [removingEvidenceId, setRemovingEvidenceId] = useState<string | null>(null);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  async function handleExplain() {
    setAiLoading(true);
    setAiError(null);
    setAiExplanation(null);
    try {
      const res = await fetch("/api/ai/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `Explain this compliance requirement in simple language: ${task.title}. ${task.description ? `Details: ${task.description}` : ""}`,
        }),
      });
      const json = await res.json();
      if (json.success && json.data?.content) {
        setAiExplanation(json.data.content);
      } else {
        setAiError(json.error?.message || "Failed to get explanation.");
      }
    } catch {
      setAiError("Failed to get explanation.");
    } finally {
      setAiLoading(false);
    }
  }

  async function handleRemoveEvidence(evidenceId: string) {
    setRemovingEvidenceId(evidenceId);
    try {
      await removeEvidence(evidenceId);
      setEvidence((prev) => prev.filter((e) => e.id !== evidenceId));
      // Refetch documents so the unlinked doc reappears in the "available to link" list
      const docs = await getDocuments(task.businessId);
      setAvailableDocs(docs);
    } catch {
      alert("Failed to remove evidence");
    } finally {
      setRemovingEvidenceId(null);
    }
  }

  useEffect(() => {
    async function loadData() {
      const [allEvidence, docs] = await Promise.all([
        fetchEvidence(),
        getDocuments(task.businessId),
      ]);
      setEvidence(allEvidence.filter(e => e.complianceTaskId === task.id));
      setAvailableDocs(docs);
    }
    loadData();
  }, [task.id]);

  async function handleUploadDoc(input: UploadDocumentInput) {
    try {
      await uploadDocument(input);
      setShowUploadModal(false);
      const docs = await getDocuments();
      setAvailableDocs(docs);
    } catch {}
  }

  async function handleLinkDoc(docId: string, docTitle: string) {
    try {
      setIsLinking(true);
      const newEvidence = await linkDocumentAsEvidenceAPI(docId, docTitle, task.id, task.businessId);
      setEvidence((prev) => [...prev, newEvidence]);
      setShowLinkDoc(false);
    } catch (err: any) {
      console.error("Failed to link document", err);
      alert(err?.message || "Failed to link document as evidence.");
    } finally {
      setIsLinking(false);
    }
  }

  function handleSave() {
    onUpdate(task.id, {
      title: title.trim() || task.title,
      description: description.trim(),
      dueDate: dueDate || null,
      priority,
      status,
    });
    setEditing(false);
  }

  const daysOverdue = task.dueDate && task.status !== "completed"
    ? -daysUntil(task.dueDate)
    : null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{editing ? "Edit Task" : task.title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className={styles.body}>
          {editing ? (
            <div className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Due Date</label>
                  <input type="date" className={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Priority</label>
                  <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} options={["low","medium","high","critical"]} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <Select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} options={["pending","in_progress","awaiting_submission","submitted","approved","due_soon","completed","overdue"]} />
              </div>
              <div className={styles.actions}>
                <Button type="button" variant="ghost" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="button" variant="primary" size="md" onClick={handleSave}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.metaRow}>
                <span className={cn(styles.statusBadge, styles[`st_${task.status}`])}>{task.status.replace("_", " ")}</span>
                <span className={cn(styles.priorityBadge, styles[`pr_${task.priority}`])}>{task.priority}</span>
                {task.source === "suggested" && <span className={styles.sourceBadge}>Suggested</span>}
              </div>

              {task.description && <p className={styles.description}>{task.description}</p>}

              <div className={styles.details}>
                {task.dueDate && (
                  <div className={styles.detailRow}>
                    <span className={styles.detailLabel}>Due Date</span>
                    <span className={cn(styles.detailValue, daysOverdue && daysOverdue > 0 ? styles.overdueText : "")}>
                      {new Date(task.dueDate).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}
                      {daysOverdue && daysOverdue > 0 ? ` (${daysOverdue} day${daysOverdue > 1 ? "s" : ""} overdue)` : ""}
                    </span>
                  </div>
                )}
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Source</span>
                  <span className={styles.detailValue}>{task.source === "manual" ? "Manual" : "Suggested"}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Created</span>
                  <span className={styles.detailValue}>{new Date(task.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              </div>

              {canAccess("ai_compliance") && (
                <div className={styles.aiSection}>
                  {!aiExplanation && !aiLoading && !aiError && (
                    <button type="button" className={styles.explainBtn} onClick={handleExplain}>
                      <Sparkles size={14} />
                      Explain this requirement
                    </button>
                  )}
                  {aiLoading && (
                    <div className={styles.aiLoading}>
                      <Loader2 size={14} className="animate-spin" />
                      Getting explanation...
                    </div>
                  )}
                  {aiError && (
                    <div className={styles.aiError}>
                      <AlertTriangle size={14} />
                      {aiError}
                    </div>
                  )}
                  {aiExplanation && (
                    <div className={styles.aiExplanation}>
                      <div className={styles.aiExplanationHeader}>
                        <Sparkles size={14} />
                        <span>AI Explanation</span>
                        <button type="button" className={styles.aiDismiss} onClick={() => setAiExplanation(null)}>×</button>
                      </div>
                      <p className={styles.aiExplanationText}>{aiExplanation}</p>
                    </div>
                  )}
                </div>
              )}

              {evidence.length > 0 && (
                <div className={styles.evidenceSection}>
                  <h4 className={styles.evidenceSectionTitle}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M5 5H11M5 8H11M5 11H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                    Linked Documents ({evidence.length})
                  </h4>
                  <div className={styles.evidenceList}>
                    {evidence.map((e) => (
                      <div
                        key={e.id}
                        role="button"
                        tabIndex={0}
                        className={styles.evidenceCard}
                        onClick={() => {
                          const doc = availableDocs.find((d) => d.id === e.documentId);
                          if (doc) setEvidenceDoc(doc);
                        }}
                        onKeyDown={(ev) => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); const doc = availableDocs.find((d) => d.id === e.documentId); if (doc) setEvidenceDoc(doc); } }}
                      >
                        <div className={styles.evidenceCardIcon}>
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 2H13C13.6 2 14 2.4 14 3V13C14 13.6 13.6 14 13 14H3C2.4 14 2 13.6 2 13V3C2 2.4 2.4 2 3 2Z" stroke="var(--color-role-light-primary)" strokeWidth="1.2" fill="none" /><path d="M3 7H13M3 10H13" stroke="var(--color-role-light-primary)" strokeWidth="1.2" /></svg>
                        </div>
                        <div className={styles.evidenceCardBody}>
                          <span className={styles.evidenceCardTitle}>{e.documentTitle}</span>
                          <span className={styles.evidenceCardDate}>{new Date(e.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </div>
                        {task.status !== "completed" && (
                          <button
                            type="button"
                            className={styles.evidenceRemoveBtn}
                            onClick={(ev) => { ev.stopPropagation(); handleRemoveEvidence(e.id); }}
                            disabled={removingEvidenceId === e.id}
                            title="Remove evidence"
                          >
                            {removingEvidenceId === e.id ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {evidenceDoc && (
                <DocumentDetailModal
                  doc={evidenceDoc}
                  onUpdate={() => {}}
                  onDelete={() => setEvidenceDoc(null)}
                  onDownload={(d) => { downloadDocument(d); }}
                  onClose={() => setEvidenceDoc(null)}
                />
              )}

              <div className={styles.linkDocRow}>
                {showLinkDoc ? (
                  <div className={styles.linkDocDropdown}>
                    <p className={styles.linkDocLabel}>Select a document to link as evidence:</p>
                    <div className={styles.linkDocList}>
                      {(() => {
                        const linkedIds = new Set(evidence.map((e) => e.documentId).filter(Boolean));
                        const unlinked = availableDocs.filter((d) => !linkedIds.has(d.id));
                        return unlinked.length > 0 ? (
                          unlinked.map((d) => (
                            <button key={d.id} type="button" className={styles.linkDocItem} onClick={() => handleLinkDoc(d.id, d.title)}>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 2H11C11.6 2 12 2.4 12 3V11C12 11.6 11.6 12 11 12H3C2.4 12 2 11.6 2 11V3C2 2.4 2.4 2 3 2Z" stroke="currentColor" strokeWidth="1.2" fill="none" /><path d="M3 5H11M3 8H11" stroke="currentColor" strokeWidth="1.2" /></svg>
                              {d.title}
                            </button>
                          ))
                        ) : (
                          <p className={styles.linkDocEmpty}>All documents are already linked.</p>
                        );
                      })()}
                    </div>
                    <button type="button" className={styles.uploadFromLinkBtn} onClick={() => setShowUploadModal(true)}>
                      <Upload size={14} />
                      Upload a New Document
                    </button>
                    <button type="button" className={styles.linkDocCancel} onClick={() => setShowLinkDoc(false)}>Cancel</button>
                  </div>
                ) : (
                  <button type="button" className={styles.linkDocBtn} onClick={() => setShowLinkDoc(true)} disabled={isLinking}>
                    {isLinking ? (
                      <Loader2 size={14} className="animate-spin mr-2 inline" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2V12M2 7H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                    )}
                    {isLinking ? "Linking..." : "Link Document as Evidence"}
                  </button>
                )}
              </div>

              {showEvidenceWarning && (
                <div className={styles.evidenceWarning}>
                  <AlertTriangle size={16} className={styles.warnIcon} />
                  <div className={styles.warnBody}>
                    <strong>Evidence required</strong>
                    <p>Link at least one document as evidence before marking this task as complete.</p>
                  </div>
                  <button type="button" className={styles.warnDismiss} onClick={() => setShowEvidenceWarning(false)}>Got it</button>
                </div>
              )}

              {task.suggestionReason && (
                <div className={styles.reason}>
                  <strong>Suggested Because:</strong>
                  <p>{task.suggestionReason}</p>
                </div>
              )}

              {showUploadModal && (
                <DocumentUploadModal onSave={handleUploadDoc} onClose={() => setShowUploadModal(false)} />
              )}

              {showDeleteConfirm && (
                <div className={styles.confirmDeleteBanner}>
                  <p>Delete this task? This action cannot be undone.</p>
                  <div className={styles.confirmDeleteActions}>
                    <button type="button" className={styles.confirmDeleteCancel} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    <button type="button" className={styles.confirmDeleteBtn} onClick={() => onDelete(task.id)}>Delete</button>
                  </div>
                </div>
              )}
              <div className={styles.actions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)}>Delete</Button>
                <div className={styles.right}>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                  {task.status !== "completed" && (
                    <Button type="button" variant="primary" size="sm" onClick={() => {
                      if (evidence.length === 0) {
                        setShowEvidenceWarning(true);
                      } else {
                        onUpdate(task.id, { status: "completed" });
                      }
                    }}>Mark Complete</Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

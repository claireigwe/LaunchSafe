"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { AlertTriangle, Loader2 } from "lucide-react";
import { fetchEvidence, linkDocumentAsEvidenceAPI } from "@/features/compliance/api/evidence-api";
import { getDocuments } from "@/features/documents/api/documents-api";
import type { ComplianceTaskItem, UpdateTaskInput, TaskPriority, TaskStatus } from "../../types/tasks.types";
import type { EvidenceRecord } from "@/features/compliance/api/evidence-api";
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

  useEffect(() => {
    async function loadData() {
      const allEvidence = await fetchEvidence();
      setEvidence(allEvidence.filter(e => e.complianceTaskId === task.id));
      const docs = await getDocuments();
      setAvailableDocs(docs);
    }
    loadData();
  }, [task.id]);

  async function handleLinkDoc(docId: string, docTitle: string) {
    try {
      setIsLinking(true);
      await linkDocumentAsEvidenceAPI(docId, docTitle, task.id);
      const allEvidence = await fetchEvidence();
      setEvidence(allEvidence.filter(e => e.complianceTaskId === task.id));
      setShowLinkDoc(false);
    } catch (err) {
      console.error("Failed to link document", err);
      alert("Failed to link document as evidence.");
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
    ? Math.ceil((Date.now() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24))
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
                  <select className={styles.select} value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status</label>
                <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="overdue">Overdue</option>
                </select>
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

              {evidence.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Evidence ({evidence.length})</h4>
                  {evidence.map((e) => (
                    <div key={e.id} className={styles.evidenceItem}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 7L5.5 9.5L11 4" stroke="var(--color-key-success)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      <span className={styles.evidenceTitle}>{e.documentTitle}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className={styles.linkDocRow}>
                {showLinkDoc ? (
                  <div className={styles.linkDocDropdown}>
                    <p className={styles.linkDocLabel}>Select a document to link as evidence:</p>
                    {availableDocs.length === 0 ? (
                      <p className={styles.linkDocEmpty}>No documents available. Upload a document first.</p>
                    ) : (
                      availableDocs.map((d) => (
                        <button key={d.id} type="button" className={styles.linkDocItem} onClick={() => handleLinkDoc(d.id, d.title)}>
                          {d.title}
                        </button>
                      ))
                    )}
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

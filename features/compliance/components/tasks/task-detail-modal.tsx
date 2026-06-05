"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { ComplianceTaskItem, UpdateTaskInput, TaskPriority, TaskStatus } from "../../types/tasks.types";
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

              {task.suggestionReason && (
                <div className={styles.reason}>
                  <strong>Suggested Because:</strong>
                  <p>{task.suggestionReason}</p>
                </div>
              )}

              <div className={styles.actions}>
                <Button type="button" variant="ghost" size="sm" onClick={() => onDelete(task.id)}>Delete</Button>
                <div className={styles.right}>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>Edit</Button>
                  {task.status !== "completed" && (
                    <Button type="button" variant="primary" size="sm" onClick={() => onUpdate(task.id, { status: "completed" })}>Mark Complete</Button>
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

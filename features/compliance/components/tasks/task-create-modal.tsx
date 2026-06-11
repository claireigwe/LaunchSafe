"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { CreateTaskInput, TaskPriority } from "../../types/tasks.types";
import styles from "./task-create-modal.module.css";

interface Props {
  onSave: (input: CreateTaskInput) => void;
  onClose: () => void;
}

export function TaskCreateModal({ onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Task title is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ title: title.trim(), description: description.trim(), dueDate: dueDate || undefined, priority });
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>New Compliance Task</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Task Title</label>
            {errors.title && <p className={styles.error} role="alert">{errors.title}</p>}
            <input className={styles.input} placeholder="e.g. CAC Annual Return Filing" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.opt}>(optional)</span></label>
            <textarea className={styles.textarea} placeholder="Details about this compliance task" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Due Date <span className={styles.opt}>(optional)</span></label>
              <input type="date" className={styles.input} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Priority</label>
              <Select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} options={["low","medium","high","critical"]} />
            </div>
          </div>
          <div className={styles.actions}>
            <Button type="button" variant="ghost" size="md" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" size="md">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

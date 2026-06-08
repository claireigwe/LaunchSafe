"use client";

import { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DOC_TYPE_LABELS, type DocType } from "../types/documents.types";
import type { UploadDocumentInput } from "../api/documents-api";
import { DOC_TYPES } from "../data/document-types";
import styles from "./document-upload-modal.module.css";

interface Props {
  onSave: (input: UploadDocumentInput) => Promise<void> | void;
  onClose: () => void;
}

export function DocumentUploadModal({ onSave, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [docType, setDocType] = useState<DocType>("other");
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];

  function validate() {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!file) e.file = "Please select a file";
    if (file && !ALLOWED.includes(file.type)) e.file = "Only PDF, PNG, and JPG files are supported";
    if (file && file.size > 10 * 1024 * 1024) e.file = "File size must be under 10MB";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleDrop(ev: React.DragEvent) {
    ev.preventDefault();
    setDragOver(false);
    const f = ev.dataTransfer.files[0];
    if (f) setFile(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    setSubmitError(null);
    if (!validate()) return;
    if (!file) return;

    setIsSubmitting(true);
    const input: UploadDocumentInput = {
      title: title.trim(),
      description: description.trim(),
      docType,
      file,
    };
    
    try {
      await onSave(input);
    } catch (err: any) {
      setSubmitError(err.message || "Failed to upload document");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Upload Document</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Document Title</label>
            {errors.title && <p className={styles.error} role="alert">{errors.title}</p>}
            <input className={styles.input} placeholder="e.g. CAC Certificate of Incorporation" value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Document Type</label>
            <select className={styles.select} value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
              {DOC_TYPES.map((k) => <option key={k} value={k}>{DOC_TYPE_LABELS[k]}</option>)}
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Description <span className={styles.opt}>(optional)</span></label>
            <textarea className={styles.textarea} placeholder="Brief description of this document" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>File</label>
            {errors.file && <p className={styles.error} role="alert">{errors.file}</p>}
            <div
              className={`${styles.dropzone} ${dragOver ? styles.dragOver : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" className={styles.hidden} onChange={handleFileChange} />
              {file ? (
                <div className={styles.fileInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ) : (
                <div className={styles.dropText}>
                  <Upload size={24} className={styles.uploadIcon} />
                  <span>Drag & drop or click to browse</span>
                  <span className={styles.dropHint}>PDF, PNG, JPG up to 10MB</span>
                </div>
              )}
            </div>
          </div>
          {submitError && <div className={styles.submitError} style={{ color: "var(--color-role-light-error)", marginBottom: 16, fontSize: 14 }}>{submitError}</div>}
          <div className={styles.actions}>
            <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>{isSubmitting ? "Uploading..." : "Upload Document"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

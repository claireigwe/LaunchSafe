"use client";

import { useState } from "react";
import { Download, FileText, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import { formatFileSize, updateDocument } from "../api/documents-api";
import { DOC_TYPE_LABELS } from "../types/documents.types";
import type { AppDocument, DocType } from "../types/documents.types";
import { DOC_TYPES } from "../data/document-types";
import styles from "./document-detail-modal.module.css";

interface Props {
  doc: AppDocument;
  onUpdate: () => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function DocumentDetailModal({ doc, onUpdate, onDelete, onClose }: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(doc.description);
  const [docType, setDocType] = useState(doc.docType);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isPreviewable = doc.fileType === "application/pdf" || doc.fileType?.startsWith("image/");

  function handleDownload() {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.fileName;
      a.click();
    }
  }

  function handleSaveEdit() {
    updateDocument(doc.id, {
      title: title.trim() || doc.title,
      description: description.trim(),
      docType: docType as DocType,
    });
    setEditing(false);
    onUpdate();
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{editing ? "Edit Document" : doc.title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label="Close">&times;</button>
        </div>

        <div className={styles.body}>
          {previewUrl ? (
            <div className={styles.preview}>
              <iframe src={previewUrl} className={styles.iframe} title={doc.title} />
              <button type="button" className={styles.closePreview} onClick={() => setPreviewUrl(null)}>Close Preview</button>
            </div>
          ) : editing ? (
            <div className={styles.editForm}>
              <div className={styles.field}>
                <label className={styles.label}>Title</label>
                <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Type</label>
                <select className={styles.select} value={docType} onChange={(e) => setDocType(e.target.value as DocType)}>
                  {DOC_TYPES.map((k) => <option key={k} value={k}>{DOC_TYPE_LABELS[k]}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
              </div>
              <div className={styles.actions}>
                <Button type="button" variant="ghost" size="md" onClick={() => setEditing(false)}>Cancel</Button>
                <Button type="button" variant="primary" size="md" onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Type</span>
                  <span className={styles.metaValue}>{DOC_TYPE_LABELS[doc.docType]}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>File</span>
                  <span className={styles.metaValue}>{doc.fileName}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Size</span>
                  <span className={styles.metaValue}>{formatFileSize(doc.fileSize)}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>Uploaded</span>
                  <span className={styles.metaValue}>{new Date(doc.uploadedAt).toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })}</span>
                </div>
              </div>

              {doc.description && <p className={styles.description}>{doc.description}</p>}

              <div className={styles.actions}>
                {showDeleteConfirm ? (
                  <div className={styles.confirmDeleteDoc}>
                    <span>Delete this document?</span>
                    <div className={styles.confirmDocActions}>
                      <button type="button" className={styles.confirmDocCancel} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                      <button type="button" className={styles.confirmDocBtn} onClick={() => onDelete(doc.id)}>Delete</button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                    <Trash2 size={14} /> Delete
                  </Button>
                )}
                <div className={styles.rightActions}>
                  {isPreviewable && <Button type="button" variant="outline" size="sm" onClick={() => setPreviewUrl(doc.fileUrl)}><FileText size={14} /> Preview</Button>}
                  <Button type="button" variant="outline" size="sm" onClick={handleDownload}><Download size={14} /> Download</Button>
                  <Button type="button" variant="primary" size="sm" onClick={() => setEditing(true)}><Edit3 size={14} /> Edit</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

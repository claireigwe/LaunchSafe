"use client";

import { useState, useEffect } from "react";
import { Upload, LayoutGrid, List, Search, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "./document-card";
import { DocumentUploadModal } from "./document-upload-modal";
import { DocumentDetailModal } from "./document-detail-modal";
import { DocumentGeneratorModal } from "./document-generator-modal";
import { SuggestedDocumentsWidget } from "./suggested-documents-widget";
import { getDocuments, searchDocuments, uploadDocument, deleteDocument, type UploadDocumentInput } from "../api/documents-api";
import { getGeneratedDocuments, DOC_TYPE_LABELS_GEN } from "../api/document-generation";
import { DOC_TYPE_LABELS, type DocType } from "../types/documents.types";
import type { AppDocument } from "../types/documents.types";
import type { ComplianceDocument } from "@/types/domain/document";
import { trackEvent } from "@/features/assessments/api/assessment-api";
import styles from "./document-library.module.css";

type ViewMode = "table" | "card";
type FilterKey = "all" | DocType;

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "All Documents" },
  { key: "cac_certificate", label: "Certificates" },
  { key: "business_permit", label: "Permits" },
  { key: "operating_license", label: "Licenses" },
  { key: "inspection_report", label: "Reports" },
  { key: "policy_document", label: "Policies" },
  { key: "other", label: "Other" },
];

export function DocumentLibrary() {
  const [docs, setDocs] = useState<AppDocument[]>([]);
  const [view, setView] = useState<ViewMode>("card");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<AppDocument | null>(null);
  const [generatedDocs, setGeneratedDocs] = useState<ComplianceDocument[]>([]);

  useEffect(() => {
    setDocs(getDocuments());
    setGeneratedDocs(getGeneratedDocuments());
    trackEvent("Document Library Viewed");
  }, []);

  const allUploaded = [...docs];
  const allGenerated = generatedDocs.map(g => ({
    id: g.id,
    businessId: g.businessId,
    userId: g.userId,
    title: g.title,
    description: DOC_TYPE_LABELS_GEN[g.documentType] || g.documentType,
    docType: "other" as DocType,
    fileUrl: null,
    fileName: `${g.title}.txt`,
    fileSize: g.content?.length || 0,
    fileType: "text/plain",
    uploadedBy: "System",
    uploadedAt: g.createdAt,
    updatedAt: g.updatedAt,
    expiryDate: null,
    issuingAgency: null,
    verificationStatus: null,
    renewalDate: null,
    tags: [],
  }));

  const allItems = [...allUploaded, ...allGenerated];

  const filtered = (() => {
    let result = allItems;
    if (filter !== "all") {
      result = result.filter((d: any) => d.docType === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d: any) => d.title.toLowerCase().includes(q));
    }
    return result;
  })();

  function refresh() {
    setDocs(getDocuments());
    setGeneratedDocs(getGeneratedDocuments());
  }

  function handleUpload(input: UploadDocumentInput) {
    uploadDocument(input);
    trackEvent("Document Uploaded", { title: input.title });
    refresh();
    setShowUpload(false);
  }

  function handleDelete(id: string) {
    deleteDocument(id);
    trackEvent("Document Deleted", { id });
    refresh();
    setSelectedDoc(null);
  }

  function handleDownload(doc: AppDocument) {
    if (doc.fileUrl) {
      const a = document.createElement("a");
      a.href = doc.fileUrl;
      a.download = doc.fileName;
      a.click();
      trackEvent("Document Downloaded", { id: doc.id });
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Documents</h1>
          <p className={styles.subtitle}>Manage your compliance documents and records.</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="outline" size="md" onClick={() => setShowGenerate(true)}><FilePlus size={16} /> Generate</Button>
          <Button variant="primary" size="md" onClick={() => setShowUpload(true)}><Upload size={16} /> Upload</Button>
        </div>
      </div>

      <SuggestedDocumentsWidget onUpload={(title, docType) => {
        setShowUpload(true);
      }} />

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} className={styles.searchIcon} />
          <input className={styles.search} placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className={styles.viewToggle}>
          <button type="button" className={`${styles.viewBtn} ${view === "card" ? styles.viewActive : ""}`} onClick={() => setView("card")} aria-label="Card view"><LayoutGrid size={16} /></button>
          <button type="button" className={`${styles.viewBtn} ${view === "table" ? styles.viewActive : ""}`} onClick={() => setView("table")} aria-label="Table view"><List size={16} /></button>
        </div>
      </div>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button key={f.key} className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ""}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        view === "table" ? (
          <div className={styles.table}>
            <div className={styles.tableHeader}>
              <span className={styles.th}>Name</span>
              <span className={styles.th}>Type</span>
              <span className={styles.th}>Size</span>
              <span className={styles.th}>Date</span>
              <span className={styles.th} style={{ textAlign: "right" }}>Actions</span>
            </div>
            {filtered.map((d) => <DocumentCard key={d.id} doc={d} onView={setSelectedDoc} onDownload={handleDownload} viewMode="table" />)}
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map((d) => <DocumentCard key={d.id} doc={d} onView={setSelectedDoc} onDownload={handleDownload} viewMode="card" />)}
          </div>
        )
      ) : (
        <div className={styles.empty}>
          <p className={styles.emptyText}>
            {allItems.length === 0 ? "No documents yet. Upload or generate a document to get started." : "No matching documents found."}
          </p>
          {allItems.length === 0 && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="primary" size="md" onClick={() => setShowUpload(true)}>Upload Document</Button>
              <Button variant="outline" size="md" onClick={() => setShowGenerate(true)}>Generate Document</Button>
            </div>
          )}
              {allItems.length > 0 && <Button variant="ghost" size="sm" onClick={() => { setFilter("all"); setSearch(""); }}>Clear Filters</Button>}
        </div>
      )}

      {showUpload && <DocumentUploadModal onSave={handleUpload} onClose={() => setShowUpload(false)} />}
      {showGenerate && <DocumentGeneratorModal onClose={() => setShowGenerate(false)} onComplete={refresh} />}
      {selectedDoc && <DocumentDetailModal doc={selectedDoc} onUpdate={refresh} onDelete={handleDelete} onClose={() => setSelectedDoc(null)} />}
    </div>
  );
}

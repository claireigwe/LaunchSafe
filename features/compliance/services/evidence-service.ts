import { createAdminClient } from "@/lib/supabase/server";
import { getFileUrl } from "@/lib/supabase/storage";
import type { EvidenceRecord } from "../api/evidence-api";

export class EvidenceService {
  static async list(userId: string, includeArchived = false): Promise<EvidenceRecord[]> {
    const supabase = createAdminClient() as any;

    let query = supabase
      .from("evidence")
      .select("*")
      .eq("user_id", userId);

    if (!includeArchived) query = query.eq("is_archived", false);

    const { data, error } = await query.order("uploaded_at", { ascending: false });

    if (error) throw error;

    return await Promise.all(
      (data || []).map(async (row: any) => {
        const isStoragePath = row.file_url && !row.file_url.startsWith("http");
        const signedUrl = isStoragePath ? await getFileUrl(row.file_url) : null;

        return {
          id: row.id,
          documentId: row.document_id,
          businessId: row.business_id,
          complianceTaskId: row.compliance_task_id,
          requirementId: row.requirement_id,
          documentTitle: row.title,
          description: row.description || "",
          fileUrl: signedUrl || row.file_url,
          fileType: row.file_type,
          fileSizeBytes: row.file_size_bytes,
          isArchived: row.is_archived,
          uploadedAt: row.uploaded_at,
        };
      })
    );
  }

  static async saveDirect(params: {
    userId: string;
    businessId: string;
    complianceTaskId: string;
    title: string;
    description: string;
    evidenceId: string;
    storagePath: string;
    fileType: string;
    fileSize: number;
  }): Promise<EvidenceRecord> {
    const supabase = createAdminClient() as any;

    const { data: ev, error: insertError } = await supabase
      .from("evidence")
      .insert({
        id: params.evidenceId,
        user_id: params.userId,
        business_id: params.businessId,
        compliance_task_id: params.complianceTaskId,
        title: params.title,
        description: params.description,
        file_url: params.storagePath,
        file_type: params.fileType,
        file_size_bytes: params.fileSize,
        is_archived: false,
      })
      .select()
      .single();

    if (insertError || !ev) throw new Error("Failed to create evidence record");

    const signedUrl = await getFileUrl(params.storagePath);

    return {
      id: ev.id,
      documentId: ev.document_id,
      businessId: ev.business_id,
      complianceTaskId: ev.compliance_task_id,
      requirementId: ev.requirement_id,
      documentTitle: ev.title,
      description: ev.description || "",
      fileUrl: signedUrl || params.storagePath,
      fileType: ev.file_type,
      fileSizeBytes: ev.file_size_bytes,
      isArchived: ev.is_archived,
      uploadedAt: ev.uploaded_at,
    };
  }

  static async linkDocument(
    userId: string,
    documentId: string,
    complianceTaskId: string,
    businessId?: string
  ): Promise<EvidenceRecord> {
    const supabase = createAdminClient() as any;

    // Single query: grab doc metadata, verify ownership, and insert in one go
    const { data: doc, error: docError } = await supabase
      .from("compliance_documents")
      .select("id, title, content, requirement_id, storage_path, business_id")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (docError || !doc) throw new Error("Document not found or access denied");

    const resolvedBusinessId = businessId || doc.business_id;
    const evidenceId = crypto.randomUUID();
    const fileUrlToSave = doc.storage_path || `generated_doc:${doc.id}`;

    const { data: ev, error: insertError } = await supabase
      .from("evidence")
      .insert({
        id: evidenceId,
        user_id: userId,
        business_id: resolvedBusinessId,
        compliance_task_id: complianceTaskId,
        requirement_id: doc.requirement_id,
        document_id: documentId,
        title: doc.title,
        description: doc.content || "Linked from generated document",
        file_url: fileUrlToSave,
        file_type: doc.file_type || "application/pdf",
        file_size_bytes: doc.file_size || 0,
        is_archived: false,
      })
      .select()
      .single();

    if (insertError || !ev) throw new Error(insertError?.message || "Failed to link document as evidence");

    return {
      id: ev.id,
      documentId: ev.document_id,
      businessId: ev.business_id,
      complianceTaskId: ev.compliance_task_id,
      requirementId: ev.requirement_id,
      documentTitle: ev.title,
      description: ev.description || "",
      fileUrl: ev.file_url,
      fileType: ev.file_type,
      fileSizeBytes: ev.file_size_bytes,
      isArchived: ev.is_archived,
      uploadedAt: ev.uploaded_at,
    };
  }

  static async remove(userId: string, evidenceId: string): Promise<void> {
    const supabase = createAdminClient() as any;

    const { error } = await supabase
      .from("evidence")
      .update({ is_archived: true })
      .eq("id", evidenceId)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

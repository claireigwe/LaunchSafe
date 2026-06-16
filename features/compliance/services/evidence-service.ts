import { createAdminClient } from "@/lib/supabase/server";
import { uploadFile, getFileUrl } from "@/lib/supabase/storage";
import type { EvidenceRecord } from "../api/evidence-api";

export class EvidenceService {
  static async list(userId: string): Promise<EvidenceRecord[]> {
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .eq("user_id", userId)
      .order("uploaded_at", { ascending: false });

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

  static async upload(
    userId: string,
    businessId: string,
    complianceTaskId: string,
    title: string,
    description: string,
    file: File
  ): Promise<EvidenceRecord> {
    const supabase = createAdminClient() as any;
    const evidenceId = crypto.randomUUID();

    const buffer = await file.arrayBuffer();
    const storagePath = await uploadFile(userId, evidenceId, file.name, buffer, file.type);

    if (!storagePath) throw new Error("Failed to upload file to storage");

    const { data: ev, error: insertError } = await supabase
      .from("evidence")
      .insert({
        id: evidenceId,
        user_id: userId,
        business_id: businessId,
        compliance_task_id: complianceTaskId,
        title,
        description,
        file_url: storagePath,
        file_type: file.type,
        file_size_bytes: file.size,
        is_archived: false,
      })
      .select()
      .single();

    if (insertError || !ev) throw new Error("Failed to create evidence record");

    const signedUrl = await getFileUrl(storagePath);

    return {
      id: ev.id,
      documentId: ev.document_id,
      businessId: ev.business_id,
      complianceTaskId: ev.compliance_task_id,
      requirementId: ev.requirement_id,
      documentTitle: ev.title,
      description: ev.description || "",
      fileUrl: signedUrl || storagePath,
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

    let resolvedBusinessId = businessId;

    const { data: existingTask } = await supabase
      .from("compliance_tasks")
      .select("business_id")
      .eq("id", complianceTaskId)
      .maybeSingle();

    if (!existingTask) {
      await supabase.from("compliance_tasks").insert({
        id: complianceTaskId,
        business_id: resolvedBusinessId || "",
        requirement_name: "Compliance Task",
        agency_name: "",
        status: "not_started",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    } else if (!resolvedBusinessId) {
      resolvedBusinessId = existingTask.business_id;
    }

    const { data: doc, error: docError } = await supabase
      .from("compliance_documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", userId)
      .single();

    if (docError || !doc) throw new Error("Document not found or access denied");

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

    const isStoragePath = ev.file_url && !ev.file_url.startsWith("http") && !ev.file_url.startsWith("generated_doc:");
    const signedUrl = isStoragePath ? await getFileUrl(ev.file_url) : null;

    return {
      id: ev.id,
      documentId: ev.document_id,
      businessId: ev.business_id,
      complianceTaskId: ev.compliance_task_id,
      requirementId: ev.requirement_id,
      documentTitle: ev.title,
      description: ev.description || "",
      fileUrl: signedUrl || ev.file_url,
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
      .delete()
      .eq("id", evidenceId)
      .eq("user_id", userId);

    if (error) throw error;
  }
}

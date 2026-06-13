import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { getFileUrl } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { documentId, complianceTaskId, businessId } = body;

    if (!documentId || !complianceTaskId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "documentId and complianceTaskId are required" } },
        { status: 400 }
      );
    }

    let resolvedBusinessId = businessId;

    // Ensure the compliance task exists in the DB (FK constraint)
    const { data: existingTask } = await supabase
      .from("compliance_tasks")
      .select("business_id")
      .eq("id", complianceTaskId)
      .maybeSingle();

    if (!existingTask) {
      const { error: taskInsertError } = await supabase.from("compliance_tasks").insert({
        id: complianceTaskId,
        business_id: resolvedBusinessId || "",
        requirement_name: "Compliance Task",
        agency_name: "",
        status: "not_started",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      if (taskInsertError) {
        console.error("[LaunchSafe] Stub task insert error:", taskInsertError);
      }
    } else if (!resolvedBusinessId) {
      resolvedBusinessId = existingTask.business_id;
    }

    // 1. Fetch the document details
    const { data: doc, error: docError } = await supabase
      .from("compliance_documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single();

    if (docError || !doc) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Document not found or access denied" } },
        { status: 404 }
      );
    }

    const evidenceId = crypto.randomUUID();

    // 2. Insert into evidence, using the exact same storage_path (or generated content if no file)
    // If it's an AI-generated document without a file, storage_path might be null.
    // In that case, we can either save the AI text in `description` or return an error.
    // Here we'll map storage_path to file_url.
    const fileUrlToSave = doc.storage_path || `generated_doc:${doc.id}`;

    const { data: ev, error: insertError } = await supabase
      .from("evidence")
      .insert({
        id: evidenceId,
        user_id: user.id,
        business_id: resolvedBusinessId,
        compliance_task_id: complianceTaskId,
        requirement_id: doc.requirement_id,
        document_id: documentId,
        title: doc.title,
        description: doc.content || "Linked from generated document",
        file_url: fileUrlToSave,
        file_type: doc.file_type || "application/pdf", // fallback
        file_size_bytes: doc.file_size || 0,
        is_archived: false,
      })
      .select()
      .single();

    if (insertError || !ev) {
      console.error("[LaunchSafe] Link evidence insert error:", insertError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: insertError?.message || "Failed to link document as evidence" } },
        { status: 500 }
      );
    }

    const isStoragePath = ev.file_url && !ev.file_url.startsWith("http") && !ev.file_url.startsWith("generated_doc:");
    const signedUrl = isStoragePath ? await getFileUrl(ev.file_url) : null;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
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
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized or Invalid Request" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { uploadFile, getFileUrl } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const formData = await request.formData();

    const title = formData.get("title") as string;
    const description = formData.get("description") as string || "";
    const complianceTaskId = formData.get("complianceTaskId") as string;
    const businessId = formData.get("businessId") as string;
    const file = formData.get("file") as File;

    if (!title || !file || !complianceTaskId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title, complianceTaskId, and file are required" } },
        { status: 400 }
      );
    }

    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "File size must be under 10MB" } },
        { status: 400 }
      );
    }

    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(file.type)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Only PDF, PNG, and JPG files are supported" } },
        { status: 400 }
      );
    }

    const supabase = createAdminClient() as any;
    const evidenceId = crypto.randomUUID();

    // 1. Upload to Supabase Storage first
    const buffer = await file.arrayBuffer();
    const storagePath = await uploadFile(user.id, evidenceId, file.name, buffer, file.type);

    if (!storagePath) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Failed to upload file to storage" } },
        { status: 500 }
      );
    }

    // 2. Insert into evidence table
    const { data: ev, error: insertError } = await supabase
      .from("evidence")
      .insert({
        id: evidenceId,
        user_id: user.id,
        business_id: businessId,
        compliance_task_id: complianceTaskId,
        title,
        description,
        file_url: storagePath, // Storing storagePath in file_url column
        file_type: file.type,
        file_size_bytes: file.size,
        is_archived: false,
      })
      .select()
      .single();

    if (insertError || !ev) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Failed to create evidence record" } },
        { status: 500 }
      );
    }

    const signedUrl = await getFileUrl(storagePath);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: ev.id,
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

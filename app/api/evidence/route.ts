import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { getFileUrl } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api.types";

export async function GET(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .eq("user_id", user.id)
      .order("uploaded_at", { ascending: false });

    if (error) throw error;

    const evidenceRecords = await Promise.all(
      (data || []).map(async (row: any) => {
        // We store the storage path in `file_url` column to avoid schema changes.
        // If it looks like a Supabase path (not an http URL), generate a signed URL.
        const isStoragePath = row.file_url && !row.file_url.startsWith("http");
        const signedUrl = isStoragePath ? await getFileUrl(row.file_url) : null;
        
        return {
          id: row.id,
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

    return NextResponse.json<ApiResponse>({ success: true, data: evidenceRecords });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

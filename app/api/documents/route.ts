import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { getFileUrl } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;

    const { data, error } = await supabase
      .from("compliance_documents")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const docs = await Promise.all(
      (data || []).map(async (row: any) => {
        const fileUrl = row.storage_path ? await getFileUrl(row.storage_path) : null;
        return {
          id: row.id,
          businessId: row.business_id || "onboarded",
          userId: row.user_id,
          title: row.title,
          description: row.content || "",
          docType: row.document_type || "other",
          fileUrl,
          fileName: row.file_name || "document",
          fileSize: row.file_size || 0,
          fileType: row.file_type || "application/octet-stream",
          uploadedBy: "You",
          uploadedAt: row.created_at,
          updatedAt: row.updated_at,
          expiryDate: null,
          issuingAgency: null,
          verificationStatus: null,
          renewalDate: null,
          tags: [],
        };
      })
    );

    return NextResponse.json<ApiResponse>({ success: true, data: docs });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient() as any;
    const body = await request.json();
    const { title, description, docType, fileName, fileSize, fileType } = body;

    if (!title) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title is required" } },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("compliance_documents")
      .insert({
        user_id: user.id,
        business_id: body.businessId || "onboarded",
        title,
        document_type: docType || "other",
        status: "final",
        content: description || null,
        file_name: fileName || "document",
        file_size: fileSize || 0,
        file_type: fileType || "application/octet-stream",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json<ApiResponse>(
      { success: true, data: { ...(data || {}), fileUrl: null } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

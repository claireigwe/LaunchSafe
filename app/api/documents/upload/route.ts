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
    const docType = formData.get("docType") as string || "other";
    const file = formData.get("file") as File;

    if (!title || !file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Title and file are required" } },
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
    const docId = crypto.randomUUID();

    const { data: doc, error: insertError } = await supabase
      .from("compliance_documents")
      .insert({
        id: docId,
        user_id: user.id,
        business_id: "onboarded",
        title,
        document_type: docType,
        status: "final",
        storage_path: null,
        content: description,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      })
      .select()
      .single();

    if (insertError || !doc) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Failed to create document record" } },
        { status: 500 }
      );
    }

    const buffer = await file.arrayBuffer();
    const storagePath = await uploadFile(user.id, docId, file.name, buffer, file.type);

    if (storagePath) {
      await supabase
        .from("compliance_documents")
        .update({ storage_path: storagePath })
        .eq("id", docId);
    }

    const fileUrl = storagePath ? await getFileUrl(storagePath) : null;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: docId,
          title,
          description,
          docType,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl,
          uploadedBy: "You",
          uploadedAt: doc.created_at,
          updatedAt: doc.updated_at,
        },
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

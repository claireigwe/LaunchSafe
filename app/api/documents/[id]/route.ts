import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import { getFileUrl, deleteFile } from "@/lib/supabase/storage";
import type { ApiResponse } from "@/types/api.types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getRequiredUser();
    const { id } = await params;
    const supabase = createAdminClient() as any;

    const { data } = await supabase
      .from("compliance_documents")
      .select("*")
      .eq("id", id)
      .single();

    if (!data) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Document not found" } },
        { status: 404 }
      );
    }

    const fileUrl = data.storage_path ? await getFileUrl(data.storage_path) : null;

    return NextResponse.json<ApiResponse>({ success: true, data: { ...data, fileUrl } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getRequiredUser();
    const { id } = await params;
    const supabase = createAdminClient() as any;

    const { data: doc } = await supabase
      .from("compliance_documents")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (doc?.storage_path) {
      await deleteFile(doc.storage_path);
    }

    await supabase.from("compliance_documents").delete().eq("id", id);

    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

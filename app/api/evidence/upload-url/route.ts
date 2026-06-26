import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { getUploadUrl } from "@/lib/supabase/storage";
import crypto from "crypto";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "fileName and fileType are required" } },
        { status: 400 }
      );
    }

    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (!allowed.includes(fileType)) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Only PDF, PNG, and JPG files are supported" } },
        { status: 400 }
      );
    }

    const evidenceId = crypto.randomUUID();
    const result = await getUploadUrl(user.id, evidenceId, fileName, fileType);

    if (!result) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Failed to generate upload URL" } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { evidenceId, ...result } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

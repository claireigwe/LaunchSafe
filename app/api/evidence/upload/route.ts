import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { EvidenceService } from "@/features/compliance/services/evidence-service";
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

    if (!businessId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business ID is required" } },
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

    const evidence = await EvidenceService.upload(user.id, businessId, complianceTaskId, title, description, file);

    return NextResponse.json<ApiResponse>({ success: true, data: evidence }, { status: 201 });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized or Invalid Request" } },
      { status: 401 }
    );
  }
}

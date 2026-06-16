import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { EvidenceService } from "@/features/compliance/services/evidence-service";
import type { ApiResponse } from "@/types/api.types";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const data = await EvidenceService.list(user.id);
    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Evidence ID is required" } },
        { status: 400 }
      );
    }

    await EvidenceService.remove(user.id, id);
    return NextResponse.json<ApiResponse>({ success: true, data: { deleted: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

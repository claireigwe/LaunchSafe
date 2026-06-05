import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const body = await request.json();
    const { businessName, industry, businessType, state } = body;

    if (!businessName || !industry || !state) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Missing required fields" } },
        { status: 400 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { id: "pending", message: "Business profile created" } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

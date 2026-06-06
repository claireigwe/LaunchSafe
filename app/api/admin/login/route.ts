import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api.types";

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!ADMIN_SECRET) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Admin not configured" } },
        { status: 503 }
      );
    }

    if (password !== ADMIN_SECRET) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Invalid password" } },
        { status: 401 }
      );
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { authenticated: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Login failed" } },
      { status: 500 }
    );
  }
}

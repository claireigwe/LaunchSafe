import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function POST() {
  try {
    const user = await getRequiredUser();
    const supabase = createAdminClient();

    const { error } = await supabase.auth.admin.deleteUser(user.id);

    if (error) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: error.message } },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>(
      { success: true, data: { message: "Account deleted successfully" } },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Account deletion failed";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function PATCH(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { action } = body;

    if (action === "cancel") {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      if (sub) {
        await supabase
          .from("subscriptions")
          .update({ status: "cancelled", cancelled_at: new Date().toISOString() })
          .eq("id", sub.id);
      }
    }

    return NextResponse.json<ApiResponse>({ success: true, data: { updated: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { DB_TO_PLAN } from "@/lib/billing/features";
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
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const supabase = createAdminClient() as any;

    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      console.error("[Admin] Error fetching auth users:", authError);
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: authError.message } },
        { status: 500 }
      );
    }

    const { data: subs, error: subsError } = await supabase
      .from("subscriptions")
      .select("user_id, plan_id")
      .in("status", ["active", "trial", "suspended"]);

    if (subsError) {
      console.error("[Admin] Error fetching subscriptions:", subsError);
    }

    const { data: plans } = await supabase
      .from("subscription_plans")
      .select("id, slug");

    const planSlugMap: Record<string, string> = {};
    (plans || []).forEach((p: any) => {
      planSlugMap[p.id] = p.slug;
    });

    const planMap: Record<string, string | null> = {};
    (subs || []).forEach((s: any) => {
      const dbSlug = planSlugMap[s.plan_id];
      planMap[s.user_id] = (dbSlug && DB_TO_PLAN[dbSlug]) || dbSlug || null;
    });

    const { data: profiles } = await supabase
      .from("user_profiles")
      .select("user_id, full_name, created_at");

    const profileMap: Record<string, any> = {};
    (profiles || []).forEach((p: any) => {
      profileMap[p.user_id] = p;
    });

    const users = (authUsers?.users || []).map((u: any) => {
      const profile = profileMap[u.id];
      return {
        id: profile?.id || u.id,
        userId: u.id,
        email: u.email,
        fullName: profile?.full_name || u.user_metadata?.full_name || null,
        createdAt: profile?.created_at || u.created_at,
        currentPlan: planMap[u.id] ?? null,
      };
    });

    return NextResponse.json<ApiResponse>({ success: true, data: users });
  } catch (err) {
    console.error("[Admin] Users fetch error:", err);
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Internal error" } },
      { status: 500 }
    );
  }
}

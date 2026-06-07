import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

async function resolveMembership(db: any, userId: string): Promise<{ business_id: string; role: string } | null> {
  const { data: membership } = await db
    .from("business_members")
    .select("business_id, role")
    .eq("user_id", userId)
    .maybeSingle();

  if (membership) return membership;

  const { data: business } = await db
    .from("businesses")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!business) return null;

  await db.from("business_members").insert({
    business_id: business.id,
    user_id: userId,
    role: "owner",
    invited_by: userId,
    invited_at: new Date().toISOString(),
    joined_at: new Date().toISOString(),
  });

  return { business_id: business.id, role: "owner" };
}

export async function GET() {
  try {
    const user = await getRequiredUser();
    const db = createAdminClient() as any;

    const { data: planData } = await db
      .from("subscriptions")
      .select("subscription_plans!inner(slug)")
      .eq("user_id", user.id)
      .eq("subscription_plans.slug", "enterprise")
      .in("status", ["active", "trial"])
      .maybeSingle();

    if (!planData) {
      return NextResponse.json<ApiResponse>({ success: true, data: [] });
    }

    const myMembership = await resolveMembership(db, user.id);

    if (!myMembership) {
      return NextResponse.json<ApiResponse>({ success: true, data: [] });
    }

    const { data } = await db
      .from("business_members")
      .select("*, user_profiles(full_name, email)")
      .eq("business_id", myMembership.business_id);

    const members = (data || []).map((m: any) => ({
      id: m.id,
      businessId: m.business_id,
      role: m.role,
      name: m.user_profiles?.full_name || m.user_profiles?.email || "Unknown",
      joinedAt: m.joined_at,
      invitedAt: m.invited_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: members });
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
    const db = createAdminClient() as any;
    const body = await request.json();
    const { memberId } = body;

    const membership = await resolveMembership(db, user.id);

    if (!membership || membership.role === "member") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Not authorized" } },
        { status: 403 }
      );
    }

    const { data: planData } = await db
      .from("subscriptions")
      .select("subscription_plans!inner(slug)")
      .eq("user_id", user.id)
      .eq("subscription_plans.slug", "enterprise")
      .in("status", ["active", "trial"])
      .maybeSingle();

    if (!planData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Team collaboration requires an Enterprise plan" } },
        { status: 403 }
      );
    }

    await db
      .from("business_members")
      .delete()
      .eq("id", memberId)
      .eq("business_id", membership.business_id);

    return NextResponse.json<ApiResponse>({ success: true, data: { removed: true } });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

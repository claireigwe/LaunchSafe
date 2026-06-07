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

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const db = createAdminClient() as any;
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    const membership = await resolveMembership(db, user.id);

    if (!membership || membership.role === "member") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Not authorized to invite" } },
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

    const { data: authUsers } = await db.auth.admin.listUsers();

    const invitedAuthUser = authUsers?.users?.find(
      (u: any) => u.email?.toLowerCase() === email.toLowerCase()
    );

    if (!invitedAuthUser?.id) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "User not found. They need to sign up first." } },
        { status: 404 }
      );
    }

    const invitedUserId = invitedAuthUser.id;

    const { error } = await db
      .from("business_members")
      .insert({
        business_id: membership.business_id,
        user_id: invitedUserId,
        role: role || "member",
        invited_by: user.id,
        invited_at: new Date().toISOString(),
      });

    if (error?.message?.includes("unique") || error?.code === "23505") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "User is already a member" } },
        { status: 409 }
      );
    }

    if (error) throw error;

    await db.from("notifications").insert({
      user_id: invitedUserId,
      title: "You've been added to a team",
      message: `You have been added to the business. You now have ${role || "member"} access.`,
      type: "system",
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { invited: true } },
      { status: 201 }
    );
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

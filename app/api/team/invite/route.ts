import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { email, role } = body;

    if (!email) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Email is required" } },
        { status: 400 }
      );
    }

    const { data: membership } = await supabase
      .from("business_members")
      .select("business_id, role")
      .eq("user_id", user.id)
      .single();

    if (!membership || membership.role === "member") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Not authorized to invite" } },
        { status: 403 }
      );
    }

    const { data: invitedProfile } = await supabase
      .from("user_profiles")
      .select("user_id")
      .eq("email", email)
      .single();

    if (!invitedProfile) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "User not found. They need to sign up first." } },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("business_members")
      .insert({
        business_id: membership.business_id,
        user_id: invitedProfile.user_id,
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

    await supabase.from("notifications").insert({
      user_id: invitedProfile.user_id,
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

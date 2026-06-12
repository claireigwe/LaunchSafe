import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { ApiResponse } from "@/types/api.types";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;

    const { data, error } = await supabase
      .from("businesses")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const businesses = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description || "",
      industryId: row.industry_id,
      stateId: row.state_id,
      status: row.status,
      employeeCount: row.employee_count,
      website: row.website,
      details: row.details || {},
      createdAt: row.created_at,
    }));

    return NextResponse.json<ApiResponse>({ success: true, data: businesses });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient() as any;
    const body = await request.json();
    const { name, description, industrySlug, stateSlug, website, employeeCount, details } = body;

    if (!name) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Business name is required" } },
        { status: 400 }
      );
    }

    const adminSupabase = createAdminClient() as any;
    const { count: bizCount } = await adminSupabase
      .from("businesses")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Require an active subscription before any business can be created
    const { data: sub } = await adminSupabase
      .from("subscriptions")
      .select("plan_id, status")
      .eq("user_id", user.id)
      .in("status", ["active", "trial"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "A subscription is required to create a business. Please subscribe to a plan first.", code: "payment_required" } },
        { status: 402 }
      );
    }

    let planSlug: string | null = null;
    if (sub?.plan_id) {
      const { data: plan } = await adminSupabase
        .from("subscription_plans")
        .select("slug")
        .eq("id", sub.plan_id)
        .maybeSingle();
      if (plan) planSlug = plan.slug;
    }
    const limit = require("@/lib/billing/features").resolveAccess(planSlug, "active").limits.businesses || 1;

    if (bizCount !== null && bizCount !== undefined && bizCount >= limit) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: `Your plan allows up to ${limit} business${limit > 1 ? "es" : ""}. Upgrade to add more.` } },
        { status: 403 }
      );
    }

    const { data: existing } = await supabase
      .from("businesses")
      .select("id, name")
      .eq("user_id", user.id)
      .eq("name", name)
      .maybeSingle();

    if (existing) {
      await supabase.from("business_members").insert({
        business_id: existing.id,
        user_id: user.id,
        role: "owner",
        invited_by: user.id,
        invited_at: new Date().toISOString(),
        joined_at: new Date().toISOString(),
      }).maybeSingle();

      return NextResponse.json<ApiResponse>(
        { success: true, data: { id: existing.id, name: existing.name } },
        { status: 200 }
      );
    }

    let industry_id = null;
    if (industrySlug) {
      const { data: ind } = await supabase.from("industries").select("id").eq("slug", industrySlug).maybeSingle();
      if (ind) industry_id = ind.id;
    }

    let state_id = null;
    if (stateSlug) {
      // States table has no slug column — match by name (case-insensitive)
      const { data: st } = await supabase.from("states").select("id").ilike("name", stateSlug).maybeSingle();
      if (st) state_id = st.id;
    }

    // Default country to Nigeria (Phase 1 market)
    let country_id = null;
    const { data: ng } = await supabase.from("countries").select("id").eq("code", "NG").maybeSingle();
    if (ng) country_id = ng.id;

    const { data, error } = await supabase
      .from("businesses")
      .insert({
        user_id: user.id,
        name,
        description: description || null,
        website: website || null,
        employee_count: employeeCount ? parseInt(employeeCount, 10) || null : null,
        details: details || {},
        status: "active",
        industry_id,
        state_id,
        country_id,
      })
      .select()
      .single();

    if (error) throw error;

    await supabase.from("business_members").insert({
      business_id: data.id,
      user_id: user.id,
      role: "owner",
      invited_by: user.id,
      invited_at: new Date().toISOString(),
      joined_at: new Date().toISOString(),
    });

    return NextResponse.json<ApiResponse>(
      { success: true, data: { id: data.id, name: data.name } },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message } },
      { status: 500 }
    );
  }
}

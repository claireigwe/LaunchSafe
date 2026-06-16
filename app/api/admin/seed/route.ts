import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { INDUSTRIES } from "@/features/assessments/data/industries";
import { SUBSCRIPTION_PLANS } from "@/features/businesses/data/subscription-plans";
import { ASSESSMENT_COUNTRIES as COUNTRIES } from "@/features/assessments/data/countries-data";
import { REGULATORY_UPDATES } from "@/features/regulatory-updates/data/regulatory-updates-data";
import type { ApiResponse } from "@/types/api.types";

export async function POST() {
  try {
    const supabase = createAdminClient() as any;
    const results: string[] = [];

    for (const c of COUNTRIES) {
      const { data } = await supabase.from("countries").select("id").eq("code", c.id).single();
      if (!data) {
        await supabase.from("countries").insert({ name: c.name, code: c.id });
        results.push(`Country: ${c.name}`);
      }
    }

    for (const ind of INDUSTRIES) {
      const { data } = await supabase.from("industries").select("id").eq("slug", ind.id).single();
      if (!data) {
        await supabase.from("industries").insert({ name: ind.name, slug: ind.id, description: ind.description });
        results.push(`Industry: ${ind.name}`);
      }
    }

    for (const plan of SUBSCRIPTION_PLANS) {
      const { data } = await supabase.from("subscription_plans").select("id").eq("slug", plan.id).single();
      if (!data) {
        await supabase.from("subscription_plans").insert({
          name: plan.name, slug: plan.id,
          price_monthly: plan.monthlyPrice * 100,
          price_yearly: plan.annualTotal * 100,
          features: plan.features.map((f) => f.text),
          business_limit: plan.id === "starter" ? 1 : plan.id === "growth" ? 5 : 20,
          assessment_limit: 999, is_active: true,
        });
        results.push(`Plan: ${plan.name}`);
      }
    }

    for (const upd of REGULATORY_UPDATES) {
      const { data } = await supabase.from("regulatory_updates").select("id").eq("title", upd.title).single();
      if (!data) {
        await supabase.from("regulatory_updates").insert({
          title: upd.title, summary: upd.summary, source: upd.source, source_url: upd.sourceUrl,
          effective_date: upd.effectiveDate, affected_industries: upd.affectedIndustries,
          impact_level: upd.impactLevel, is_published: true, published_at: upd.publishedAt || new Date().toISOString(),
        });
        results.push(`Update: ${upd.title.slice(0, 40)}`);
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { message: `Seeded ${results.length} records`, details: results },
    });
  } catch (error) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Seed failed" } },
      { status: 500 }
    );
  }
}

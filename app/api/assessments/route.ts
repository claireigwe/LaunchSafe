import { NextResponse } from "next/server";
import { getRequiredUser } from "@/lib/auth/get-session";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { AssessmentEngine } from "@/features/assessments/services/assessment-engine";
import type { ApiResponse } from "@/types/api.types";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getRequiredUser();
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("assessments")
      .select("id, status, summary_json, results_json, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    const list = (data || []).map((a: any) => ({
      id: a.id,
      status: a.status,
      summary: a.summary_json,
      hasReport: a.results_json !== null,
      createdAt: a.created_at,
    }));

    return NextResponse.json<ApiResponse>({
      success: true,
      data: list,
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Use admin client to bypass RLS — no session required for anonymous assessments
    const supabase = createAdminClient() as any;
    let userId: string | null = null;

    try {
      const { cookies } = await import("next/headers");
      const { createServerClient } = await import("@supabase/ssr");
      const cookieStore = await cookies();
      const authClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: () => {},
          },
        }
      );
      const { data: { user } } = await authClient.auth.getUser();
      if (user) userId = user.id;
    } catch {} // Anonymous user — userId stays null

    const body = await request.json();
    const { data: formData } = body;

    if (!formData) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: { message: "Assessment data is required" } },
        { status: 400 }
      );
    }

    const { summary: summaryJson, report: resultsJson } = await AssessmentEngine.generateAssessment(formData);

    // Resolve sub_industry_id from form data
    let subIndustryId = null;
    const industrySlug = formData?.basics?.industry;
    const subIndustrySlug = formData?.basics?.subIndustry;
    if (industrySlug && subIndustrySlug) {
      const { data: ind } = await (supabase as any)
        .from("industries")
        .select("id")
        .eq("slug", industrySlug)
        .maybeSingle();
      if (ind) {
        const { data: subInd } = await (supabase as any)
          .from("sub_industries")
          .select("id")
          .eq("slug", subIndustrySlug)
          .eq("industry_id", (ind as any).id)
          .maybeSingle();
        if (subInd) subIndustryId = subInd.id;
      }
    }

    // LGA is already a UUID from the wizard selection
    const lgaId = formData?.location?.lga || null;

    // Store assessment for both authenticated and anonymous users
    const { data: assessment, error } = await supabase
      .from("assessments")
      .insert({
        user_id: userId || null,
        status: "completed",
        wizard_data: formData,
        sub_industry_id: subIndustryId,
        lga_id: lgaId,
        summary_json: summaryJson,
        results_json: resultsJson,
      } as any)
      .select()
      .single();

    if (error) throw error;
    if (!assessment) throw new Error("Failed to create assessment");

    const a = assessment as any;

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        data: {
          id: a.id,
          userId: a.user_id,
          businessId: null,
          industryId: null,
          countryId: null,
          stateId: null,
          status: a.status,
          summaryJson: a.summary_json,
          resultsJson: null,
          createdAt: a.created_at,
          updatedAt: a.updated_at,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[Assessment Create] Error:", error);
    const message = error?.message || (typeof error === 'string' ? error : "Internal server error");
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: { message },
      },
      { status: 500 }
    );
  }
}

function generateSummaryFromData(formData: any) {
  const {
    basics = {},
    activities = {},
    location = {},
    team = {},
    industryQuestions = {},
  } = formData;

  const industryConfig = getIndustryConfig(basics.industry);

  let requirementCount = industryConfig.baseRequirements;
  let agencyCount = industryConfig.baseAgencies;

  if (activities.willManufacture) requirementCount += 2;
  if (activities.willImport) requirementCount += 2;
  if (activities.willExport) requirementCount += 2;
  if (activities.hasPhysicalLocation) requirementCount += 1;
  if (activities.willOperateOnline) requirementCount += 1;
  if (location.requiresInspections) requirementCount += 2;
  if (location.handlesRegulatedGoods) requirementCount += 2;
  if (team.hireImmediately) requirementCount += 1;

  const employeeCount = parseInt(team.employeeCount, 10);
  if (!isNaN(employeeCount)) {
    if (employeeCount > 50) agencyCount += 2;
    else if (employeeCount > 10) agencyCount += 1;
  }

  const stageMultiplier =
    basics.businessStage === "existing" ? 1.2 :
    basics.businessStage === "launching" ? 1.0 :
    basics.businessStage === "planning" ? 0.8 : 0.6;

  requirementCount = Math.max(1, Math.round(requirementCount * stageMultiplier));
  agencyCount = Math.max(1, Math.round(agencyCount * stageMultiplier));

  let complexityScore = industryConfig.complexityBase;
  if (activities.willManufacture) complexityScore += 10;
  if (activities.willImport) complexityScore += 8;
  if (activities.willExport) complexityScore += 8;
  if (location.handlesRegulatedGoods) complexityScore += 10;
  if (location.requiresInspections) complexityScore += 8;
  if (team.hireImmediately) complexityScore += 5;
  complexityScore = Math.min(100, Math.max(5, complexityScore));

  return {
    businessType: industryConfig.label || basics.businessType || "Business",
    location: location.country
      ? `${location.state ? getStateLabel(location.country, location.state) + ", " : ""}${getCountryLabel(location.country)}`
      : "Location not specified",
    requirementCount,
    agencyCount,
    complexityScore,
    categories: industryConfig.categories,
  };
}

function getCountryLabel(id: string): string {
  const map: Record<string, string> = {
    nigeria: "Nigeria", ghana: "Ghana", kenya: "Kenya", "south-africa": "South Africa",
  };
  return map[id] || id;
}

function getStateLabel(countryId: string, stateId: string): string {
  const states: Record<string, Record<string, string>> = {
    nigeria: { lagos: "Lagos", oyo: "Oyo", "abuja-fct": "Abuja (FCT)", rivers: "Rivers", kano: "Kano" },
    ghana: { "greater-accra": "Greater Accra", ashanti: "Ashanti" },
    kenya: { nairobi: "Nairobi", mombasa: "Mombasa" },
    "south-africa": { gauteng: "Gauteng", "western-cape": "Western Cape" },
  };
  return states[countryId]?.[stateId] || stateId;
}

function getIndustryConfig(industryId: string): {
  baseRequirements: number;
  baseAgencies: number;
  complexityBase: number;
  label: string;
  categories: string[];
} {
  const configs: Record<string, any> = {
    "food-beverage": {
      baseRequirements: 10, baseAgencies: 5, complexityBase: 35,
      label: "Food & Beverage Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Health & Safety", "Food Safety", "Employment Compliance"],
    },
    "health-pharma": {
      baseRequirements: 14, baseAgencies: 6, complexityBase: 45,
      label: "Healthcare Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Healthcare Regulation", "Health & Safety", "Data Protection", "Employment Compliance"],
    },
    "technology-saas": {
      baseRequirements: 8, baseAgencies: 4, complexityBase: 25,
      label: "Technology Business",
      categories: ["Business Registration", "Tax Compliance", "Data Protection", "Industry Licensing"],
    },
    "retail-ecommerce": {
      baseRequirements: 9, baseAgencies: 4, complexityBase: 28,
      label: "Retail Business",
      categories: ["Business Registration", "Tax Compliance", "Trade License", "Industry Licensing"],
    },
    manufacturing: {
      baseRequirements: 13, baseAgencies: 6, complexityBase: 42,
      label: "Manufacturing Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance", "Import/Export Regulations"],
    },
    agriculture: {
      baseRequirements: 10, baseAgencies: 5, complexityBase: 30,
      label: "Agricultural Business",
      categories: ["Business Registration", "Tax Compliance", "Environmental Compliance", "Health & Safety", "Import/Export Regulations", "Industry Licensing"],
    },
    education: {
      baseRequirements: 8, baseAgencies: 4, complexityBase: 22,
      label: "Education Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Employment Compliance"],
    },
    "finance-fintech": {
      baseRequirements: 15, baseAgencies: 7, complexityBase: 55,
      label: "Financial Services Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Financial Regulation", "Data Protection", "Employment Compliance", "Anti-Money Laundering"],
    },
    "real-estate-construction": {
      baseRequirements: 11, baseAgencies: 5, complexityBase: 38,
      label: "Real Estate & Construction Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance"],
    },
    "professional-services": {
      baseRequirements: 7, baseAgencies: 3, complexityBase: 18,
      label: "Professional Services Firm",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Employment Compliance"],
    },
    "transportation-logistics": {
      baseRequirements: 10, baseAgencies: 5, complexityBase: 32,
      label: "Transportation & Logistics Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Transport Regulation", "Employment Compliance"],
    },
    "energy-mining": {
      baseRequirements: 16, baseAgencies: 8, complexityBase: 52,
      label: "Energy & Mining Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Environmental Compliance", "Health & Safety", "Employment Compliance", "Import/Export Regulations"],
    },
    "fashion-apparel": {
      baseRequirements: 8, baseAgencies: 4, complexityBase: 22,
      label: "Fashion & Apparel Business",
      categories: ["Business Registration", "Tax Compliance", "Industry Licensing", "Trade License", "Employment Compliance"],
    },
  };

  return configs[industryId] || {
    baseRequirements: 7, baseAgencies: 3, complexityBase: 20,
    label: "Business",
    categories: ["Business Registration", "Tax Compliance"],
  };
}

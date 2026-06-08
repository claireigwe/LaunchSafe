import { createAdminClient } from "@/lib/supabase/server";
import { callDeepSeek } from "./deepseek";
import type { DocumentType } from "@/types/domain/document";

export async function generateDocumentWithAI(
  docType: DocumentType,
  contextText: string,
  businessId: string
) {
  const supabase = createAdminClient() as any;

  // 1. Fetch business details with related names
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("*, industries(name, slug), states(name), lgas(name), countries(name, code)")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    throw new Error(`Failed to fetch business context: ${businessError?.message}`);
  }

  // 2. Resolve industry ID (fallback for older businesses)
  let targetIndustryId = business.industry_id;
  if (!targetIndustryId && business.description) {
    try {
      const descData = JSON.parse(business.description);
      if (descData.industry) {
        const { data: ind } = await supabase.from("industries").select("id").eq("slug", descData.industry).maybeSingle();
        if (ind) targetIndustryId = ind.id;
      }
    } catch {
      // Not JSON or invalid, ignore
    }
  }

  // 3. Fetch regulatory requirements filtered by industry + country + state
  let requirements: any[] = [];

  if (targetIndustryId) {
    let query = supabase
      .from("requirements")
      .select("name, description, agency_id, confidence_level, requirement_type, frequency, source_url, source_document, agencies(name, acronym)")
      .eq("industry_id", targetIndustryId)
      .eq("status", "active")
      .in("confidence_level", ["verified", "estimated"]);

    // Filter by country if available
    if (business.country_id) {
      query = query.eq("country_id", business.country_id);
    }

    // Filter by state if available — also include federal (null state) requirements
    if (business.state_id) {
      query = query.or(`state_id.eq.${business.state_id},state_id.is.null`);
    }

    const { data: reqs, error: reqError } = await query;

    if (reqError) {
      throw new Error(`Failed to fetch requirements: ${reqError.message}`);
    }
    if (reqs && reqs.length > 0) {
      // Fetch costs for these requirements
      const reqIds = reqs.map((r: any) => r.agency_id ? r : r).map((_: any, __: number, arr: any[]) => arr).length > 0
        ? reqs.map((r: any) => r.name)
        : [];
      
      // Fetch all requirement costs in a single query
      const reqUuids = reqs.map((r: any) => r.id).filter(Boolean);
      let costsMap: Record<string, any[]> = {};
      
      // Re-fetch with IDs to get costs
      const { data: reqsWithIds } = await supabase
        .from("requirements")
        .select("id, name")
        .eq("industry_id", targetIndustryId)
        .eq("status", "active")
        .in("confidence_level", ["verified", "estimated"]);

      if (reqsWithIds && reqsWithIds.length > 0) {
        const ids = reqsWithIds.map((r: any) => r.id);
        const { data: costs } = await supabase
          .from("requirement_costs")
          .select("requirement_id, cost_type, amount, currency, notes")
          .in("requirement_id", ids);

        if (costs) {
          for (const cost of costs) {
            if (!costsMap[cost.requirement_id]) costsMap[cost.requirement_id] = [];
            costsMap[cost.requirement_id].push(cost);
          }
        }

        // Merge cost info into requirements
        const nameToId: Record<string, string> = {};
        for (const r of reqsWithIds) nameToId[r.name] = r.id;

        requirements = reqs.map((r: any) => {
          const rid = nameToId[r.name];
          return { ...r, costs: rid ? (costsMap[rid] || []) : [] };
        });
      } else {
        requirements = reqs.map((r: any) => ({ ...r, costs: [] }));
      }
    }
  }

  // 4. Build rich regulatory context — with fallback from description JSON
  let industryName = business.industries?.name || null;
  let stateName = business.states?.name || null;
  let countryName = business.countries?.name || null;
  const countryCode = business.countries?.code || "";

  // Fallback: parse description JSON for names when FKs are missing
  if ((!industryName || !stateName) && business.description) {
    try {
      const descData = JSON.parse(business.description);
      if (!industryName && descData.industry) {
        // Try to get a human-readable name from the slug
        const { data: ind } = await supabase.from("industries").select("name").eq("slug", descData.industry).maybeSingle();
        industryName = ind?.name || descData.industry.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
      if (!stateName && descData.state) {
        const { data: st } = await supabase.from("states").select("name").ilike("name", descData.state).maybeSingle();
        stateName = st?.name || descData.state.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
      // Assume Nigeria if no country is set (Phase 1 market)
      if (!countryName) {
        countryName = "Nigeria";
      }
    } catch {
      // Not JSON, ignore
    }
  }

  // Final defaults
  industryName = industryName || "General Business";
  stateName = stateName || "Nigeria";
  countryName = countryName || "Nigeria";

  const reqContext = requirements.length > 0
    ? requirements.map((r: any) => {
        const agencyStr = r.agencies?.acronym
          ? `${r.agencies.name} (${r.agencies.acronym})`
          : (r.agencies?.name || "Unknown Agency");

        let costStr = "";
        if (r.costs && r.costs.length > 0) {
          costStr = "\n   Costs: " + r.costs.map((c: any) => {
            const amt = (c.amount / 100).toLocaleString();
            return `${c.currency} ${amt} (${c.cost_type})${c.notes ? ` - ${c.notes}` : ""}`;
          }).join("; ");
        }

        return `- Requirement: ${r.name}
   Description: ${r.description}
   Agency: ${agencyStr}
   Type: ${r.requirement_type}
   Frequency: ${r.frequency}${costStr}${r.source_document ? `\n   Source: ${r.source_document}` : ""}`;
      }).join("\n\n")
    : null;

  // 5. Construct System Prompt
  const systemPrompt = `You are the LaunchSafe Compliance AI, an expert regulatory assistant for businesses in ${countryName}.
You must generate a precise, professional ${docType.replace(/_/g, " ")} specifically for a ${industryName} business operating in ${stateName}, ${countryName}.

### STRICT RULES:
1. NEVER invent regulatory requirements, fees, timelines, or penalties.
2. Ground your document strictly in the provided regulatory context below.
3. If you do not know specific fees, costs, or exact dates, simply omit them or describe the step without mentioning a specific amount. NEVER use placeholder text like "[Insert Amount]" or "[Insert Date]".
4. Output ONLY the document content. Do not include introductory conversational text.
5. Write in a formal, professional tone suitable for submission to government or regulatory bodies.
6. CRITICAL: ABSOLUTELY NO DISCLAIMERS, NOTES, OR WARNINGS at the end of the document. The document MUST end immediately after the final content item.
7. FORMATTING: Output clean plain text. DO NOT use markdown bolding (**), italics, or hash (#) headers. Use standard plain text spacing, numbering, and UPPERCASE for section titles.
8. Be SPECIFIC to ${countryName} (${countryCode}) and ${stateName}. Reference actual regulatory bodies, actual laws, and actual government agencies of ${countryName}. NEVER use generic phrases like "the appropriate corporate affairs commission" — use the actual name (e.g., "Corporate Affairs Commission (CAC)" for Nigeria).
9. Include specific agency names, specific registration processes, and specific compliance steps that are relevant to ${stateName}, ${countryName}.
10. NEVER include conditional or hedging language like "If your business involves...", "If applicable...", or "If the business operates in...". Every item in the document must be a definite, actionable requirement for a ${industryName} business. If you are unsure whether something applies, omit it entirely rather than adding a conditional.
11. If generating a "compliance checklist", the checklist MUST be highly specific to the ${industryName} industry. It must include industry-specific facility standards, equipment compliance, health & safety protocols, and sector-specific permits (e.g., NAFDAC for food, PCN for pharmacy). Do NOT use generic business checklist items.

### BUSINESS CONTEXT:
Business Name: ${business.name}
Industry: ${industryName}
State of Operation: ${stateName}
Country: ${countryName}${countryCode ? ` (${countryCode})` : ""}
Local Government Area: ${business.lgas?.name || "Not specified"}
Description: ${business.description || "N/A"}

### REGULATORY REQUIREMENTS FROM LAUNCHSAFE DATABASE:
${reqContext || `No specific requirements have been loaded into the LaunchSafe database for this industry yet. However, you MUST still generate a ${countryName}-specific and ${stateName}-specific document using your knowledge of ${countryName}'s regulatory framework. Reference real agencies, real laws, and real processes. Do NOT fall back to generic, country-agnostic content.`}`;

  // 6. Construct User Prompt
  const userPrompt = `Generate a ${docType.replace(/_/g, " ")} for this ${industryName} business in ${stateName}, ${countryName}.
${contextText ? `Additional user context:\n${contextText}` : ""}
The document must be specific to ${countryName} regulations and ${stateName} state requirements. Reference actual agencies and laws by name.`;

  // 7. Call DeepSeek
  const content = await callDeepSeek(systemPrompt, userPrompt);

  return {
    title: `${business.name} - ${docType.replace(/_/g, " ").toUpperCase()}`,
    content,
  };
}

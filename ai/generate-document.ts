import { createAdminClient } from "@/lib/supabase/server";
import { callDeepSeek } from "./deepseek";
import type { DocumentType } from "@/types/domain/document";

export async function generateDocumentWithAI(
  docType: DocumentType,
  contextText: string,
  businessId: string,
  templateSlug?: string
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

    if (business.country_id) {
      query = query.eq("country_id", business.country_id);
    }

    if (business.state_id) {
      query = query.or(`state_id.eq.${business.state_id},state_id.is.null`);
    }

    const { data: reqs, error: reqError } = await query;

    if (reqError) {
      throw new Error(`Failed to fetch requirements: ${reqError.message}`);
    }
    if (reqs && reqs.length > 0) {
      const reqsWithIds = await supabase
        .from("requirements")
        .select("id, name")
        .eq("industry_id", targetIndustryId)
        .eq("status", "active")
        .in("confidence_level", ["verified", "estimated"]);

      if (reqsWithIds.data && reqsWithIds.data.length > 0) {
        const ids = reqsWithIds.data.map((r: any) => r.id);
        const { data: costs } = await supabase
          .from("requirement_costs")
          .select("requirement_id, cost_type, amount, currency, notes")
          .in("requirement_id", ids);

        const costsMap: Record<string, any[]> = {};
        if (costs) {
          for (const cost of costs) {
            if (!costsMap[cost.requirement_id]) costsMap[cost.requirement_id] = [];
            costsMap[cost.requirement_id].push(cost);
          }
        }

        const nameToId: Record<string, string> = {};
        for (const r of reqsWithIds.data) nameToId[r.name] = r.id;

        requirements = reqs.map((r: any) => {
          const rid = nameToId[r.name];
          return { ...r, costs: rid ? (costsMap[rid] || []) : [] };
        });
      } else {
        requirements = reqs.map((r: any) => ({ ...r, costs: [] }));
      }
    }
  }

  // 4. Build rich regulatory context
  let industryName = business.industries?.name || null;
  let stateName = business.states?.name || null;
  let countryName = business.countries?.name || null;
  const countryCode = business.countries?.code || "";

  if ((!industryName || !stateName) && business.description) {
    try {
      const descData = JSON.parse(business.description);
      if (!industryName && descData.industry) {
        const { data: ind } = await supabase.from("industries").select("name").eq("slug", descData.industry).maybeSingle();
        industryName = ind?.name || descData.industry.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
      if (!stateName && descData.state) {
        const { data: st } = await supabase.from("states").select("name").ilike("name", descData.state).maybeSingle();
        stateName = st?.name || descData.state.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
      }
      if (!countryName) {
        countryName = "Nigeria";
      }
    } catch {
      // Not JSON, ignore
    }
  }

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

  // 5. Fetch document template prompt if templateSlug provided
  let templatePrompt: string | null = null;
  if (templateSlug) {
    const { data: tmpl } = await supabase
      .from("document_templates")
      .select("prompt_template")
      .eq("slug", templateSlug)
      .eq("is_active", true)
      .maybeSingle();
    if (tmpl) templatePrompt = tmpl.prompt_template;
  }

  // 6. Construct System Prompt
  const noData = requirements.length === 0;
  const docLabel = docType.replace(/_/g, " ");
  const systemPrompt = `You are the LaunchSafe Compliance AI, a document generation assistant for businesses in ${countryName}.
You must generate a ${docLabel} for a ${industryName} business operating in ${stateName}, ${countryName}.

### STRICT RULES:
1. NEVER invent regulatory requirements, fees, timelines, or penalties.
2. ${noData
  ? "No regulatory data is available for this industry. Generate a general document template with placeholder sections. Clearly state that the user should consult relevant government agencies for specific compliance requirements."
  : "Ground your document strictly in the provided regulatory context below. If you do not know specific fees, costs, or exact dates, simply omit them or describe the step without mentioning a specific amount. NEVER use placeholder text like '[Insert Amount]' or '[Insert Date]'."
}
3. Output ONLY the document content. Do not include introductory conversational text.
4. Write in a formal, professional tone suitable for submission to government or regulatory bodies.
5. FORMATTING: Output clean plain text. DO NOT use markdown bolding (**), italics, or hash (#) headers. Use standard plain text spacing, numbering, and UPPERCASE for section titles.
6. ${noData ? "End the document with: 'Note: This document is a template. Compliance requirements vary by industry and location. Please consult the relevant government agencies for your specific obligations.'" : "CRITICAL: ABSOLUTELY NO DISCLAIMERS, NOTES, OR WARNINGS at the end of the document. The document MUST end immediately after the final content item."}
${templatePrompt ? `\n### DOCUMENT STRUCTURE GUIDELINES:\n${templatePrompt}` : ""}

### BUSINESS CONTEXT:
Business Name: ${business.name}
Industry: ${industryName}
State of Operation: ${stateName}
Country: ${countryName}${countryCode ? ` (${countryCode})` : ""}
Local Government Area: ${business.lgas?.name || "Not specified"}
Description: ${business.description || "N/A"}

### REGULATORY REQUIREMENTS FROM LAUNCHSAFE DATABASE:
${reqContext || "No regulatory requirements are available in the LaunchSafe database for this industry and location."}`;

  // 7. Construct User Prompt
  const userPrompt = `${noData
    ? `Generate a general ${docLabel} template for a ${industryName} business in ${stateName}, ${countryName}. Include common compliance categories and blank sections where the user can fill in specific regulatory details.`
    : `Generate a ${docLabel} for this ${industryName} business in ${stateName}, ${countryName}.
${contextText ? `Additional user context:\n${contextText}` : ""}
The document must be specific to ${countryName} regulations and ${stateName} state requirements. Reference actual agencies and laws by name.`
  }`;

  // 8. Call DeepSeek
  const content = await callDeepSeek({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.2,
  });

  return {
    title: `${business.name} - ${docLabel.toUpperCase()}`,
    content,
  };
}

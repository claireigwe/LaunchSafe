import type { SuggestedTask } from "../types/tasks.types";

interface BusinessProfile {
  industry: string;
  isRegistered: boolean | null;
  hasCAC: boolean | null;
  employeeCount: string;
  hasPhysicalLocation: boolean | null;
  hasOnlineOperations: boolean | null;
  hasCustomerLocation: boolean | null;
}

export async function fetchAITaskSuggestions(profile: BusinessProfile | null): Promise<SuggestedTask[]> {
  if (!profile) return [];

  try {
    const res = await fetch("/api/ai/assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `Based on the following business profile, suggest 3 specific compliance tasks the business should complete. Return ONLY a JSON array with objects having fields: title, description, explanation (why this matters), priority (one of: low, medium, high, critical), and reason.

Business details:
- Industry: ${profile.industry || "Not specified"}
- Registered: ${profile.isRegistered ? "Yes" : profile.isRegistered === false ? "No" : "Not specified"}
- Has CAC registration: ${profile.hasCAC ? "Yes" : profile.hasCAC === false ? "No" : "Not specified"}
- Employees: ${profile.employeeCount || "Not specified"}
- Physical location: ${profile.hasPhysicalLocation ? "Yes" : profile.hasPhysicalLocation === false ? "No" : "Not specified"}
- Online operations: ${profile.hasOnlineOperations ? "Yes" : profile.hasOnlineOperations === false ? "No" : "Not specified"}
- Customers visit location: ${profile.hasCustomerLocation ? "Yes" : profile.hasCustomerLocation === false ? "No" : "Not specified"}

Respond with ONLY a valid JSON array, no markdown, no extra text. Example: [{"title": "...", "description": "...", "explanation": "...", "priority": "high", "reason": "..."}]`,
      }),
    });
    const json = await res.json();
    if (!json.success || !json.data?.content) return [];

    const content = json.data.content.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsed = JSON.parse(content);
    if (!Array.isArray(parsed)) return [];

    return parsed.slice(0, 3).map((item: any, i: number) => ({
      id: `sug-ai-${i}`,
      title: item.title || "Compliance Task",
      description: item.description || "",
      explanation: item.explanation || "",
      priority: ["low", "medium", "high", "critical"].includes(item.priority) ? item.priority : "medium",
      reason: item.reason || "",
    }));
  } catch {
    return [];
  }
}

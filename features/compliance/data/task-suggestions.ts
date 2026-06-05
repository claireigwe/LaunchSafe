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

export function generateTaskSuggestions(profile: BusinessProfile | null): SuggestedTask[] {
  if (!profile) return [];

  const suggestions: SuggestedTask[] = [];
  const push = (s: SuggestedTask) => suggestions.push(s);

  if (profile.isRegistered || profile.hasCAC) {
    push({
      id: "sug-cac-annual",
      title: "CAC Annual Return Filing",
      description: "File annual returns with the Corporate Affairs Commission.",
      explanation: "Your business profile indicates a registered business entity that may require annual filing obligations.",
      priority: "high",
      reason: "Registered businesses must file annual returns with CAC to maintain good standing.",
    });
  }

  if (profile.employeeCount && profile.employeeCount !== "1") {
    push({
      id: "sug-paye",
      title: "PAYE Tax Registration",
      description: "Register for Pay-As-You-Earn (PAYE) tax with state revenue service.",
      explanation: "Your business has employees, which may require PAYE tax registration and monthly remittances.",
      priority: "high",
      reason: "Employers must deduct and remit PAYE tax to the relevant state tax authority.",
    });

    push({
      id: "sug-pension",
      title: "Employee Pension Registration",
      description: "Register with PenCom and set up pension contributions for employees.",
      explanation: "Businesses with employees are required to register for the contributory pension scheme.",
      priority: "medium",
      reason: "Employers must contribute to employees' retirement savings accounts monthly.",
    });
  }

  if (profile.industry === "food-beverage") {
    push({
      id: "sug-nafdac-food",
      title: "Food Safety Certification (NAFDAC)",
      description: "Register food products with NAFDAC for safety certification.",
      explanation: "Your industry may require food product registration and safety certification before sale.",
      priority: "high",
      reason: "Food and beverage businesses require NAFDAC certification for products sold to the public.",
    });
  }

  if (profile.industry === "health-pharma") {
    push({
      id: "sug-nafdac-pharma",
      title: "Product Registration (NAFDAC)",
      description: "Register health and pharmaceutical products with NAFDAC.",
      explanation: "Health and pharmaceutical products require regulatory approval before distribution.",
      priority: "high",
      reason: "Health products must be registered with NAFDAC for safety and efficacy compliance.",
    });
  }

  if (profile.hasPhysicalLocation) {
    push({
      id: "sug-premises-permit",
      title: "Business Premises Permit",
      description: "Obtain premises permit from local government authority.",
      explanation: "Businesses operating from physical locations may require a premises permit.",
      priority: "medium",
      reason: "Most local government authorities require permits for business premises.",
    });
  }

  if (profile.hasOnlineOperations) {
    push({
      id: "sug-data-protection",
      title: "Data Protection Compliance",
      description: "Register with the Nigeria Data Protection Commission (NDPC).",
      explanation: "Online operations involving customer data may trigger data protection obligations.",
      priority: "medium",
      reason: "Businesses processing personal data must comply with data protection regulations.",
    });
  }

  if (profile.industry === "finance-fintech") {
    push({
      id: "sug-cbn-license",
      title: "Financial Services License (CBN)",
      description: "Obtain financial services license from the Central Bank of Nigeria.",
      explanation: "Financial services and fintech businesses require regulatory licensing from CBN.",
      priority: "critical",
      reason: "Operating financial services without a CBN license is a regulatory violation.",
    });
  }

  if (profile.employeeCount === "51-200" || profile.employeeCount === "201+") {
    push({
      id: "sug-industry-union",
      title: "Industrial Relations Compliance",
      description: "Register with relevant trade unions and comply with labour regulations.",
      explanation: "Larger workforces may have additional industrial relations compliance obligations.",
      priority: "medium",
      reason: "Businesses with significant employee counts have additional labour law obligations.",
    });
  }

  return suggestions;
}

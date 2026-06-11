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

  // === UNIVERSAL TASKS (apply to every business) ===

  if (!profile.isRegistered && !profile.hasCAC) {
    push({
      id: "sug-business-registration",
      title: "Business Registration with CAC",
      description: "Register your business with the Corporate Affairs Commission (CAC).",
      explanation: "Every formal business entity in Nigeria must be registered with the CAC.",
      priority: "critical",
      reason: "All businesses require CAC registration to operate legally as a formal entity.",
    });
  }

  push({
    id: "sug-tin-registration",
    title: "Tax Identification Number (TIN)",
    description: "Register for a Tax Identification Number with the Federal Inland Revenue Service (FIRS).",
    explanation: "All businesses operating in Nigeria need a TIN for tax purposes.",
    priority: "high",
    reason: "A TIN is required for all tax filings, bank account opening, and government transactions.",
  });

  push({
    id: "sug-vat-registration",
    title: "VAT Registration and Filing",
    description: "Register for Value Added Tax with FIRS if your annual turnover exceeds NGN 25 million.",
    explanation: "Businesses above the VAT threshold must register and file monthly returns.",
    priority: "medium",
    reason: "VAT-registered businesses must charge 7.5% VAT and file monthly returns.",
  });

  push({
    id: "sug-company-income-tax",
    title: "Company Income Tax Filing",
    description: "File annual Company Income Tax returns with FIRS.",
    explanation: "All registered companies must file annual CIT returns regardless of profitability.",
    priority: "high",
    reason: "Failure to file CIT returns can result in penalties and interest charges.",
  });

  push({
    id: "sug-business-bank-account",
    title: "Business Bank Account",
    description: "Open a dedicated business bank account for your company.",
    explanation: "Separating business and personal finances is essential for compliance and accounting.",
    priority: "medium",
    reason: "A business bank account is required for tax compliance and financial record-keeping.",
  });

  // === TASKS FOR REGISTERED BUSINESSES ===

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

  // === EMPLOYEE-RELATED TASKS ===

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
      priority: "high",
      reason: "Employers must contribute 10% of employee monthly salary to a Pension Fund Administrator.",
    });

    push({
      id: "sug-nsitf",
      title: "NSITF Employee Compensation",
      description: "Register with the Nigeria Social Insurance Trust Fund (NSITF).",
      explanation: "All employers must register for the Employee Compensation Scheme.",
      priority: "medium",
      reason: "NSITF registration is mandatory for all businesses with employees.",
    });

    push({
      id: "sug-itf",
      title: "ITF Skills Development Levy",
      description: "Register with the Industrial Training Fund (ITF) and remit 1% of annual payroll.",
      explanation: "Businesses with 5 or more employees must contribute to the ITF.",
      priority: "medium",
      reason: "ITF contributions fund workforce training and development programs.",
    });
  }

  // === PHYSICAL LOCATION TASKS ===

  if (profile.hasPhysicalLocation) {
    push({
      id: "sug-premises-permit",
      title: "Business Premises Permit",
      description: "Obtain premises permit from local government or state authority.",
      explanation: "Businesses operating from physical locations may require a premises permit.",
      priority: "medium",
      reason: "Most local government authorities require permits for business premises.",
    });

    push({
      id: "sug-fire-safety",
      title: "Fire Safety Compliance",
      description: "Obtain fire safety certificate from the state fire service.",
      explanation: "Physical business locations may require fire safety inspections and certification.",
      priority: "medium",
      reason: "Fire safety compliance is mandatory for commercial premises in most states.",
    });
  }

  // === ONLINE OPERATIONS TASKS ===

  if (profile.hasOnlineOperations) {
    push({
      id: "sug-data-protection",
      title: "Data Protection Compliance (NDPC)",
      description: "Register with the Nigeria Data Protection Commission (NDPC).",
      explanation: "Online operations involving customer data may trigger data protection obligations.",
      priority: "high",
      reason: "Businesses processing personal data must register with NDPC and comply with the Data Protection Act.",
    });

    push({
      id: "sug-ecommerce-registration",
      title: "E-Commerce Registration",
      description: "Register your online business with relevant state authorities.",
      explanation: "E-commerce businesses may require specific registrations depending on location.",
      priority: "medium",
      reason: "Some states require separate registration for online businesses.",
    });
  }

  // === INDUSTRY-SPECIFIC TASKS ===

  const industryTasks: Record<string, SuggestedTask[]> = {
    "food-beverage": [
      {
        id: "sug-nafdac-food",
        title: "Food Safety Certification (NAFDAC)",
        description: "Register food products with NAFDAC for safety certification.",
        explanation: "Your industry requires food product registration and safety certification before sale.",
        priority: "critical",
        reason: "Food and beverage businesses must obtain NAFDAC certification for all products.",
      },
      {
        id: "sug-nafdac-manufacturing",
        title: "NAFDAC Manufacturing License",
        description: "Obtain a NAFDAC manufacturing license for your production facility.",
        explanation: "Food production facilities require NAFDAC inspection and licensing.",
        priority: "high",
        reason: "Manufacturing food products without a NAFDAC license is illegal.",
      },
    ],
    "fashion-apparel": [
      {
        id: "sug-nafdac-textile",
        title: "NAFDAC Textile Product Registration",
        description: "Register textile and apparel products with NAFDAC if they contact skin.",
        explanation: "Clothing and textile products that come into direct contact with skin may require NAFDAC registration.",
        priority: "medium",
        reason: "Textile products may require NAFDAC clearance for safety compliance.",
      },
      {
        id: "sug-son-textile",
        title: "SON Textile Standards Compliance",
        description: "Ensure textile products meet Nigerian Industrial Standards (NIS).",
        explanation: "Textile products sold in Nigeria must meet SON quality standards.",
        priority: "medium",
        reason: "SON certification ensures product quality and safety for consumers.",
      },
    ],
    "technology": [
      {
        id: "sug-tech-ndpc",
        title: "NDPR Compliance for Tech Platforms",
        description: "Register with NDPC and implement data protection measures.",
        explanation: "Technology platforms handling user data must comply with data protection regulations.",
        priority: "critical",
        reason: "Data breaches can result in significant penalties under the Data Protection Act.",
      },
      {
        id: "sug-tech-software-license",
        title: "Software Licensing Compliance",
        description: "Ensure all software and tools used in your business are properly licensed.",
        explanation: "Technology businesses must maintain proper software licensing.",
        priority: "medium",
        reason: "Using unlicensed software can result in legal and financial penalties.",
      },
    ],
    "agriculture": [
      {
        id: "sug-agric-nafdac",
        title: "NAFDAC Agricultural Product Registration",
        description: "Register agricultural products with NAFDAC for processing and sale.",
        explanation: "Processed agricultural products may require NAFDAC registration.",
        priority: "high",
        reason: "Agricultural products for human consumption need regulatory approval.",
      },
      {
        id: "sug-agric-export",
        title: "Agricultural Export Permits",
        description: "Obtain necessary permits for exporting agricultural products.",
        explanation: "Exporting agricultural goods may require NESREA and NCS clearance.",
        priority: "medium",
        reason: "Agricultural exports require compliance with international standards.",
      },
    ],
    "manufacturing": [
      {
        id: "sug-manufacturing-nafdac",
        title: "NAFDAC Product Registration",
        description: "Register manufactured products with NAFDAC where applicable.",
        explanation: "Manufactured products for human consumption or use may require NAFDAC registration.",
        priority: "high",
        reason: "Regulatory approval is needed before manufactured goods can be sold.",
      },
      {
        id: "sug-manufacturing-son",
        title: "SON Standards Certification",
        description: "Ensure manufactured products meet SON Nigerian Industrial Standards.",
        explanation: "Manufactured goods sold in Nigeria must meet SON quality standards.",
        priority: "high",
        reason: "SON certification is mandatory for most manufactured products.",
      },
      {
        id: "sug-manufacturing-nesrea",
        title: "NESREA Environmental Compliance",
        description: "Register with NESREA for environmental impact assessment and compliance.",
        explanation: "Manufacturing facilities require environmental permits and regular inspections.",
        priority: "medium",
        reason: "Manufacturing operations must comply with environmental regulations.",
      },
    ],
    "retail-ecommerce": [
      {
        id: "sug-retail-son",
        title: "SON Product Certification",
        description: "Ensure all products meet SON standards for market access.",
        explanation: "Products sold in Nigeria must meet SON quality and safety standards.",
        priority: "high",
        reason: "Uncertified products can be seized by regulatory authorities.",
      },
      {
        id: "sug-retail-customs",
        title: "Customs Clearance for Imports",
        description: "Clear imported goods through the Nigeria Customs Service.",
        explanation: "Retail businesses that import goods must clear them through customs.",
        priority: "high",
        reason: "Importing without proper customs clearance can result in seizure and penalties.",
      },
    ],
    "healthcare": [
      {
        id: "sug-health-nafdac",
        title: "NAFDAC Product Registration",
        description: "Register healthcare products and drugs with NAFDAC.",
        explanation: "All healthcare products require NAFDAC registration before distribution.",
        priority: "critical",
        reason: "Unregistered healthcare products cannot be legally sold or distributed.",
      },
      {
        id: "sug-health-facility",
        title: "Healthcare Facility License",
        description: "Obtain license from state ministry of health to operate a healthcare facility.",
        explanation: "Healthcare facilities require state-level licensing and regular inspections.",
        priority: "critical",
        reason: "Operating a healthcare facility without a license is illegal.",
      },
    ],
    "financial-services": [
      {
        id: "sug-finance-cbn",
        title: "CBN Financial Services License",
        description: "Obtain regulatory license from the Central Bank of Nigeria.",
        explanation: "Financial services businesses require licensing from CBN or relevant regulatory body.",
        priority: "critical",
        reason: "Operating financial services without CBN approval is a serious regulatory violation.",
      },
      {
        id: "sug-finance-aml",
        title: "Anti-Money Laundering (AML) Compliance",
        description: "Implement AML policies and register with the Special Control Unit against Money Laundering.",
        explanation: "Financial institutions must comply with AML regulations and report suspicious transactions.",
        priority: "high",
        reason: "AML compliance is mandatory for all financial services businesses.",
      },
    ],
  };

  const tasks = industryTasks[profile.industry];
  if (tasks) {
    for (const task of tasks) {
      push(task);
    }
  }

  // === SIZE-BASED TASKS ===

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

  // === GENERAL COMPLIANCE TASKS ===

  push({
    id: "sug-record-keeping",
    title: "Financial Record Keeping",
    description: "Maintain proper financial records and accounting books for your business.",
    explanation: "All businesses are required to keep accurate financial records for tax and regulatory purposes.",
    priority: "medium",
    reason: "Proper record-keeping is essential for tax filings and regulatory compliance.",
  });

  return suggestions;
}

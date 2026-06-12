-- 20_document_templates.sql
-- Template library for AI-powered document generation.
-- Each template maps to a document type the frontend understands.

CREATE TABLE IF NOT EXISTS public.document_templates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  description     TEXT NOT NULL,
  category        TEXT NOT NULL
                    CHECK (category IN (
                      'application', 'compliance', 'privacy', 'hr', 'industry'
                    )),
  industry_slug   TEXT,                           -- null = general-purpose
  doc_type        TEXT NOT NULL,
  prompt_template TEXT NOT NULL,                   -- AI generation prompt
  sort_order      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================
-- SEED DATA
-- ========================

-- Application Templates
INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'application-cover-letter', 'Cover Letter for Regulatory Submission',
  'A professional cover letter to accompany permit, license, or registration applications submitted to regulatory agencies.',
  'application', 'other',
  'Write a formal cover letter addressed to the relevant regulatory agency. Include: applicant business name, type of application being submitted, list of enclosed documents, and a professional closing. Tone should be formal and respectful.',
  1
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'application-cover-letter');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'application-request-letter', 'Formal Request Letter to Agency',
  'A formal letter requesting information, clearance, or confirmation from a government or regulatory agency.',
  'application', 'other',
  'Write a formal request letter to a regulatory agency. Include: business name, registration details, specific information or approval being requested, reason for the request, and contact information.',
  2
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'application-request-letter');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'application-declaration', 'Statutory Declaration / Declaration Letter',
  'A sworn declaration or solemn affirmation for regulatory compliance purposes, such as confirming business details or compliance status.',
  'application', 'declaration',
  'Write a statutory declaration or formal declaration letter. Include: full name and position of declarant, business name, registration number, the facts being declared, and a statement confirming the truth of the declaration.',
  3
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'application-declaration');

-- Compliance Templates
INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'compliance-plan', 'Compliance Action Plan',
  'A structured compliance action plan outlining regulatory obligations, deadlines, responsible parties, and status tracking for business compliance activities.',
  'compliance', 'compliance_certificate',
  'Create a compliance action plan for the business. Include: list of regulatory requirements, deadlines for each, responsible persons or departments, current status, and next steps. Format as a structured table with clear action items.',
  10
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'compliance-plan');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'compliance-checklist', 'Compliance Submission Checklist',
  'A comprehensive checklist of documents and requirements needed for regulatory submissions, permits, and license applications.',
  'compliance', 'checklist',
  'Generate a compliance submission checklist. Include: all required documents, forms, fees, and supporting materials needed for regulatory applications. Group by agency and mark items as required or optional.',
  11
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'compliance-checklist');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'compliance-launch-checklist', 'Business Launch Compliance Checklist',
  'A pre-launch compliance checklist covering every regulatory requirement that must be satisfied before commencing business operations.',
  'compliance', 'checklist',
  'Create a business launch compliance checklist. Cover: business registration, tax registration, permits, licenses, insurance, employee registrations, and industry-specific requirements. Order by urgency.',
  12
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'compliance-launch-checklist');

-- Privacy Templates
INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'privacy-policy', 'Data Protection Policy',
  'A comprehensive data protection and privacy policy document compliant with the Nigeria Data Protection Act 2023 and NDPC regulations.',
  'privacy', 'policy_document',
  'Write a data protection policy for a Nigerian business. Cover: types of personal data collected, purpose of collection, lawful basis for processing, data subject rights, data retention periods, security measures, and breach notification procedures. Reference NDPC requirements.',
  20
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'privacy-policy');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'privacy-notice-employee', 'Employee Privacy Notice',
  'A privacy notice for employees explaining how their personal data is collected, processed, and protected by the employer.',
  'privacy', 'policy_document',
  'Write an employee privacy notice. Include: what employee data is collected, purpose of processing, legal basis, data retention, employee rights, and contact information for the Data Protection Officer. Compliant with NDPR.',
  21
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'privacy-notice-employee');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'privacy-cookie-policy', 'Cookie Policy for Website',
  'A cookie policy explaining how cookies and similar tracking technologies are used on the business website or platform.',
  'privacy', 'policy_document',
  'Write a cookie policy for a business website. Explain: what cookies are, types of cookies used (essential, functional, analytics, marketing), purpose of each cookie, how users can control cookie preferences, and data collected through cookies.',
  22
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'privacy-cookie-policy');

-- HR Compliance Templates
INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'hr-employee-acknowledgment', 'Employee Acknowledgment Form',
  'An acknowledgment form for employees to confirm receipt and understanding of company policies, compliance obligations, and code of conduct.',
  'hr', 'employee_record',
  'Create an employee acknowledgment form. Include: employee name, position, list of policies and documents being acknowledged, confirmation statement, signature block, and date. The employee confirms they have read and understood the policies.',
  30
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'hr-employee-acknowledgment');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'hr-compliance-record', 'Internal Compliance Record',
  'An internal record used to document compliance activities, training completion, policy acknowledgments, and regulatory interactions.',
  'hr', 'employee_record',
  'Create an internal compliance record template. Include: business name, compliance activity description, date performed, responsible person, evidence reference, status, and reviewer notes. Suitable for audit trails.',
  31
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'hr-compliance-record');

INSERT INTO public.document_templates (slug, name, description, category, doc_type, prompt_template, sort_order)
SELECT 'hr-pension-enrollment', 'Pension Enrollment Form',
  'An employer pension enrollment form for registering employees with a Pension Fund Administrator (PFA) as required by PenCom.',
  'hr', 'employee_record',
  'Create a pension enrollment form. Include: employee personal details, employee and employer contribution rates, PFA selection, nominee details, and declaration. Reference PenCom contribution requirements.',
  32
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'hr-pension-enrollment');

-- Industry-Specific Templates
INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-food-nafdac-cover', 'NAFDAC Product Registration Cover Letter',
  'A cover letter specifically for submitting NAFDAC product registration applications for food and beverage products.',
  'industry', 'food-beverage', 'other',
  'Write a cover letter for NAFDAC product registration application. Include: manufacturer name and address, product name and description, list of supporting documents attached (lab analysis, manufacturing license, label approval), and signature of authorized representative.',
  40
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-food-nafdac-cover');

INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-pharma-pcn-license', 'PCN License Application Letter',
  'A formal application letter for obtaining a pharmacy license from the Pharmacists Council of Nigeria (PCN).',
  'industry', 'health-pharma', 'other',
  'Write a formal application letter to the Pharmacists Council of Nigeria for a pharmacy license. Include: applicant details, premises address, supervising pharmacist information, list of attached documents, and declaration of compliance with PCN standards.',
  41
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-pharma-pcn-license');

INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-fintech-aml-policy', 'Anti-Money Laundering (AML) Policy',
  'An AML compliance policy for fintech and financial services businesses, covering KYC requirements, transaction monitoring, and reporting obligations.',
  'industry', 'finance-fintech', 'policy_document',
  'Write an Anti-Money Laundering policy for a Nigerian fintech business. Cover: customer due diligence (CDD/KYC), transaction monitoring thresholds, suspicious transaction reporting to NFIU, record keeping, employee training, and risk assessment procedures.',
  42
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-fintech-aml-policy');

INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-manufacturing-soncap', 'SONCAP Certification Application',
  'An application letter for SONCAP certification, required for manufacturers exporting regulated products to Nigeria.',
  'industry', 'manufacturing', 'other',
  'Write a SONCAP certification application letter. Include: manufacturer details, product description, HS code, factory inspection status, test report references, and declaration of conformity to applicable Nigerian Industrial Standards.',
  43
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-manufacturing-soncap');

INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-tech-data-audit', 'Data Protection Audit Report',
  'An internal data protection audit report template for technology and SaaS businesses to assess NDPC compliance.',
  'industry', 'technology-saas', 'report',
  'Create a data protection audit report. Cover: data inventory, processing activities, consent mechanisms, data subject request handling, security measures, third-party processor agreements, and compliance gaps. Reference NDPC requirements.',
  44
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-tech-data-audit');

INSERT INTO public.document_templates (slug, name, description, category, industry_slug, doc_type, prompt_template, sort_order)
SELECT 'industry-retail-trade-license', 'Trade License Application',
  'An application for a trade license or business premises permit from the local government authority for retail and e-commerce businesses.',
  'industry', 'retail-ecommerce', 'other',
  'Write a trade license application letter to the local government authority. Include: business name and address, type of trade or commerce, premises details, ownership information, and list of attached supporting documents.',
  45
WHERE NOT EXISTS (SELECT 1 FROM public.document_templates WHERE slug = 'industry-retail-trade-license');

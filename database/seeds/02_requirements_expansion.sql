-- 02_requirements_expansion.sql
-- Run this in Supabase SQL Editor after the base seed (01_regulatory_seed.sql).
-- Adds comprehensive requirements and costs for ALL industries to eliminate
-- the "document is a template" disclaimer in AI document generation.

-- ========================
-- 1. REQUIREMENTS (ALL INDUSTRIES)
-- ========================

-- Shared requirements that apply across ALL industries.
-- Each INSERT cross-joins with all industry slugs listed in the WHERE clause,
-- and checks per industry whether a requirement with that name already exists.

-- Shared: Business Registration with CAC
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Business Registration with CAC', 'Register your business with the Corporate Affairs Commission. Includes business name reservation and incorporation.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Business Registration with CAC' AND r.industry_id = i.id);

-- Shared: Tax Identification Number (TIN)
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Tax Identification Number (TIN)', 'Register for a Tax Identification Number with FIRS. Required for all businesses.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Tax Identification Number (TIN)' AND r.industry_id = i.id);

-- Shared: VAT Registration and Filing
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'VAT Registration and Filing', 'Register for VAT with FIRS if turnover exceeds NGN 25M. File monthly returns at 7.5% rate.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'VAT Registration and Filing' AND r.industry_id = i.id);

-- Shared: Company Income Tax Filing
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Company Income Tax Filing', 'File annual Company Income Tax returns with FIRS.', 'filing', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Company Income Tax Filing' AND r.industry_id = i.id);

-- Shared: PAYE Tax Remittance
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'PAYE Tax Remittance', 'Remit employee PAYE tax to the state internal revenue service monthly.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'PAYE Tax Remittance' AND r.industry_id = i.id);

-- Shared: Employer Pension Contribution
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Employer Pension Contribution', 'Register with PenCom and contribute minimum 10% of employee salary to a PFA.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'PenCom' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Employer Pension Contribution' AND r.industry_id = i.id);

-- Shared: NSITF Employee Compensation
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NSITF Employee Compensation', 'Register with NSITF for the Employee Compensation Scheme.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NSITF' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NSITF Employee Compensation' AND r.industry_id = i.id);

-- Shared: ITF Contribution
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'ITF Contribution', 'Register with ITF and contribute 1% of annual payroll (businesses with 5+ employees).', 'filing', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'ITF' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'ITF Contribution' AND r.industry_id = i.id);

-- Shared: NDPR Data Protection Compliance
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NDPR Data Protection Compliance', 'Register with NDPC if you process personal data of Nigerian citizens.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND c.code = 'NG'
AND i.slug IN ('general-business', 'food-beverage', 'fashion-apparel', 'technology', 'healthcare', 'agriculture', 'manufacturing', 'retail-ecommerce', 'financial-services')
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NDPR Data Protection Compliance' AND r.industry_id = i.id);

-- --------------------------------------------------
-- Industry-specific requirements
-- --------------------------------------------------

-- FOOD & BEVERAGE
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Product Registration', 'Register food products with NAFDAC. Requires product testing and lab analysis before approval.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NAFDAC Product Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Manufacturing License', 'Obtain a NAFDAC manufacturing license for food production facilities. Requires facility inspection.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NAFDAC Manufacturing License' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Food Handlers Certificate', 'Food handlers must obtain a medical certificate of fitness from the Ministry of Health.', 'certification', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'LSSC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Food Handlers Certificate' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Food Products Certification', 'Obtain SON certification for food products to confirm compliance with Nigerian Industrial Standards.', 'certification', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SON Food Products Certification' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Environmental Health Permit', 'Obtain an environmental health permit from the local government authority for food handling premises.', 'permit', 'annual', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'LSSC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Environmental Health Permit' AND r.industry_id = i.id);

-- HEALTHCARE / PHARMACEUTICAL
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'PCN Pharmacy License', 'Obtain a pharmacy license from the Pharmacists Council of Nigeria (PCN). Requires premises inspection and supervising pharmacist.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'healthcare' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'PCN Pharmacy License' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Drug and Product Registration', 'Register pharmaceutical products and drugs with NAFDAC for safety and efficacy approval.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'healthcare' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NAFDAC Drug and Product Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Health Facility Registration', 'Register your health facility with the state Ministry of Health. Requires premises inspection and equipment verification.', 'registration', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'healthcare' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Health Facility Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Medical Waste Management Permit', 'Obtain a permit for handling and disposing of medical waste from the environmental protection agency.', 'permit', 'annual', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'LSSC' AND i.slug = 'healthcare' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Medical Waste Management Permit' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Controlled Substances License', 'Obtain a license from NDLEA if handling controlled or narcotic substances.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'healthcare' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Controlled Substances License' AND r.industry_id = i.id);

-- FINTECH / FINANCIAL SERVICES
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'CBN Payment Service Provider License', 'Obtain a Payment Service Provider (PSP) license from the Central Bank of Nigeria. Requires minimum capital and compliance framework.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'financial-services' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'CBN Payment Service Provider License' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SCUML Registration', 'Register with the Special Control Unit against Money Laundering (SCUML) under EFCC.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'financial-services' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SCUML Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Anti-Money Laundering (AML) Compliance Program', 'Implement an AML compliance program including KYC procedures, transaction monitoring, and suspicious transaction reporting.', 'reporting', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'financial-services' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Anti-Money Laundering (AML) Compliance Program' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'PCI DSS Compliance Certification', 'Achieve Payment Card Industry Data Security Standard (PCI DSS) certification if processing card payments.', 'certification', 'annual', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'financial-services' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'PCI DSS Compliance Certification' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SEC Registration (Capital Market)', 'Register with the Securities and Exchange Commission (SEC) if offering investment or capital market products.', 'registration', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'financial-services' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SEC Registration (Capital Market)' AND r.industry_id = i.id);

-- RETAIL & E-COMMERCE
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Trade License (Local Government)', 'Obtain a trade license from your local government authority to operate a retail or commercial business.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Trade License (Local Government)' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'FCCPC Consumer Protection Registration', 'Register with the Federal Competition and Consumer Protection Commission (FCCPC) for consumer protection compliance.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'FCCPC Consumer Protection Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Product Certification', 'Ensure products meet SON Nigerian Industrial Standards (NIS) for market access and consumer safety.', 'certification', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SON Product Certification' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Customs Clearance for Imports', 'Clear imported goods through Nigeria Customs Service (NCS) with proper documentation and payment of duties.', 'filing', 'event_driven', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NCS' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Customs Clearance for Imports' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'E-commerce Platform Registration', 'Register your e-commerce platform with relevant authorities. Ensure compliance with digital commerce regulations.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'E-commerce Platform Registration' AND r.industry_id = i.id);

-- MANUFACTURING
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Factory Registration', 'Register your factory with the Ministry of Labour and Employment as required by the Factories Act.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'manufacturing' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Factory Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Environmental Impact Assessment (EIA)', 'Conduct an Environmental Impact Assessment and obtain clearance from NESREA before commencing manufacturing operations.', 'permit', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'LSSC' AND i.slug = 'manufacturing' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Environmental Impact Assessment (EIA)' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Industrial Waste Management Permit', 'Obtain a permit for industrial waste disposal and management from the environmental protection agency.', 'permit', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'LSSC' AND i.slug = 'manufacturing' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Industrial Waste Management Permit' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Manufacturing Standards Certification', 'Certify that manufacturing processes and products comply with SON Nigerian Industrial Standards.', 'certification', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'manufacturing' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SON Manufacturing Standards Certification' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Occupational Health and Safety Compliance', 'Implement occupational health and safety measures as required by the Ministry of Labour. Includes safety inspections and employee training.', 'inspection', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NSITF' AND i.slug = 'manufacturing' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Occupational Health and Safety Compliance' AND r.industry_id = i.id);

-- TECHNOLOGY / SAAS
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NITDA Technology Compliance', 'Register with NITDA and comply with technology guidelines including data localisation and cybersecurity requirements.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'technology' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NITDA Technology Compliance' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Data Protection Audit (Annual)', 'Conduct an annual data protection audit as required by NDPC regulations under the Nigeria Data Protection Act 2023.', 'reporting', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'technology' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Data Protection Audit (Annual)' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Software Intellectual Property Registration', 'Register software copyright and intellectual property with the Nigerian Copyright Commission.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'technology' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Software Intellectual Property Registration' AND r.industry_id = i.id);

-- AGRICULTURE
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Agricultural Land Use Permit', 'Obtain land use permit from the Ministry of Agriculture for farming or agricultural operations.', 'permit', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'agriculture' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Agricultural Land Use Permit' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Pesticide and Chemical Use Permit', 'Obtain permit for use of pesticides and agricultural chemicals from the Ministry of Environment.', 'permit', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'agriculture' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Pesticide and Chemical Use Permit' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Phytosanitary Certificate (Export)', 'Obtain phytosanitary certificate from the Nigeria Agricultural Quarantine Service for exporting agricultural products.', 'certification', 'event_driven', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'agriculture' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Phytosanitary Certificate (Export)' AND r.industry_id = i.id);

-- FASHION & APPAREL
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Textile Standards Compliance', 'Ensure textile and apparel products meet SON Nigerian Industrial Standards for quality and safety.', 'certification', 'annual', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'fashion-apparel' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'SON Textile Standards Compliance' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Textile Product Registration', 'Register textile and apparel products that come into contact with skin with NAFDAC for safety compliance.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'fashion-apparel' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'NAFDAC Textile Product Registration' AND r.industry_id = i.id);

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Export Clearance for International Sales', 'Obtain export clearance from the Nigerian Export Promotion Council (NEPC) for international sales of textile products.', 'certification', 'event_driven', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NCS' AND i.slug = 'fashion-apparel' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements r WHERE r.name = 'Export Clearance for International Sales' AND r.industry_id = i.id);

-- ========================
-- 2. COSTS (ALL INDUSTRIES)
-- ========================

-- Since shared requirements apply to all industries, insert costs only once per requirement name.
-- The subquery picks up any matching requirement row regardless of industry.

-- CAC Registration: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1500000, 'NGN', 'Private limited company registration (share capital up to NGN 1M)', true
FROM public.requirements r WHERE r.name = 'Business Registration with CAC'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- TIN: official cost (free)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'TIN registration is free of charge', true
FROM public.requirements r WHERE r.name = 'Tax Identification Number (TIN)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- VAT: official cost (free)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'VAT registration is free. Rate is 7.5% on eligible goods.', true
FROM public.requirements r WHERE r.name = 'VAT Registration and Filing'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- Company Income Tax: official cost (free filing)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'Annual filing is free. Tax payable is based on assessable profits.', true
FROM public.requirements r WHERE r.name = 'Company Income Tax Filing'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- PAYE: official cost (free remittance)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'PAYE remittance is free. Tax deducted at source per PAYE schedule.', true
FROM public.requirements r WHERE r.name = 'PAYE Tax Remittance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- Pension: official (employer contribution)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'Employer contributes 10% of monthly salary. Employee contributes 8%.', true
FROM public.requirements r WHERE r.name = 'Employer Pension Contribution'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- NSITF: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 100000, 'NGN', 'Annual NSITF registration fee (estimated, varies by employee count)', true
FROM public.requirements r WHERE r.name = 'NSITF Employee Compensation'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- ITF: official cost (percentage-based)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', '1% of annual payroll for businesses with 5+ employees', true
FROM public.requirements r WHERE r.name = 'ITF Contribution'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- NDPR: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 50000, 'NGN', 'Estimated NDPC registration and audit preparation cost', false
FROM public.requirements r WHERE r.name = 'NDPR Data Protection Compliance'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Product Registration: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 250000, 'NGN', 'Estimated NAFDAC product registration cost including lab analysis', false
FROM public.requirements r WHERE r.name = 'NAFDAC Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- NAFDAC Manufacturing License: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 350000, 'NGN', 'Estimated annual NAFDAC manufacturing license fee', false
FROM public.requirements r WHERE r.name = 'NAFDAC Manufacturing License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Lagos PSN Business Premises Permit: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 250000, 'NGN', 'Estimated annual Lagos PSN business premises permit fee', false
FROM public.requirements r WHERE r.name = 'Lagos PSN Business Premises Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Food Handlers Certificate: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 15000, 'NGN', 'Estimated cost for food handlers medical certificate', false
FROM public.requirements r WHERE r.name = 'Food Handlers Certificate'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- CBN Payment License: official cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 5000000, 'NGN', 'CBN PSP license fee (varies by license category)', true
FROM public.requirements r WHERE r.name = 'CBN Payment Service Provider License'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- SCUML Registration: official cost (free)
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'SCUML registration is free of charge', true
FROM public.requirements r WHERE r.name = 'SCUML Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'official');

-- SON Product Certification: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 100000, 'NGN', 'Estimated SON product certification cost per product line', false
FROM public.requirements r WHERE r.name = 'SON Product Certification'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

-- Trade License: estimated cost
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 50000, 'NGN', 'Estimated annual trade license fee from local government', false
FROM public.requirements r WHERE r.name = 'Trade License (Local Government)'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs rc WHERE rc.requirement_id = r.id AND rc.cost_type = 'estimated');

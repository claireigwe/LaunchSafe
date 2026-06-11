-- Regulatory Knowledge Seed Data
-- Run each section separately in Supabase SQL Editor
-- Uses subqueries to resolve foreign key IDs

-- ========================
-- 1. COUNTRIES
-- ========================
INSERT INTO public.countries (name, code, currency_code)
SELECT 'Nigeria', 'NG', 'NGN'
WHERE NOT EXISTS (SELECT 1 FROM public.countries WHERE code = 'NG');

-- ========================
-- 2. AGENCIES
-- ========================
INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Corporate Affairs Commission', 'CAC', 'Business registration and regulation in Nigeria'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'CAC');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Federal Inland Revenue Service', 'FIRS', 'Federal tax authority'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'FIRS');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Lagos State Internal Revenue Service', 'LIRS', 'Lagos State tax authority'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'LIRS');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'National Agency for Food and Drug Administration and Control', 'NAFDAC', 'Regulates food, drugs, and cosmetics'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'NAFDAC');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Standard Organisation of Nigeria', 'SON', 'Product standards and certification'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'SON');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'National Pension Commission', 'PenCom', 'Pension administration oversight'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'PenCom');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Nigeria Social Insurance Trust Fund', 'NSITF', 'Employee Compensation Scheme'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'NSITF');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Industrial Training Fund', 'ITF', 'Skills development'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'ITF');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Nigeria Data Protection Commission', 'NDPC', 'Data protection and privacy'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'NDPC');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Lagos State Safety Commission', 'LSSC', 'Public safety compliance'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'LSSC');

INSERT INTO public.agencies (country_id, name, acronym, description)
SELECT c.id, 'Nigeria Customs Service', 'NCS', 'Customs duties and trade facilitation'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.agencies WHERE acronym = 'NCS');

-- ========================
-- 3. STATES
-- ========================
INSERT INTO public.states (country_id, name)
SELECT c.id, 'Lagos'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.states WHERE name = 'Lagos');

INSERT INTO public.states (country_id, name)
SELECT c.id, 'Federal Capital Territory'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.states WHERE name = 'Federal Capital Territory');

INSERT INTO public.states (country_id, name)
SELECT c.id, 'Oyo'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.states WHERE name = 'Oyo');

INSERT INTO public.states (country_id, name)
SELECT c.id, 'Rivers'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.states WHERE name = 'Rivers');

INSERT INTO public.states (country_id, name)
SELECT c.id, 'Kano'
FROM public.countries c WHERE c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.states WHERE name = 'Kano');

-- ========================
-- 4. INDUSTRIES
-- ========================
INSERT INTO public.industries (name, slug)
SELECT 'General Business', 'general-business'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'general-business');

INSERT INTO public.industries (name, slug)
SELECT 'Food & Beverage', 'food-beverage'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'food-beverage');

INSERT INTO public.industries (name, slug)
SELECT 'Fashion & Apparel', 'fashion-apparel'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'fashion-apparel');

INSERT INTO public.industries (name, slug)
SELECT 'Technology', 'technology'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'technology');

INSERT INTO public.industries (name, slug)
SELECT 'Healthcare', 'healthcare'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'healthcare');

INSERT INTO public.industries (name, slug)
SELECT 'Agriculture', 'agriculture'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'agriculture');

INSERT INTO public.industries (name, slug)
SELECT 'Manufacturing', 'manufacturing'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'manufacturing');

INSERT INTO public.industries (name, slug)
SELECT 'Retail & E-commerce', 'retail-ecommerce'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'retail-ecommerce');

INSERT INTO public.industries (name, slug)
SELECT 'Financial Services', 'financial-services'
WHERE NOT EXISTS (SELECT 1 FROM public.industries WHERE slug = 'financial-services');

-- ========================
-- 5. REQUIREMENTS
-- ========================

-- General Business requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Business Registration with CAC', 'Register your business with the Corporate Affairs Commission. Includes business name reservation and incorporation.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'CAC' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Business Registration with CAC');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Tax Identification Number (TIN)', 'Register for a Tax Identification Number with FIRS. Required for all businesses.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Tax Identification Number (TIN)');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'VAT Registration and Filing', 'Register for VAT with FIRS if turnover exceeds NGN 25M. File monthly returns at 7.5% rate.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'VAT Registration and Filing');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Company Income Tax Filing', 'File annual Company Income Tax returns with FIRS.', 'filing', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Company Income Tax Filing');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'PAYE Tax Remittance', 'Remit employee PAYE tax to the state internal revenue service monthly.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'FIRS' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'PAYE Tax Remittance');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Employer Pension Contribution', 'Register with PenCom and contribute minimum 10% of employee salary to a PFA.', 'filing', 'monthly', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'PenCom' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Employer Pension Contribution');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NSITF Employee Compensation', 'Register with NSITF for the Employee Compensation Scheme.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NSITF' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'NSITF Employee Compensation');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'ITF Contribution', 'Register with ITF and contribute 1% of annual payroll (businesses with 5+ employees).', 'filing', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'ITF' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'ITF Contribution');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NDPR Data Protection Compliance', 'Register with NDPC if you process personal data of Nigerian citizens.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'general-business' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'NDPR Data Protection Compliance');

-- Lagos State specific requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, state_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, s.id, 'Lagos PSN Business Premises Permit', 'Apply for a Premises Registration Number from LIRS. Required for all Lagos businesses.', 'permit', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c, public.states s
WHERE a.acronym = 'LIRS' AND i.slug = 'general-business' AND c.code = 'NG' AND s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Lagos PSN Business Premises Permit');

-- Food & Beverage requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Product Registration', 'Register food products with NAFDAC. Requires product testing and lab analysis.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'NAFDAC Product Registration');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Manufacturing License', 'Obtain a NAFDAC manufacturing license. Requires facility inspection.', 'license', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'food-beverage' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'NAFDAC Manufacturing License');

-- Fashion & Apparel requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'NAFDAC Textile Product Registration', 'Register textile and apparel products with NAFDAC if they contact skin.', 'registration', 'one_time', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NAFDAC' AND i.slug = 'fashion-apparel' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'NAFDAC Textile Product Registration');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Textile Standards', 'Ensure textile products meet SON Nigerian Industrial Standards.', 'certification', 'annual', 'active', 'estimated', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'fashion-apparel' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'SON Textile Standards');

-- Technology requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Tech Platform Data Protection', 'Register with NDPC. Mandatory for platforms handling user data.', 'registration', 'one_time', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NDPC' AND i.slug = 'technology' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Tech Platform Data Protection');

-- Retail & E-commerce requirements
INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'SON Product Certification', 'Ensure products meet SON standards for market access.', 'certification', 'annual', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'SON' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'SON Product Certification');

INSERT INTO public.requirements (agency_id, industry_id, country_id, name, description, requirement_type, frequency, status, confidence_level, is_verified)
SELECT a.id, i.id, c.id, 'Customs Clearance for Imports', 'Clear imported goods through Nigeria Customs Service.', 'filing', 'event_driven', 'active', 'verified', true
FROM public.agencies a, public.industries i, public.countries c
WHERE a.acronym = 'NCS' AND i.slug = 'retail-ecommerce' AND c.code = 'NG'
AND NOT EXISTS (SELECT 1 FROM public.requirements WHERE name = 'Customs Clearance for Imports');

-- ========================
-- 6. COSTS
-- ========================
INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 1500000, 'NGN', 'Private limited company registration (share capital up to NGN 1M)', true
FROM public.requirements r WHERE r.name = 'Business Registration with CAC'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs WHERE requirement_id = r.id AND cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'VAT registration is free. Rate is 7.5% on eligible goods.', true
FROM public.requirements r WHERE r.name = 'VAT Registration and Filing'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs WHERE requirement_id = r.id AND cost_type = 'official');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 2500000, 'NGN', 'Estimated annual cost for Lagos PSN permit', false
FROM public.requirements r WHERE r.name = 'Lagos PSN Business Premises Permit'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs WHERE requirement_id = r.id AND cost_type = 'estimated');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'estimated', 3000000, 'NGN', 'Estimated cost for NAFDAC product registration', false
FROM public.requirements r WHERE r.name = 'NAFDAC Product Registration'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs WHERE requirement_id = r.id AND cost_type = 'estimated');

INSERT INTO public.requirement_costs (requirement_id, cost_type, amount, currency, notes, is_verified)
SELECT r.id, 'official', 0, 'NGN', 'Employer contributes 10% of monthly salary. Employee contributes 8%.', true
FROM public.requirements r WHERE r.name = 'Employer Pension Contribution'
AND NOT EXISTS (SELECT 1 FROM public.requirement_costs WHERE requirement_id = r.id AND cost_type = 'official');

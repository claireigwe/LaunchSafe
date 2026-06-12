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
-- 4. LOCAL GOVERNMENT AREAS (LGAs)
-- ========================

-- Lagos State LGAs
INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Alimosho' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Alimosho');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Mushin' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Mushin');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Oshodi-Isolo' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Oshodi-Isolo');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ikorodu' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ikorodu');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Surulere' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Surulere');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Agege' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Agege');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ifako-Ijaiye' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ifako-Ijaiye');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Kosofe' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Kosofe');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Lagos Island' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Lagos Island');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Lagos Mainland' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Lagos Mainland');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Eti-Osa' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Eti-Osa');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Amuwo-Odofin' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Amuwo-Odofin');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Apapa' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Apapa');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Badagry' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Badagry');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Epe' FROM public.states s WHERE s.name = 'Lagos'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Epe');

-- FCT Abuja LGAs
INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Abuja Municipal' FROM public.states s WHERE s.name = 'Federal Capital Territory'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Abuja Municipal');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Bwari' FROM public.states s WHERE s.name = 'Federal Capital Territory'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Bwari');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Gwagwalada' FROM public.states s WHERE s.name = 'Federal Capital Territory'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Gwagwalada');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Kuje' FROM public.states s WHERE s.name = 'Federal Capital Territory'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Kuje');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Kwali' FROM public.states s WHERE s.name = 'Federal Capital Territory'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Kwali');

-- Oyo State LGAs
INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ibadan North' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ibadan North');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ibadan South-West' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ibadan South-West');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ibadan North-West' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ibadan North-West');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Oyo West' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Oyo West');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ogbomoso North' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ogbomoso North');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ibarapa East' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ibarapa East');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Akinyele' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Akinyele');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Egbeda' FROM public.states s WHERE s.name = 'Oyo'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Egbeda');

-- Rivers State LGAs
INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Port Harcourt' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Port Harcourt');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Obio-Akpor' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Obio-Akpor');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Eleme' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Eleme');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Oyigbo' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Oyigbo');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ikwerre' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ikwerre');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Degema' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Degema');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Bonny' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Bonny');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ahoada East' FROM public.states s WHERE s.name = 'Rivers'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ahoada East');

-- Kano State LGAs
INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Kano Municipal' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Kano Municipal');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Fagge' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Fagge');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Dala' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Dala');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Tarauni' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Tarauni');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Nassarawa' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Nassarawa');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Gwale' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Gwale');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Ungogo' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Ungogo');

INSERT INTO public.lgas (state_id, name)
SELECT s.id, 'Kumbotso' FROM public.states s WHERE s.name = 'Kano'
AND NOT EXISTS (SELECT 1 FROM public.lgas WHERE name = 'Kumbotso');

-- ========================
-- 5. INDUSTRIES
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
-- 6. REQUIREMENTS
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
-- 7. COSTS
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

-- ========================
-- 8. REGULATORY UPDATES
-- ========================

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'CAC Introduces Digital Business Registration Fee Reduction',
  'The Corporate Affairs Commission has reduced the digital business registration fee for private limited companies by 20% for online filings completed through the CAC portal. This applies to new business registrations and is part of the government''s ease-of-doing-business initiative.',
  'CAC Official Gazette',
  'https://www.cac.gov.ng',
  '2026-03-01',
  '["general-business", "food-beverage", "technology", "retail-ecommerce", "financial-services", "healthcare", "manufacturing", "agriculture", "fashion-apparel"]'::jsonb,
  '["Business Registration with CAC"]'::jsonb,
  'medium', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'CAC Introduces Digital Business Registration Fee Reduction');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'FIRS Extends VAT Filing Deadline for Small Businesses',
  'The Federal Inland Revenue Service has extended the VAT filing deadline from the 14th to the 21st of each month for businesses with annual turnover below NGN 25 million. The extension aims to reduce compliance burden on small businesses.',
  'FIRS Public Notice',
  'https://www.firs.gov.ng',
  '2026-02-01',
  '["general-business", "food-beverage", "technology", "retail-ecommerce", "financial-services", "healthcare", "manufacturing", "agriculture", "fashion-apparel"]'::jsonb,
  '["VAT Registration and Filing"]'::jsonb,
  'low', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'FIRS Extends VAT Filing Deadline');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'NAFDAC Mandates Digital Product Registration Portal',
  'NAFDAC has transitioned all product registration applications to its new digital portal, effective immediately. Paper-based submissions will no longer be accepted. Applicants must create an account on the NAFDAC e-registration platform and submit all documentation electronically.',
  'NAFDAC Official Notice',
  'https://www.nafdac.gov.ng',
  '2026-01-15',
  '["food-beverage", "healthcare", "manufacturing"]'::jsonb,
  '["NAFDAC Product Registration", "NAFDAC Manufacturing License"]'::jsonb,
  'high', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'NAFDAC Mandates Digital Product Registration');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'Lagos State Increases PSN Permit Renewal Penalty',
  'The Lagos State Internal Revenue Service has increased the penalty for late renewal of the Business Premises Permit (PSN) from NGN 50,000 to NGN 100,000. Business owners are advised to renew permits at least 30 days before expiry to avoid penalties.',
  'LIRS Official Publication',
  'https://www.lirs.gov.ng',
  '2026-04-01',
  '["general-business", "food-beverage", "technology", "retail-ecommerce", "financial-services", "healthcare", "manufacturing", "agriculture", "fashion-apparel"]'::jsonb,
  '["Lagos PSN Business Premises Permit"]'::jsonb,
  'high', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'Lagos State Increases PSN Permit Renewal Penalty');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'NDPC Releases New Data Protection Compliance Regulations',
  'The Nigeria Data Protection Commission has released updated compliance regulations under the Nigeria Data Protection Act 2023. All businesses processing personal data must register with the NDPC, appoint a Data Protection Officer, and conduct an annual data protection audit.',
  'NDPC Official Gazette',
  'https://www.ndpc.gov.ng',
  '2026-06-01',
  '["general-business", "technology", "financial-services", "healthcare", "retail-ecommerce"]'::jsonb,
  '["NDPR Data Protection Compliance", "Tech Platform Data Protection"]'::jsonb,
  'high', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'NDPC Releases New Data Protection Compliance Regulations');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'PenCom Increases Employer Pension Contribution Rate',
  'The National Pension Commission has increased the minimum employer pension contribution rate from 10% to 12% of employees'' monthly emolument. The change applies to all businesses with three or more employees. Employers have until the end of the current quarter to adjust their payroll systems.',
  'PenCom Circular',
  'https://www.pencom.gov.ng',
  '2026-07-01',
  '["general-business", "food-beverage", "technology", "retail-ecommerce", "financial-services", "healthcare", "manufacturing", "agriculture"]'::jsonb,
  '["Employer Pension Contribution"]'::jsonb,
  'medium', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'PenCom Increases Employer Pension Contribution');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'SON Mandates Digital Product Certification for E-commerce',
  'The Standards Organisation of Nigeria now requires all e-commerce businesses to display SON certification numbers for regulated products on their online listings. Non-compliant businesses face platform suspension and potential fines.',
  'SON Official Notice',
  'https://www.son.gov.ng',
  '2026-05-01',
  '["retail-ecommerce", "manufacturing", "fashion-apparel"]'::jsonb,
  '["SON Product Certification", "SON Textile Standards"]'::jsonb,
  'medium', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'SON Mandates Digital Product Certification');

INSERT INTO public.regulatory_updates (title, summary, source, source_url, effective_date, affected_industries, affected_requirements, impact_level, is_published, published_at)
SELECT 'CBN Updates Guidelines for Payment Service Providers',
  'The Central Bank of Nigeria has issued updated guidelines for Payment Service Providers (PSPs), including new capital adequacy requirements and enhanced anti-money laundering compliance obligations. Existing PSPs have six months to comply with the new requirements.',
  'CBN Circular',
  'https://www.cbn.gov.ng',
  '2026-08-01',
  '["financial-services", "technology"]'::jsonb,
  '["Tech Platform Data Protection"]'::jsonb,
  'high', true, NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.regulatory_updates WHERE title LIKE 'CBN Updates Guidelines for Payment Service Providers');

-- ========================
-- 9. SUBSCRIPTION PLANS
-- ========================
-- Run database/migrations/19_subscription_plan_slugs.sql first to apply the
-- correct slug constraint and seed the three plans (starter, growth, enterprise).

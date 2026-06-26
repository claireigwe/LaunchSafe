-- 24_report_cost_format.sql
-- One-shot migration: upgrade old-format assessment report costs to the new 3-category format.
-- Old format stored costs as totalOfficialCost / totalEstimatedCost flat numbers.
-- New format stores them as structured objects (officialCosts, commonSetupCosts, localCosts, estimatedBudget).
-- This replaces the runtime migration code previously in AssessmentEngine.getFullReport().

UPDATE assessments
SET results_json = jsonb_set(
  jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            results_json - 'totalOfficialCost' - 'totalEstimatedCost',
            '{officialCosts}',
            jsonb_build_object(
              'label', 'Official Compliance Costs',
              'min', COALESCE((results_json->>'totalOfficialCost')::numeric, 0),
              'max', ROUND(COALESCE((results_json->>'totalOfficialCost')::numeric, 0) * 1.3) + COALESCE((results_json->>'totalEstimatedCost')::numeric, 0)
            )
          ),
          '{commonSetupCosts}',
          '[
            {"label": "Legal & Documentation Services", "range": "₦50,000 – ₦150,000", "reason": "Professional fees for business registration and legal advice"},
            {"label": "Business Registration Processing", "range": "₦20,000 – ₦50,000", "reason": "Filing fees and processing charges"}
          ]'::jsonb
        ),
        '{commonSetupCostRange}',
        jsonb_build_object('label', 'Common Setup Costs', 'min', 7000000, 'max', 20000000)
      ),
      '{localCosts}',
      '[
        {"label": "Local Government Development Levy", "note": "Annual levy charged by some LGAs"},
        {"label": "Market or Trade Association Fees", "note": "May be required depending on location"}
      ]'::jsonb
    ),
    '{localCostNote}',
    '"These costs vary significantly by location. Verify locally before budgeting."'
  ),
  '{estimatedBudget}',
  jsonb_build_object(
    'label', 'Estimated Launch Budget',
    'min', COALESCE((results_json->>'totalOfficialCost')::numeric, 0) + 7000000,
    'max', ROUND(COALESCE((results_json->>'totalOfficialCost')::numeric, 0) * 1.3) + COALESCE((results_json->>'totalEstimatedCost')::numeric, 0) + 20000000
  )
)
WHERE results_json ? 'totalOfficialCost'
  AND NOT results_json ? 'officialCosts';

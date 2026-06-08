ALTER TABLE public.assessments
  ADD COLUMN IF NOT EXISTS wizard_data JSONB,
  ADD COLUMN IF NOT EXISTS wizard_step TEXT;

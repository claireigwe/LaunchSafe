ALTER TABLE public.businesses
  ADD COLUMN IF NOT EXISTS details JSONB NOT NULL DEFAULT '{}';

-- Backfill details from existing description JSON blobs
UPDATE public.businesses
SET details = COALESCE(
  CASE
    WHEN description IS NOT NULL AND description <> '' THEN
      CASE
        WHEN description::jsonb ? 'fullData' THEN
          description::jsonb->'fullData'
        ELSE
          jsonb_build_object('description', description)
      END
    ELSE '{}'::jsonb
  END,
  '{}'::jsonb
)
WHERE details = '{}'::jsonb;

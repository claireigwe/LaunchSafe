-- 25_remove_dead_columns.sql
-- Remove columns that were added speculatively and never populated/read.

ALTER TABLE public.user_profiles
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS avatar_url;

ALTER TABLE public.industries
  DROP COLUMN IF EXISTS parent_id;

ALTER TABLE public.businesses
  DROP COLUMN IF EXISTS launch_date;

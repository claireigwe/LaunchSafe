ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS preferred_business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL;

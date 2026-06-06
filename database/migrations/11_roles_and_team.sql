-- Add role column to user_profiles
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'owner'
    CHECK (role IN ('owner', 'admin', 'member'));

-- Business members table (for team management)
CREATE TABLE IF NOT EXISTS public.business_members (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member'
                CHECK (role IN ('owner', 'admin', 'member')),
  invited_by  UUID REFERENCES auth.users(id),
  invited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  joined_at   TIMESTAMPTZ,
  UNIQUE(business_id, user_id)
);

ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own memberships"
  ON public.business_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Business owners can manage members"
  ON public.business_members FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.business_members bm
      WHERE bm.business_id = business_members.business_id
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'admin')
    )
  );

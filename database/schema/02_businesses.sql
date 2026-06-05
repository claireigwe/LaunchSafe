-- 02_businesses.sql

CREATE TABLE IF NOT EXISTS public.businesses (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  industry_id     UUID,                        -- FK added after 06_regulatory.sql
  country_id      UUID,                        -- FK added after 06_regulatory.sql
  state_id        UUID,
  lga_id          UUID,
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'archived', 'suspended')),
  launch_date     DATE,
  employee_count  INTEGER,
  website         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_businesses_status   ON public.businesses(status);

CREATE TRIGGER set_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

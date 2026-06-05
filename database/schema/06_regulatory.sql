-- 06_regulatory.sql
-- Platform-owned regulatory knowledge — not editable by regular users.

-- Geographic hierarchy
CREATE TABLE IF NOT EXISTS public.countries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  code          TEXT NOT NULL UNIQUE,           -- ISO 3166-1 alpha-2
  currency_code TEXT NOT NULL DEFAULT 'NGN',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.states (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id UUID NOT NULL REFERENCES public.countries(id),
  name       TEXT NOT NULL,
  code       TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lgas (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  state_id   UUID NOT NULL REFERENCES public.states(id),
  name       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Industries
CREATE TABLE IF NOT EXISTS public.industries (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id   UUID REFERENCES public.industries(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Regulatory agencies
CREATE TABLE IF NOT EXISTS public.agencies (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_id  UUID NOT NULL REFERENCES public.countries(id),
  name        TEXT NOT NULL,
  acronym     TEXT,
  website     TEXT,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_agencies_updated_at
  BEFORE UPDATE ON public.agencies
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Requirements (core regulatory knowledge)
CREATE TABLE IF NOT EXISTS public.requirements (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id         UUID NOT NULL REFERENCES public.agencies(id),
  industry_id       UUID NOT NULL REFERENCES public.industries(id),
  country_id        UUID NOT NULL REFERENCES public.countries(id),
  state_id          UUID REFERENCES public.states(id),
  lga_id            UUID REFERENCES public.lgas(id),
  name              TEXT NOT NULL,
  description       TEXT NOT NULL,
  requirement_type  TEXT NOT NULL
                      CHECK (requirement_type IN (
                        'registration', 'license', 'permit', 'inspection',
                        'tax', 'filing', 'certification', 'reporting'
                      )),
  frequency         TEXT NOT NULL
                      CHECK (frequency IN (
                        'one_time', 'monthly', 'quarterly', 'annual', 'event_driven'
                      )),
  status            TEXT NOT NULL DEFAULT 'draft'
                      CHECK (status IN (
                        'draft', 'under_review', 'verified', 'active', 'updated', 'archived'
                      )),
  confidence_level  TEXT NOT NULL DEFAULT 'estimated'
                      CHECK (confidence_level IN (
                        'verified', 'estimated', 'community_reported'
                      )),
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  source_url        TEXT,
  source_document   TEXT,
  verified_at       TIMESTAMPTZ,
  last_reviewed_at  TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_requirements_industry_id ON public.requirements(industry_id);
CREATE INDEX idx_requirements_country_id  ON public.requirements(country_id);
CREATE INDEX idx_requirements_status      ON public.requirements(status);

CREATE TRIGGER set_requirements_updated_at
  BEFORE UPDATE ON public.requirements
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Requirement costs (official vs estimated vs community must remain separate)
CREATE TABLE IF NOT EXISTS public.requirement_costs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requirement_id  UUID NOT NULL REFERENCES public.requirements(id) ON DELETE CASCADE,
  cost_type       TEXT NOT NULL
                    CHECK (cost_type IN ('official', 'estimated', 'community_reported')),
  amount          BIGINT NOT NULL,              -- in smallest currency unit
  currency        TEXT NOT NULL DEFAULT 'NGN',
  notes           TEXT,
  is_verified     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_requirement_costs_updated_at
  BEFORE UPDATE ON public.requirement_costs
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Regulatory updates
CREATE TABLE IF NOT EXISTS public.regulatory_updates (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title                  TEXT NOT NULL,
  summary                TEXT NOT NULL,
  source                 TEXT NOT NULL,
  source_url             TEXT,
  effective_date         DATE NOT NULL,
  affected_industries    JSONB NOT NULL DEFAULT '[]',
  affected_requirements  JSONB NOT NULL DEFAULT '[]',
  impact_level           TEXT NOT NULL DEFAULT 'medium'
                           CHECK (impact_level IN ('low', 'medium', 'high')),
  is_published           BOOLEAN NOT NULL DEFAULT FALSE,
  published_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_regulatory_updates_updated_at
  BEFORE UPDATE ON public.regulatory_updates
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Add FK constraints to businesses and assessments tables
ALTER TABLE public.businesses
  ADD CONSTRAINT fk_businesses_industry  FOREIGN KEY (industry_id)  REFERENCES public.industries(id),
  ADD CONSTRAINT fk_businesses_country   FOREIGN KEY (country_id)   REFERENCES public.countries(id),
  ADD CONSTRAINT fk_businesses_state     FOREIGN KEY (state_id)     REFERENCES public.states(id),
  ADD CONSTRAINT fk_businesses_lga       FOREIGN KEY (lga_id)       REFERENCES public.lgas(id);

ALTER TABLE public.assessments
  ADD CONSTRAINT fk_assessments_industry FOREIGN KEY (industry_id)  REFERENCES public.industries(id),
  ADD CONSTRAINT fk_assessments_country  FOREIGN KEY (country_id)   REFERENCES public.countries(id),
  ADD CONSTRAINT fk_assessments_state    FOREIGN KEY (state_id)     REFERENCES public.states(id);

ALTER TABLE public.compliance_tasks
  ADD CONSTRAINT fk_tasks_requirement    FOREIGN KEY (requirement_id) REFERENCES public.requirements(id);
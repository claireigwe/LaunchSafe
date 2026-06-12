-- 05_billing.sql

-- Payments (covers both assessment purchases and subscription payments)
CREATE TABLE IF NOT EXISTS public.payments (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id              UUID NOT NULL REFERENCES auth.users(id),
  amount               BIGINT NOT NULL,          -- stored in kobo (smallest unit)
  currency             TEXT NOT NULL DEFAULT 'NGN',
  provider             TEXT NOT NULL DEFAULT 'paystack',
  payment_type         TEXT NOT NULL
                         CHECK (payment_type IN ('assessment', 'subscription')),
  reference            TEXT NOT NULL UNIQUE,     -- LaunchSafe-generated reference
  provider_reference   TEXT,                     -- Paystack reference
  status               TEXT NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  metadata             JSONB,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- NEVER store card numbers, CVV, or expiry dates.

CREATE INDEX idx_payments_user_id   ON public.payments(user_id);
CREATE INDEX idx_payments_reference ON public.payments(reference);
CREATE INDEX idx_payments_status    ON public.payments(status);

CREATE TRIGGER set_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Assessment purchases
CREATE TABLE IF NOT EXISTS public.assessment_purchases (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES auth.users(id),
  assessment_id UUID NOT NULL REFERENCES public.assessments(id),
  payment_id    UUID REFERENCES public.payments(id),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  unlocked_at   TIMESTAMPTZ,                    -- set only after server-side verification
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(assessment_id)                         -- one purchase per assessment
);

CREATE TRIGGER set_assessment_purchases_updated_at
  BEFORE UPDATE ON public.assessment_purchases
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Subscription plans (configurable — not hardcoded)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name             TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE
                     CHECK (slug IN ('starter', 'growth', 'enterprise')),
  price_monthly    BIGINT NOT NULL DEFAULT 0,   -- in kobo
  price_yearly     BIGINT NOT NULL DEFAULT 0,
  currency         TEXT NOT NULL DEFAULT 'NGN',
  features         JSONB NOT NULL DEFAULT '[]',
  business_limit   INTEGER NOT NULL DEFAULT 1,
  assessment_limit INTEGER NOT NULL DEFAULT 1,
  is_active        BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                      UUID NOT NULL REFERENCES auth.users(id),
  plan_id                      UUID NOT NULL REFERENCES public.subscription_plans(id),
  status                       TEXT NOT NULL DEFAULT 'trial'
                                 CHECK (status IN ('trial', 'active', 'expired', 'cancelled', 'suspended')),
  paystack_subscription_code   TEXT,
  current_period_start         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  current_period_end           TIMESTAMPTZ NOT NULL,
  cancelled_at                 TIMESTAMPTZ,
  created_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_status  ON public.subscriptions(status);

CREATE TRIGGER set_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Billing events (immutable audit log)
CREATE TABLE IF NOT EXISTS public.billing_events (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  subscription_id UUID REFERENCES public.subscriptions(id),
  payment_id      UUID REFERENCES public.payments(id),
  event_type      TEXT NOT NULL,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
  -- No updated_at: billing events are immutable audit records.
);

CREATE INDEX idx_billing_events_user_id ON public.billing_events(user_id);
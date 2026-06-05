-- 08_notifications.sql

CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  type        TEXT NOT NULL
                CHECK (type IN (
                  'deadline_reminder', 'payment_success', 'payment_failed',
                  'subscription_expiring', 'subscription_expired',
                  'assessment_unlocked', 'regulatory_update', 'compliance_overdue'
                )),
  title       TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  action_url  TEXT,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read_at     TIMESTAMPTZ
);

CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_is_read ON public.notifications(is_read);

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id                            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id                       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email_deadline_reminders      BOOLEAN NOT NULL DEFAULT TRUE,
  email_payment_alerts          BOOLEAN NOT NULL DEFAULT TRUE,
  email_regulatory_updates      BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_deadline_reminders     BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_payment_alerts         BOOLEAN NOT NULL DEFAULT TRUE,
  in_app_regulatory_updates     BOOLEAN NOT NULL DEFAULT TRUE,
  reminder_days_before          INTEGER NOT NULL DEFAULT 7,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

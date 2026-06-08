-- 14_user_profile_and_prefs.sql

-- 1. Add job_title to user_profiles
ALTER TABLE public.user_profiles
ADD COLUMN IF NOT EXISTS job_title TEXT;

-- 2. Alter notification_preferences to match frontend NotificationPrefs
-- Note: the old schema had email_deadline_reminders, etc. We will add the new ones matching frontend keys.

ALTER TABLE public.notification_preferences
ADD COLUMN IF NOT EXISTS task_notifications BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS deadline_reminders BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS document_notifications BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS billing_notifications BOOLEAN NOT NULL DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS system_announcements BOOLEAN NOT NULL DEFAULT TRUE;

-- Automatically create notification_preferences when a user signs up.
-- We will update the handle_new_user function to ensure both a profile and notification preferences are created.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.user_profiles (user_id, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  )
  ON CONFLICT (user_id) DO NOTHING;

  -- Insert default notification preferences
  INSERT INTO public.notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

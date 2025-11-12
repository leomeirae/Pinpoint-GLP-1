-- Migration: Add onboarding fields to users table
-- Date: 2025-11-12
-- Reason: C1 - Onboarding Core refactoring

-- Add onboarding fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS consent_version TEXT,
ADD COLUMN IF NOT EXISTS consent_accepted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS analytics_opt_in BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS preferred_day INTEGER CHECK (preferred_day >= 0 AND preferred_day <= 6),
ADD COLUMN IF NOT EXISTS preferred_time TIME,
ADD COLUMN IF NOT EXISTS reminder_window_start TIME,
ADD COLUMN IF NOT EXISTS reminder_window_end TIME;

-- Add comments for documentation
COMMENT ON COLUMN public.users.consent_version IS 'Version of terms accepted by user (e.g., 1.0.0)';
COMMENT ON COLUMN public.users.consent_accepted_at IS 'Timestamp when user accepted terms';
COMMENT ON COLUMN public.users.analytics_opt_in IS 'User opted in for analytics (LGPD compliance, default: false)';
COMMENT ON COLUMN public.users.preferred_day IS 'Preferred day of week for injections (0=Sunday, 6=Saturday)';
COMMENT ON COLUMN public.users.preferred_time IS 'Preferred time for injection reminders (24h format)';
COMMENT ON COLUMN public.users.reminder_window_start IS 'Start time for reminder window (future enhancement)';
COMMENT ON COLUMN public.users.reminder_window_end IS 'End time for reminder window (future enhancement)';

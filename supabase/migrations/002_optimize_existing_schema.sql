-- ============================================================================
-- OPTIMIZED MIGRATION: Uses existing tables + adds what's missing
-- ============================================================================
-- This migration adapts to your existing schema:
--   - users (exists)
--   - medications (exists)
--   - medication_applications (exists)
--   - weight_logs (exists)
--   - side_effects (exists)
--
-- We will:
--   1. Rename/alias existing tables to match our hooks
--   2. Add missing columns to existing tables
--   3. Create new tables only if needed
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- OPTION 1: USE EXISTING TABLES (RECOMMENDED)
-- ============================================================================

-- Create VIEW aliases for existing tables (non-destructive approach)
-- This lets us use existing data with our new hooks

-- 1. profiles view → uses existing 'users' table + medications
CREATE OR REPLACE VIEW profiles AS
SELECT
  u.id,
  u.name,
  u.email,
  NULL::numeric(5,2) as height,  -- Add these columns to users table if needed
  NULL::numeric(5,2) as start_weight,
  NULL::numeric(5,2) as target_weight,
  m.type::text as medication,
  m.dosage as current_dose,
  m.frequency::text as frequency,
  u.created_at,
  u.updated_at
FROM users u
LEFT JOIN LATERAL (
  SELECT type, dosage, frequency
  FROM medications
  WHERE user_id = u.id AND active = true
  ORDER BY created_at DESC
  LIMIT 1
) m ON true;

-- 2. applications view → uses existing 'medication_applications' table
-- Add columns we need
DO $$
BEGIN
  -- Add injection_sites column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medication_applications'
    AND column_name = 'injection_sites'
  ) THEN
    ALTER TABLE medication_applications ADD COLUMN injection_sites TEXT[] DEFAULT '{}';
  END IF;

  -- Add side_effects column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medication_applications'
    AND column_name = 'side_effects_list'
  ) THEN
    ALTER TABLE medication_applications ADD COLUMN side_effects_list TEXT[] DEFAULT '{}';
  END IF;

  -- Add updated_at column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medication_applications'
    AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE medication_applications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
  END IF;
END $$;

CREATE OR REPLACE VIEW applications AS
SELECT
  id,
  user_id,
  application_date as date,
  dosage,
  COALESCE(injection_sites, '{}'::text[]) as injection_sites,
  COALESCE(side_effects_list, '{}'::text[]) as side_effects,
  notes,
  created_at,
  COALESCE(updated_at, created_at) as updated_at
FROM medication_applications;

-- 3. weights view → uses existing 'weight_logs' table (already perfect!)
CREATE OR REPLACE VIEW weights AS
SELECT
  id,
  user_id,
  date,
  weight,
  notes,
  created_at
FROM weight_logs;

-- 4. settings table → CREATE NEW (doesn't exist yet)
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  theme TEXT DEFAULT 'classic',
  accent_color TEXT DEFAULT '#0891B2',
  dark_mode BOOLEAN DEFAULT FALSE,
  shot_reminder BOOLEAN DEFAULT TRUE,
  shot_reminder_time TIME DEFAULT '09:00:00',
  weight_reminder BOOLEAN DEFAULT TRUE,
  weight_reminder_time TIME DEFAULT '08:00:00',
  achievements_notifications BOOLEAN DEFAULT TRUE,
  sync_apple_health BOOLEAN DEFAULT FALSE,
  auto_backup BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================================
-- ADD MISSING COLUMNS TO EXISTING TABLES
-- ============================================================================

-- Add profile columns to users table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'height'
  ) THEN
    ALTER TABLE users ADD COLUMN height NUMERIC(5, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'start_weight'
  ) THEN
    ALTER TABLE users ADD COLUMN start_weight NUMERIC(5, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'target_weight'
  ) THEN
    ALTER TABLE users ADD COLUMN target_weight NUMERIC(5, 2);
  END IF;
END $$;

-- ============================================================================
-- CREATE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_medication_applications_user_date
  ON medication_applications(user_id, application_date DESC);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date
  ON weight_logs(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_settings_user_id
  ON settings(user_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on settings (existing tables should already have RLS)
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for settings
DROP POLICY IF EXISTS "Users can view own settings" ON public.settings;
CREATE POLICY "Users can view own settings"
  ON public.settings FOR SELECT
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.uid()::text LIMIT 1));

DROP POLICY IF EXISTS "Users can insert own settings" ON public.settings;
CREATE POLICY "Users can insert own settings"
  ON public.settings FOR INSERT
  WITH CHECK (user_id = (SELECT id FROM users WHERE clerk_id = auth.uid()::text LIMIT 1));

DROP POLICY IF EXISTS "Users can update own settings" ON public.settings;
CREATE POLICY "Users can update own settings"
  ON public.settings FOR UPDATE
  USING (user_id = (SELECT id FROM users WHERE clerk_id = auth.uid()::text LIMIT 1));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to medication_applications (if updated_at exists)
DROP TRIGGER IF EXISTS update_medication_applications_updated_at ON medication_applications;
CREATE TRIGGER update_medication_applications_updated_at
  BEFORE UPDATE ON medication_applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to settings
DROP TRIGGER IF EXISTS update_settings_updated_at ON settings;
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSTEAD OF TRIGGERS FOR VIEWS (to make views writable)
-- ============================================================================

-- Make profiles view writable
CREATE OR REPLACE FUNCTION profiles_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into users table
  INSERT INTO users (id, name, email, height, start_weight, target_weight)
  VALUES (
    NEW.id,
    NEW.name,
    NEW.email,
    NEW.height,
    NEW.start_weight,
    NEW.target_weight
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION profiles_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update users table
  UPDATE users SET
    name = NEW.name,
    email = NEW.email,
    height = NEW.height,
    start_weight = NEW.start_weight,
    target_weight = NEW.target_weight,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_insert_trigger ON profiles;
CREATE TRIGGER profiles_insert_trigger
  INSTEAD OF INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION profiles_insert();

DROP TRIGGER IF EXISTS profiles_update_trigger ON profiles;
CREATE TRIGGER profiles_update_trigger
  INSTEAD OF UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION profiles_update();

-- Make applications view writable
CREATE OR REPLACE FUNCTION applications_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO medication_applications (
    user_id,
    medication_id,
    dosage,
    application_date,
    injection_sites,
    side_effects_list,
    notes
  ) VALUES (
    NEW.user_id,
    (SELECT id FROM medications WHERE user_id = NEW.user_id AND active = true LIMIT 1),
    NEW.dosage,
    NEW.date,
    NEW.injection_sites,
    NEW.side_effects,
    NEW.notes
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION applications_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE medication_applications SET
    dosage = NEW.dosage,
    application_date = NEW.date,
    injection_sites = NEW.injection_sites,
    side_effects_list = NEW.side_effects,
    notes = NEW.notes,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION applications_delete()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM medication_applications WHERE id = OLD.id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS applications_insert_trigger ON applications;
CREATE TRIGGER applications_insert_trigger
  INSTEAD OF INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_insert();

DROP TRIGGER IF EXISTS applications_update_trigger ON applications;
CREATE TRIGGER applications_update_trigger
  INSTEAD OF UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_update();

DROP TRIGGER IF EXISTS applications_delete_trigger ON applications;
CREATE TRIGGER applications_delete_trigger
  INSTEAD OF DELETE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION applications_delete();

-- ============================================================================
-- SUMMARY
-- ============================================================================

-- This migration:
-- ✅ Uses your existing tables (users, medication_applications, weight_logs)
-- ✅ Adds missing columns (height, start_weight, target_weight to users)
-- ✅ Adds missing columns (injection_sites, side_effects_list to medication_applications)
-- ✅ Creates views (profiles, applications, weights) that our hooks can use
-- ✅ Creates settings table (new, didn't exist)
-- ✅ Makes views writable with INSTEAD OF triggers
-- ✅ Preserves all your existing data
-- ✅ Non-destructive (doesn't drop anything)

COMMENT ON VIEW profiles IS 'View combining users table with active medication info';
COMMENT ON VIEW applications IS 'View adapting medication_applications for new hook interface';
COMMENT ON VIEW weights IS 'View aliasing weight_logs for new hook interface';
COMMENT ON TABLE settings IS 'User preferences including theme and notifications';

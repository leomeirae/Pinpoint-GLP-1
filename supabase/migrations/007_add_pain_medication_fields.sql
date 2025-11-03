-- Migration 007: Add pain_level and medication_type fields
-- This migration adds fields needed for the Shotsy-style Add Application screen
-- Note: applications is a VIEW based on medication_applications, so we update both

-- Add pain_level column to medication_applications table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medication_applications'
    AND column_name = 'pain_level'
  ) THEN
    ALTER TABLE medication_applications ADD COLUMN pain_level INTEGER DEFAULT 0;
  END IF;
END $$;

-- Add medication_type column to store medication name (mounjaro, ozempic, etc)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'medication_applications'
    AND column_name = 'medication_type'
  ) THEN
    ALTER TABLE medication_applications ADD COLUMN medication_type TEXT;
  END IF;
END $$;

-- Update applications VIEW to include new fields
CREATE OR REPLACE VIEW applications AS
SELECT
  id,
  user_id,
  application_date as date,
  dosage,
  COALESCE(injection_sites, '{}'::text[]) as injection_sites,
  COALESCE(side_effects_list, '{}'::text[]) as side_effects,
  notes,
  COALESCE(pain_level, 0) as pain_level,
  medication_type,
  created_at,
  COALESCE(updated_at, created_at) as updated_at
FROM medication_applications;

-- Update applications_insert function to include new fields
CREATE OR REPLACE FUNCTION applications_insert()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO medication_applications (
    user_id,
    medication_id,
    medication_type,
    dosage,
    application_date,
    injection_sites,
    side_effects_list,
    notes,
    pain_level
  ) VALUES (
    NEW.user_id,
    (SELECT id FROM medications WHERE user_id = NEW.user_id AND active = true LIMIT 1),
    NEW.medication_type,
    NEW.dosage,
    NEW.date,
    NEW.injection_sites,
    NEW.side_effects,
    NEW.notes,
    COALESCE(NEW.pain_level, 0)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update applications_update function to include new fields
CREATE OR REPLACE FUNCTION applications_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE medication_applications SET
    dosage = NEW.dosage,
    application_date = NEW.date,
    injection_sites = NEW.injection_sites,
    side_effects_list = NEW.side_effects,
    notes = NEW.notes,
    pain_level = COALESCE(NEW.pain_level, 0),
    medication_type = NEW.medication_type,
    updated_at = NOW()
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON COLUMN medication_applications.pain_level IS 'Pain level from 0 to 10';
COMMENT ON COLUMN medication_applications.medication_type IS 'Medication type ID (mounjaro, ozempic, wegovy, zepbound, tirzepatide, semaglutide)';

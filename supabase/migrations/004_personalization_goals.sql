-- Migration: 004_personalization_goals.sql
-- Description: Add personalized goals system
-- Created: 2025-11-01

-- Create user_goals table
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Goal definition
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,

  -- Target & Timeline
  target_value NUMERIC(10, 2),
  target_unit TEXT,
  target_date TIMESTAMPTZ,

  -- Progress tracking
  current_value NUMERIC(10, 2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,

  -- Milestones
  milestones JSONB DEFAULT '[]'::jsonb,

  -- Customization
  celebration_style TEXT DEFAULT 'energetic',
  reminder_enabled BOOLEAN DEFAULT TRUE,

  -- Status
  status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT valid_goal_type CHECK (type IN ('weight_loss', 'energy_boost', 'consistency', 'custom')),
  CONSTRAINT valid_celebration_style CHECK (celebration_style IN ('subtle', 'energetic', 'zen')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  CONSTRAINT valid_progress CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  CONSTRAINT valid_values CHECK (current_value >= 0 AND (target_value IS NULL OR target_value > 0))
);

-- Enable Row Level Security
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own goals"
  ON public.user_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.user_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.user_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_status ON public.user_goals(user_id, status);
CREATE INDEX idx_user_goals_type ON public.user_goals(user_id, type);
CREATE INDEX idx_user_goals_target_date ON public.user_goals(target_date) WHERE status = 'active';

-- Create trigger for updated_at
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to auto-update progress percentage
CREATE OR REPLACE FUNCTION update_goal_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-calculate progress percentage if target_value exists
  IF NEW.target_value IS NOT NULL AND NEW.target_value > 0 THEN
    NEW.progress_percentage := LEAST(100, GREATEST(0,
      ROUND((NEW.current_value / NEW.target_value) * 100)::INTEGER
    ));

    -- Auto-complete goal if 100% reached
    IF NEW.progress_percentage >= 100 AND OLD.status = 'active' THEN
      NEW.status := 'completed';
      NEW.completed_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update progress
CREATE TRIGGER auto_update_goal_progress
  BEFORE UPDATE OF current_value, target_value ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_goal_progress();

-- Function to check milestone achievements
CREATE OR REPLACE FUNCTION check_milestone_achievements()
RETURNS TRIGGER AS $$
DECLARE
  milestone JSONB;
  updated_milestones JSONB := '[]'::jsonb;
  milestone_value NUMERIC;
  milestone_achieved BOOLEAN;
BEGIN
  -- Loop through milestones and check achievements
  FOR milestone IN SELECT * FROM jsonb_array_elements(NEW.milestones)
  LOOP
    milestone_value := (milestone->>'value')::NUMERIC;
    milestone_achieved := COALESCE((milestone->>'achieved')::BOOLEAN, FALSE);

    -- Mark as achieved if current value >= milestone value
    IF NOT milestone_achieved AND NEW.current_value >= milestone_value THEN
      milestone := jsonb_set(milestone, '{achieved}', 'true'::jsonb);
      milestone := jsonb_set(milestone, '{achieved_date}', to_jsonb(NOW()::TEXT));
    END IF;

    updated_milestones := updated_milestones || milestone;
  END LOOP;

  NEW.milestones := updated_milestones;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to check milestones
CREATE TRIGGER auto_check_milestone_achievements
  BEFORE UPDATE OF current_value ON public.user_goals
  FOR EACH ROW
  WHEN (OLD.current_value IS DISTINCT FROM NEW.current_value)
  EXECUTE FUNCTION check_milestone_achievements();

-- Add comments for documentation
COMMENT ON TABLE public.user_goals IS 'Stores personalized user goals beyond just weight loss';
COMMENT ON COLUMN public.user_goals.type IS 'Goal type: weight_loss, energy_boost, consistency, or custom';
COMMENT ON COLUMN public.user_goals.milestones IS 'JSON array of milestone objects with value, label, achieved status, and date';
COMMENT ON COLUMN public.user_goals.celebration_style IS 'How to celebrate achievements: subtle, energetic, or zen';
COMMENT ON COLUMN public.user_goals.progress_percentage IS 'Auto-calculated from current_value / target_value';

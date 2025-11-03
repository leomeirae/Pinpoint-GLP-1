-- Migration: 003_personalization_avatar.sql
-- Description: Add avatar personalization system
-- Created: 2025-11-01

-- Create user_avatars table
CREATE TABLE IF NOT EXISTS public.user_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Avatar appearance
  style TEXT NOT NULL DEFAULT 'minimal',
  primary_color TEXT NOT NULL DEFAULT '#0891B2',
  accessories JSONB DEFAULT '[]'::jsonb,
  mood TEXT DEFAULT 'motivated',

  -- Avatar evolution
  level INTEGER DEFAULT 1,
  evolution_stage TEXT DEFAULT 'beginner',
  unlock_date TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id),

  -- Constraints
  CONSTRAINT valid_style CHECK (style IN ('abstract', 'minimal', 'illustrated', 'photo')),
  CONSTRAINT valid_mood CHECK (mood IN ('motivated', 'chill', 'determined', 'playful')),
  CONSTRAINT valid_evolution_stage CHECK (evolution_stage IN ('beginner', 'intermediate', 'advanced', 'master')),
  CONSTRAINT valid_level CHECK (level >= 1 AND level <= 100)
);

-- Enable Row Level Security
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own avatar"
  ON public.user_avatars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar"
  ON public.user_avatars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar"
  ON public.user_avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own avatar"
  ON public.user_avatars FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_avatars_user_id ON public.user_avatars(user_id);
CREATE INDEX idx_user_avatars_level ON public.user_avatars(level);
CREATE INDEX idx_user_avatars_evolution_stage ON public.user_avatars(evolution_stage);

-- Create trigger for updated_at
CREATE TRIGGER update_user_avatars_updated_at
  BEFORE UPDATE ON public.user_avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to auto-update evolution stage based on level
CREATE OR REPLACE FUNCTION update_avatar_evolution_stage()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-update evolution stage based on level
  IF NEW.level >= 40 THEN
    NEW.evolution_stage := 'master';
  ELSIF NEW.level >= 25 THEN
    NEW.evolution_stage := 'advanced';
  ELSIF NEW.level >= 10 THEN
    NEW.evolution_stage := 'intermediate';
  ELSE
    NEW.evolution_stage := 'beginner';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update evolution stage
CREATE TRIGGER auto_update_avatar_evolution_stage
  BEFORE INSERT OR UPDATE OF level ON public.user_avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_avatar_evolution_stage();

-- Add comment for documentation
COMMENT ON TABLE public.user_avatars IS 'Stores user avatar customization and evolution data';
COMMENT ON COLUMN public.user_avatars.style IS 'Avatar visual style: abstract, minimal, illustrated, or photo';
COMMENT ON COLUMN public.user_avatars.accessories IS 'JSON array of unlocked accessories';
COMMENT ON COLUMN public.user_avatars.mood IS 'Current avatar mood/expression';
COMMENT ON COLUMN public.user_avatars.evolution_stage IS 'Auto-calculated based on level: beginner (1-9), intermediate (10-24), advanced (25-39), master (40+)';

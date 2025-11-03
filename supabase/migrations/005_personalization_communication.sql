-- Migration: 005_personalization_communication.sql
-- Description: Add communication style preferences (Tone & Voice)
-- Created: 2025-11-01

-- Create communication_preferences table
CREATE TABLE IF NOT EXISTS public.communication_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Communication style
  style TEXT NOT NULL DEFAULT 'friend',
  humor_level INTEGER DEFAULT 3,
  motivation_type TEXT DEFAULT 'balanced',

  -- Preferences
  use_emojis BOOLEAN DEFAULT TRUE,
  formality_level INTEGER DEFAULT 3,
  preferred_language TEXT DEFAULT 'en',

  -- Notification preferences
  notification_tone TEXT DEFAULT 'encouraging',
  notification_frequency TEXT DEFAULT 'normal',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id),

  -- Constraints
  CONSTRAINT valid_style CHECK (style IN ('coach', 'friend', 'scientist', 'minimalist')),
  CONSTRAINT valid_humor_level CHECK (humor_level BETWEEN 1 AND 5),
  CONSTRAINT valid_motivation_type CHECK (motivation_type IN ('data-driven', 'emotional', 'balanced')),
  CONSTRAINT valid_formality_level CHECK (formality_level BETWEEN 1 AND 5),
  CONSTRAINT valid_notification_tone CHECK (notification_tone IN ('encouraging', 'neutral', 'direct', 'playful')),
  CONSTRAINT valid_notification_frequency CHECK (notification_frequency IN ('minimal', 'normal', 'frequent'))
);

-- Enable Row Level Security
ALTER TABLE public.communication_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own communication preferences"
  ON public.communication_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own communication preferences"
  ON public.communication_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own communication preferences"
  ON public.communication_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own communication preferences"
  ON public.communication_preferences FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_communication_preferences_user_id
  ON public.communication_preferences(user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_communication_preferences_updated_at
  BEFORE UPDATE ON public.communication_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create helper function to get personalized message template
CREATE OR REPLACE FUNCTION get_message_template(
  p_user_id UUID,
  p_message_type TEXT,
  p_context JSONB DEFAULT '{}'::jsonb
) RETURNS TEXT AS $$
DECLARE
  prefs RECORD;
  template TEXT;
  emoji_suffix TEXT := '';
BEGIN
  -- Get user preferences
  SELECT * INTO prefs
  FROM public.communication_preferences
  WHERE user_id = p_user_id;

  -- Return default if no preferences found
  IF NOT FOUND THEN
    RETURN p_message_type;
  END IF;

  -- Add emojis based on preferences
  IF prefs.use_emojis AND (p_context->>'is_celebrating')::BOOLEAN THEN
    CASE prefs.notification_tone
      WHEN 'playful' THEN emoji_suffix := ' 🎉🎊';
      WHEN 'encouraging' THEN emoji_suffix := ' 🎉';
      WHEN 'neutral' THEN emoji_suffix := ' ✓';
      ELSE emoji_suffix := '';
    END CASE;
  END IF;

  -- Build template based on style
  -- This is a simplified version - in production would use more sophisticated logic
  -- or integrate with OpenAI for dynamic generation
  CASE prefs.style
    WHEN 'coach' THEN
      template := format('Great work! %s%s', p_message_type, emoji_suffix);
    WHEN 'friend' THEN
      template := format('Awesome! %s%s', p_message_type, emoji_suffix);
    WHEN 'scientist' THEN
      template := format('Data shows: %s', p_message_type);
    WHEN 'minimalist' THEN
      template := p_message_type;
    ELSE
      template := p_message_type || emoji_suffix;
  END CASE;

  RETURN template;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON TABLE public.communication_preferences IS 'Stores user preferences for app communication style and tone';
COMMENT ON COLUMN public.communication_preferences.style IS 'Communication style: coach, friend, scientist, or minimalist';
COMMENT ON COLUMN public.communication_preferences.humor_level IS 'Level of humor in messages (1=none, 5=maximum)';
COMMENT ON COLUMN public.communication_preferences.motivation_type IS 'Type of motivation: data-driven, emotional, or balanced';
COMMENT ON COLUMN public.communication_preferences.formality_level IS 'Level of formality (1=casual, 5=formal)';
COMMENT ON COLUMN public.communication_preferences.notification_tone IS 'Tone for notifications: encouraging, neutral, direct, or playful';
COMMENT ON COLUMN public.communication_preferences.notification_frequency IS 'Frequency of notifications: minimal, normal, or frequent';
COMMENT ON FUNCTION get_message_template IS 'Helper function to get personalized message template based on user preferences';

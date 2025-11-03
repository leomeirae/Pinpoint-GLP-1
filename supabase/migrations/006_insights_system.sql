-- Migration: 006_insights_system.sql
-- Fase 2: Sistema de Insights e Patterns

-- User insights (gerados automaticamente)
CREATE TABLE IF NOT EXISTS public.user_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  type TEXT NOT NULL, -- 'pattern' | 'achievement' | 'suggestion' | 'warning'
  category TEXT NOT NULL, -- 'weight' | 'consistency' | 'progress' | 'health'

  title TEXT NOT NULL,
  description TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,

  confidence NUMERIC(3, 2) DEFAULT 0.8, -- 0-1
  priority INTEGER DEFAULT 3, -- 1-5

  is_read BOOLEAN DEFAULT FALSE,
  is_dismissed BOOLEAN DEFAULT FALSE,

  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_confidence CHECK (confidence >= 0 AND confidence <= 1),
  CONSTRAINT valid_priority CHECK (priority >= 1 AND priority <= 5)
);

-- Detected patterns
CREATE TABLE IF NOT EXISTS public.detected_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  pattern_type TEXT NOT NULL, -- 'weekly_cycle' | 'food_correlation' | 'sleep_impact'
  pattern_data JSONB NOT NULL,

  confidence NUMERIC(3, 2) NOT NULL,
  occurrences INTEGER DEFAULT 1,

  first_detected TIMESTAMPTZ DEFAULT NOW(),
  last_detected TIMESTAMPTZ DEFAULT NOW(),

  is_active BOOLEAN DEFAULT TRUE,

  CONSTRAINT valid_pattern_confidence CHECK (confidence >= 0 AND confidence <= 1)
);

-- Health score history
CREATE TABLE IF NOT EXISTS public.health_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  date DATE NOT NULL,

  overall_score INTEGER NOT NULL, -- 0-100
  consistency_score INTEGER NOT NULL,
  progress_score INTEGER NOT NULL,
  engagement_score INTEGER NOT NULL,
  data_quality_score INTEGER NOT NULL,

  trend TEXT, -- 'improving' | 'stable' | 'declining'

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, date),

  CONSTRAINT valid_overall CHECK (overall_score >= 0 AND overall_score <= 100),
  CONSTRAINT valid_consistency CHECK (consistency_score >= 0 AND consistency_score <= 100),
  CONSTRAINT valid_progress CHECK (progress_score >= 0 AND progress_score <= 100),
  CONSTRAINT valid_engagement CHECK (engagement_score >= 0 AND engagement_score <= 100),
  CONSTRAINT valid_data_quality CHECK (data_quality_score >= 0 AND data_quality_score <= 100)
);

-- Enable RLS
ALTER TABLE public.user_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detected_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_scores ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users view own insights" ON public.user_insights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own insights" ON public.user_insights FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System inserts insights" ON public.user_insights FOR INSERT WITH CHECK (true);

CREATE POLICY "Users view own patterns" ON public.detected_patterns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System manages patterns" ON public.detected_patterns FOR ALL WITH CHECK (true);

CREATE POLICY "Users view own scores" ON public.health_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System manages scores" ON public.health_scores FOR ALL WITH CHECK (true);

-- Indexes
CREATE INDEX idx_insights_user_created ON public.user_insights(user_id, created_at DESC);
CREATE INDEX idx_insights_unread ON public.user_insights(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_patterns_user_active ON public.detected_patterns(user_id, is_active) WHERE is_active = TRUE;
CREATE INDEX idx_health_scores_user_date ON public.health_scores(user_id, date DESC);

-- Function: Calculate health score
CREATE OR REPLACE FUNCTION calculate_health_score(p_user_id UUID, p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSONB AS $$
DECLARE
  v_consistency INT := 0;
  v_progress INT := 0;
  v_engagement INT := 0;
  v_data_quality INT := 0;
  v_overall INT := 0;
  v_weights_count INT;
  v_apps_count INT;
BEGIN
  -- Consistency (last 30 days)
  SELECT COUNT(*) INTO v_apps_count
  FROM public.applications
  WHERE user_id = p_user_id AND date >= p_date - INTERVAL '30 days';
  v_consistency := LEAST(100, (v_apps_count * 25));

  -- Data Quality (recent logs)
  SELECT COUNT(*) INTO v_weights_count
  FROM public.weights
  WHERE user_id = p_user_id AND date >= p_date - INTERVAL '7 days';
  v_data_quality := LEAST(100, (v_weights_count * 20));

  -- Progress (goal completion)
  v_progress := 50; -- Default, TODO: calculate from goals

  -- Engagement
  v_engagement := 50; -- Default, TODO: calculate from app usage

  -- Overall (weighted average)
  v_overall := ROUND((v_consistency * 0.3 + v_progress * 0.3 + v_engagement * 0.2 + v_data_quality * 0.2));

  RETURN jsonb_build_object(
    'overall', v_overall,
    'consistency', v_consistency,
    'progress', v_progress,
    'engagement', v_engagement,
    'data_quality', v_data_quality
  );
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE public.user_insights IS 'AI-generated insights for users';
COMMENT ON TABLE public.detected_patterns IS 'Automatically detected patterns in user data';
COMMENT ON TABLE public.health_scores IS 'Daily health score calculations';

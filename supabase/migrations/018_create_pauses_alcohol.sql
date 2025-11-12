-- Migration: Create treatment_pauses and alcohol_logs tables
-- C5 - Pausas e Álcool

-- 1. Create treatment_pauses table
CREATE TABLE IF NOT EXISTS public.treatment_pauses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,

  -- Pause details
  start_date DATE NOT NULL,
  end_date DATE, -- null if pause is active
  reason TEXT, -- Optional: vacation, side effects, etc.
  notes TEXT, -- Optional additional notes

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Foreign key to users table (clerk_id)
  CONSTRAINT treatment_pauses_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(clerk_id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS treatment_pauses_user_id_idx ON public.treatment_pauses(user_id);
CREATE INDEX IF NOT EXISTS treatment_pauses_start_date_idx ON public.treatment_pauses(user_id, start_date DESC);

-- Enable RLS
ALTER TABLE public.treatment_pauses ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own pauses
CREATE POLICY "Users can view own pauses"
  ON public.treatment_pauses
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pauses"
  ON public.treatment_pauses
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pauses"
  ON public.treatment_pauses
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own pauses"
  ON public.treatment_pauses
  FOR DELETE
  USING (auth.uid() = user_id);

-- 2. Create alcohol_logs table
CREATE TABLE IF NOT EXISTS public.alcohol_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,

  -- Alcohol log details
  date DATE NOT NULL, -- Date of consumption
  consumed BOOLEAN NOT NULL, -- Whether alcohol was consumed
  drinks_count INTEGER CHECK (drinks_count >= 0), -- Optional: number of drinks
  notes TEXT, -- Optional notes

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Foreign key to users table (clerk_id)
  CONSTRAINT alcohol_logs_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(clerk_id) ON DELETE CASCADE,

  -- One log per day per user
  CONSTRAINT alcohol_logs_user_date_unique UNIQUE (user_id, date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS alcohol_logs_user_id_idx ON public.alcohol_logs(user_id);
CREATE INDEX IF NOT EXISTS alcohol_logs_date_idx ON public.alcohol_logs(user_id, date DESC);

-- Enable RLS
ALTER TABLE public.alcohol_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own alcohol logs
CREATE POLICY "Users can view own alcohol logs"
  ON public.alcohol_logs
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own alcohol logs"
  ON public.alcohol_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alcohol logs"
  ON public.alcohol_logs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own alcohol logs"
  ON public.alcohol_logs
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp for treatment_pauses
CREATE OR REPLACE FUNCTION update_treatment_pauses_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER treatment_pauses_updated_at_trigger
BEFORE UPDATE ON public.treatment_pauses
FOR EACH ROW
EXECUTE FUNCTION update_treatment_pauses_updated_at();

-- Create trigger to update updated_at timestamp for alcohol_logs
CREATE OR REPLACE FUNCTION update_alcohol_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER alcohol_logs_updated_at_trigger
BEFORE UPDATE ON public.alcohol_logs
FOR EACH ROW
EXECUTE FUNCTION update_alcohol_logs_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.treatment_pauses IS 'Treatment pauses with start/end dates and reasons';
COMMENT ON COLUMN public.treatment_pauses.end_date IS 'NULL if pause is currently active';
COMMENT ON TABLE public.alcohol_logs IS 'Daily alcohol consumption logs';
COMMENT ON CONSTRAINT alcohol_logs_user_date_unique ON public.alcohol_logs IS 'One log per day per user';

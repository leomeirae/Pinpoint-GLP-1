-- Create daily_nutrition table for tracking nutrition data
CREATE TABLE IF NOT EXISTS public.daily_nutrition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  calories INTEGER,
  protein INTEGER,
  carbs INTEGER,
  fats INTEGER,
  water_ml INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create index on user_id and date for faster queries
CREATE INDEX IF NOT EXISTS idx_daily_nutrition_user_date
  ON public.daily_nutrition(user_id, date DESC);

-- Enable Row Level Security
ALTER TABLE public.daily_nutrition ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies for daily_nutrition
CREATE POLICY "Users can view own nutrition data"
  ON public.daily_nutrition FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition data"
  ON public.daily_nutrition FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition data"
  ON public.daily_nutrition FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition data"
  ON public.daily_nutrition FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_daily_nutrition_updated_at
  BEFORE UPDATE ON public.daily_nutrition
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Migration: Create purchases table and add finance_opt_in to users
-- C4 - Financeiro MVP

-- 1. Add finance_opt_in field to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS finance_opt_in BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.users.finance_opt_in IS 'User opted in to show cost per kg lost metric (default: false)';

-- 2. Create purchases table
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,

  -- Medication details
  medication TEXT NOT NULL, -- 'Mounjaro', 'Ozempic', 'Retatrutida', etc.
  brand TEXT, -- Optional brand name
  dosage NUMERIC NOT NULL, -- Dosage in mg (e.g., 2.5, 5, 7.5, 10, 12.5, 15)

  -- Purchase details
  quantity INTEGER NOT NULL CHECK (quantity > 0), -- Number of pens/vials
  total_price_cents INTEGER NOT NULL CHECK (total_price_cents >= 0), -- Total price in cents (BRL)
  purchase_date DATE NOT NULL, -- Date of purchase
  purchase_location TEXT, -- Optional: pharmacy, clinic, etc.

  -- Optional fields
  notes TEXT, -- Optional notes
  receipt_url TEXT, -- Optional: URL to receipt image in Supabase Storage

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Foreign key to users table (clerk_id)
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id)
    REFERENCES public.users(clerk_id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS purchases_user_id_idx ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS purchases_purchase_date_idx ON public.purchases(purchase_date DESC);
CREATE INDEX IF NOT EXISTS purchases_user_date_idx ON public.purchases(user_id, purchase_date DESC);

-- Enable RLS
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own purchases

-- Policy: Users can view their own purchases
CREATE POLICY "Users can view own purchases"
  ON public.purchases
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own purchases
CREATE POLICY "Users can insert own purchases"
  ON public.purchases
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own purchases
CREATE POLICY "Users can update own purchases"
  ON public.purchases
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own purchases
CREATE POLICY "Users can delete own purchases"
  ON public.purchases
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_purchases_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER purchases_updated_at_trigger
BEFORE UPDATE ON public.purchases
FOR EACH ROW
EXECUTE FUNCTION update_purchases_updated_at();

-- Add comments for documentation
COMMENT ON TABLE public.purchases IS 'Medication purchases tracking for financial analysis';
COMMENT ON COLUMN public.purchases.total_price_cents IS 'Total price in cents (BRL) to avoid floating point precision issues';
COMMENT ON COLUMN public.purchases.receipt_url IS 'Optional URL to receipt image stored in Supabase Storage (path: receipts/{user_id}/{purchase_id}.{ext})';

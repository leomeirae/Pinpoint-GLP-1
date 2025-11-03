-- Fix for SECURITY DEFINER security issue on community_stats view
-- This script removes the SECURITY DEFINER property from the view

-- Step 1: Get the current view definition (for backup)
-- Run this first to see what the view does:
-- SELECT definition FROM pg_views WHERE viewname = 'community_stats';

-- Step 2: Drop the view with SECURITY DEFINER
DROP VIEW IF EXISTS public.community_stats;

-- Step 3: Recreate the view WITHOUT SECURITY DEFINER
-- Note: You may need to adjust this definition based on your actual view
-- If the view doesn't exist or you don't need it, just run the DROP above

-- Option A: If you know the view definition, recreate it here:
-- CREATE VIEW public.community_stats AS
--   SELECT
--     COUNT(DISTINCT user_id) as total_users,
--     COUNT(*) as total_applications,
--     -- Add your original SELECT columns here
--   FROM public.applications;

-- Option B: If you don't need this view at all, leave it dropped (Step 2 is enough)

-- Step 4: Re-apply any grants that were on the old view
-- GRANT SELECT ON public.community_stats TO authenticated;
-- GRANT SELECT ON public.community_stats TO anon;

-- Verification: Check that the view no longer has SECURITY DEFINER
-- SELECT
--   viewname,
--   viewowner,
--   definition
-- FROM pg_views
-- WHERE viewname = 'community_stats';

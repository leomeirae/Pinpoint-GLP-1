-- Verification Script for Migration 001_initial_schema
-- Run this in Supabase SQL Editor after applying the migration

-- ============================================================================
-- 1. CHECK TABLES EXIST
-- ============================================================================
SELECT
  'Tables Check' as test_category,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ PASS - All 4 tables exist'
    ELSE '❌ FAIL - Missing tables (expected 4, found ' || COUNT(*) || ')'
  END as result,
  STRING_AGG(table_name, ', ') as tables_found
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'applications', 'weights', 'settings');

-- ============================================================================
-- 2. CHECK ROW LEVEL SECURITY IS ENABLED
-- ============================================================================
SELECT
  'RLS Check' as test_category,
  CASE
    WHEN COUNT(*) = 4 THEN '✅ PASS - RLS enabled on all tables'
    ELSE '❌ FAIL - RLS not enabled on all tables'
  END as result,
  STRING_AGG(tablename || ': ' || rowsecurity::text, ', ') as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'applications', 'weights', 'settings');

-- ============================================================================
-- 3. CHECK INDEXES EXIST
-- ============================================================================
SELECT
  'Indexes Check' as test_category,
  CASE
    WHEN COUNT(*) >= 2 THEN '✅ PASS - Required indexes exist'
    ELSE '❌ FAIL - Missing indexes'
  END as result,
  STRING_AGG(indexname, ', ') as indexes_found
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('applications', 'weights')
  AND indexname IN ('idx_applications_user_date', 'idx_weights_user_date');

-- ============================================================================
-- 4. CHECK POLICIES EXIST
-- ============================================================================
SELECT
  'Policies Check' as test_category,
  CASE
    WHEN COUNT(*) >= 10 THEN '✅ PASS - All RLS policies exist'
    ELSE '❌ FAIL - Missing policies (expected at least 10, found ' || COUNT(*) || ')'
  END as result,
  COUNT(*) || ' policies' as policies_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'applications', 'weights', 'settings');

-- ============================================================================
-- 5. CHECK TRIGGERS EXIST
-- ============================================================================
SELECT
  'Triggers Check' as test_category,
  CASE
    WHEN COUNT(*) >= 3 THEN '✅ PASS - All triggers exist'
    ELSE '❌ FAIL - Missing triggers (expected 3, found ' || COUNT(*) || ')'
  END as result,
  STRING_AGG(trigger_name, ', ') as triggers_found
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('profiles', 'applications', 'settings')
  AND trigger_name LIKE '%updated_at%';

-- ============================================================================
-- 6. CHECK FUNCTION EXISTS
-- ============================================================================
SELECT
  'Functions Check' as test_category,
  CASE
    WHEN COUNT(*) >= 1 THEN '✅ PASS - update_updated_at_column function exists'
    ELSE '❌ FAIL - Missing update_updated_at_column function'
  END as result,
  STRING_AGG(proname, ', ') as functions_found
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- ============================================================================
-- 7. DETAILED TABLE STRUCTURE CHECK
-- ============================================================================
SELECT
  'Table Structure' as test_category,
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('profiles', 'applications', 'weights', 'settings')
ORDER BY table_name, ordinal_position;

-- ============================================================================
-- 8. DETAILED POLICIES LIST
-- ============================================================================
SELECT
  'RLS Policies Details' as test_category,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'applications', 'weights', 'settings')
ORDER BY tablename, policyname;

-- ============================================================================
-- 9. CHECK FOR SECURITY DEFINER VIEWS (Security Audit)
-- ============================================================================
SELECT
  'Security Audit' as test_category,
  CASE
    WHEN COUNT(*) = 0 THEN '✅ PASS - No SECURITY DEFINER views found'
    ELSE '⚠️  WARNING - Found ' || COUNT(*) || ' SECURITY DEFINER views'
  END as result,
  STRING_AGG(viewname, ', ') as definer_views
FROM pg_views
WHERE schemaname = 'public'
  AND definition LIKE '%SECURITY DEFINER%';

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT
  '=== MIGRATION VERIFICATION SUMMARY ===' as summary,
  CASE
    WHEN (
      SELECT COUNT(*) FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('profiles', 'applications', 'weights', 'settings')
    ) = 4
    AND (
      SELECT COUNT(*) FROM pg_tables
      WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'applications', 'weights', 'settings')
      AND rowsecurity = true
    ) = 4
    AND (
      SELECT COUNT(*) FROM pg_policies
      WHERE schemaname = 'public'
      AND tablename IN ('profiles', 'applications', 'weights', 'settings')
    ) >= 10
    THEN '✅ MIGRATION SUCCESSFUL - All checks passed!'
    ELSE '❌ MIGRATION INCOMPLETE - Please review failures above'
  END as overall_status;

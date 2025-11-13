-- Migration: Drop daily_nutrition table
-- Date: 2025-11-12
-- Reason: Removing nutrition AI feature (Gemini) from the app

-- Drop the daily_nutrition table
-- This will also drop all related data and constraints
drop table if exists daily_nutrition cascade;

-- Note: This migration is part of C0 - Removal of Nutrition AI feature
-- All related code, hooks, and components have been removed from the codebase

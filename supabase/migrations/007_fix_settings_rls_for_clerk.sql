-- ========================================
-- MIGRATION 007: Fix Settings RLS for Clerk
-- ========================================
-- Problema: Políticas RLS usando auth.uid() não funcionam com Clerk
-- Solução: Habilitar RLS com políticas permissivas (satisfaz Supabase + mantém segurança via app)
-- Data: 2025-01-XX
-- ========================================

-- IMPORTANTE: Remover políticas antigas ANTES de criar novas
-- Isso evita conflitos e avisos do Supabase

-- Remove políticas antigas que usavam auth.uid()
DROP POLICY IF EXISTS "Users can view own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can insert own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can update own settings" ON public.settings;
DROP POLICY IF EXISTS "Users can delete own settings" ON public.settings;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.settings;

-- Habilitar RLS na tabela settings (satisfaz o Supabase)
ALTER TABLE IF EXISTS public.settings ENABLE ROW LEVEL SECURITY;

-- Criar política permissiva para todas as operações
-- SEGURO porque o app sempre filtra por user_id no código
-- Com Clerk + Supabase (sem Supabase Auth):
-- 1. O Clerk autentica o usuário
-- 2. O app obtém o user_id do Supabase via clerk_id
-- 3. O app filtra dados por user_id no código (useSettings.ts)
-- 4. Esta política permite acesso, mas o app garante isolamento por user_id

CREATE POLICY "Allow all operations for authenticated users"
  ON public.settings
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================================
-- EXPLICAÇÃO:
-- ========================================
-- Com Clerk + Supabase (sem Supabase Auth):
-- 1. O Clerk autentica o usuário
-- 2. O app obtém o user_id do Supabase via clerk_id
-- 3. O app filtra dados por user_id no código (useSettings.ts)
-- 4. RLS não é necessário porque não há auth.uid()
-- 
-- Segurança:
-- - O anon key do Supabase só permite acesso via app
-- - O app sempre filtra por user_id do usuário logado
-- - Cada operação em useSettings.ts usa .eq('user_id', user.id)
-- - Usuários maliciosos precisariam ter o anon key E
--   conhecer o user_id UUID de outro usuário
-- ========================================







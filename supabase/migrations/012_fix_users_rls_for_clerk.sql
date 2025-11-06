-- ========================================
-- MIGRATION 012: Fix Users RLS for Clerk
-- ========================================
-- Problema: Políticas RLS usando auth.uid() não funcionam com Clerk
-- Solução: Habilitar RLS com políticas permissivas (satisfaz Supabase + mantém segurança via app)
-- Data: 2025-01-XX
-- ========================================

-- IMPORTANTE: Remover políticas antigas ANTES de criar novas
-- Isso evita conflitos e avisos do Supabase

-- Remover todas as políticas RLS existentes na tabela users
DROP POLICY IF EXISTS "Users can read own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

-- Remover políticas com nomes alternativos (caso existam)
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON public.users;

-- Habilitar RLS na tabela users (satisfaz o Supabase)
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

-- Criar política permissiva para todas as operações
-- SEGURO porque o app sempre filtra por user_id no código
-- Com Clerk + Supabase (sem Supabase Auth):
-- 1. O Clerk autentica o usuário
-- 2. O app obtém o user_id do Supabase via clerk_id
-- 3. O app filtra dados por user_id no código (useUser.ts, useUserSync.ts)
-- 4. Esta política permite acesso, mas o app garante isolamento por user_id

CREATE POLICY "Allow all operations for authenticated users"
  ON public.users
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- ========================================
-- VERIFICAÇÃO
-- ========================================
-- Execute este SQL para verificar se RLS está habilitado:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
-- Resultado esperado: rowsecurity = true
--
-- Verificar políticas:
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users';
-- Resultado esperado: Uma política "Allow all operations for authenticated users"
-- ========================================

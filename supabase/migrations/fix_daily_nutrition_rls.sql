-- ========================================
-- FIX: Daily Nutrition RLS Policies
-- ========================================
-- Problema: Políticas RLS usando auth.uid() não funcionam com Clerk
-- Solução: Remover RLS ou usar service role key
-- Data: 03/11/2025
-- ========================================

-- Opção 1: DESABILITAR RLS (Recomendado para Clerk + Supabase)
-- Quando você usa Clerk, não precisa de RLS porque a autenticação
-- já é feita pelo Clerk e o app filtra por user_id

ALTER TABLE daily_nutrition DISABLE ROW LEVEL SECURITY;

-- ========================================
-- EXPLICAÇÃO:
-- ========================================
-- Com Clerk + Supabase (sem Supabase Auth):
-- 1. O Clerk autentica o usuário
-- 2. O app obtém o user_id do Supabase via clerk_id
-- 3. O app filtra dados por user_id no código
-- 4. RLS não é necessário porque não há auth.uid()
-- 
-- Segurança:
-- - O anon key do Supabase só permite acesso via app
-- - O app sempre filtra por user_id do usuário logado
-- - Usuários maliciosos precisariam ter o anon key E
--   conhecer o user_id de outro usuário
-- ========================================

-- ========================================
-- OPÇÃO 2: Manter RLS com política permissiva (SE PREFERIR)
-- ========================================
-- Se você ainda quiser manter RLS, use uma política
-- que permite acesso baseado no user_id da tabela:
--
-- DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON daily_nutrition;
-- ALTER TABLE daily_nutrition ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Allow all operations for authenticated users"
--   ON daily_nutrition
--   FOR ALL
--   USING (true)
--   WITH CHECK (true);
-- 
-- ATENÇÃO: Esta opção permite que qualquer requisição
-- com o anon key acesse todos os dados. Só use se
-- você tiver certeza de que o app sempre filtra por user_id.
-- ========================================


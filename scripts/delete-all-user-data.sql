-- ========================================
-- Script para deletar todos os dados dos usuários
-- ========================================
-- Este script deleta todos os dados de todas as tabelas
-- para permitir testar como um novo usuário
-- ========================================

-- IMPORTANTE: Deletar das tabelas filhas primeiro (devido a foreign keys)
-- Mesmo com CASCADE, é mais seguro deletar explicitamente

-- 1. Deletar dados das tabelas filhas
DELETE FROM public.side_effects;
DELETE FROM public.medication_applications;
DELETE FROM public.weight_logs;
DELETE FROM public.daily_nutrition;
DELETE FROM public.daily_streaks;
DELETE FROM public.achievements;
DELETE FROM public.scheduled_notifications;
DELETE FROM public.subscriptions;
DELETE FROM public.settings;
DELETE FROM public.medications;

-- 2. Deletar dados da tabela principal (users)
-- Isso também deletará automaticamente dados relacionados devido a CASCADE
DELETE FROM public.users;

-- ========================================
-- VERIFICAÇÃO
-- ========================================
-- Execute estas queries para verificar se os dados foram deletados:
-- SELECT COUNT(*) FROM public.users; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.medications; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.medication_applications; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.weight_logs; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.side_effects; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.settings; -- Deve retornar 0
-- SELECT COUNT(*) FROM public.daily_nutrition; -- Deve retornar 0
-- ========================================


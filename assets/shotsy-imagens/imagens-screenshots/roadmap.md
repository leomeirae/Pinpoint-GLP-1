roadmap (alto nível)

Fase 0 — Setup & fundações: criar app Expo (TS), dependências, EAS, estrutura de pastas, variáveis de ambiente, CI leve.

Fase 1 — Autenticação & paywall: Clerk (providers, rotas protegidas), “MounjaroAI+” (gating) com Clerk + Stripe (via Clerk Payments) e telas de onboarding.

Fase 2 — Banco & modelo de dados: Supabase (DDL via MCP), RLS/policies, clientes TypeScript e serviços.

Fase 3 — Navegação & skeleton de telas: tabs/pilhas; Home/Resumo, Injeções, Resultados, Registro (proteína/calorias/água), Configurações.

Fase 4 — Injeções (MVP completo): CRUD, histórico, rotação de locais, lembretes (expo-notifications), cálculo de níveis estimados (decay t½≈5d).

Fase 5 — Resultados & metas: peso/IMC, meta e ETA, gráficos (rn-svg + victory native), insights básicos.

Fase 6 — Registro nutricional/hidratação: metas de proteína, calorias, água; correlações simples com sintomas.

Fase 7 — Relatórios & export: PDF médico (expo-print/pdf-lib).

Fase 8 — Polimento & publicação: deep links, ícones/temas, performance, TestFlight/Play, privacidade.
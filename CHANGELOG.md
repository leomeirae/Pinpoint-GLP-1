# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

---

## [2.0.0] - 2025-11-12

### 🎉 Release: Refatoração Completa (C0-C7)

Refatoração completa do aplicativo com foco em simplicidade, compliance LGPD e novas funcionalidades essenciais.

### Adicionado

#### C1 - Onboarding Core
- **5 telas simplificadas** de onboarding (anteriormente 23):
  - Welcome.tsx - Boas-vindas com animações
  - Compliance.tsx - LGPD compliance + disclaimers clínicos
  - Medication-dose.tsx - Seleção de medicação e dosagem
  - Schedule.tsx - Dia e horário preferido
  - Permissions.tsx - Permissões de notificação
  - Feature-hook.tsx - Showcase de features
- **Integração com Supabase** para persistência de dados de onboarding
- **Migration 016**: campos de onboarding na tabela users
- **AsyncStorage** sincronizado com Supabase
- **Validações impeditivas**: doses condicionadas por medicamento

#### C2 - Notificações Semanais
- **Lembretes semanais configuráveis** (dia + horário)
- **Tela de edição de lembretes** (edit-reminder.tsx)
- **Integração com onboarding** (configuração inicial)
- **Funções de notificação**:
  - scheduleWeeklyMedicationReminder()
  - updateWeeklyMedicationReminder()
  - cancelWeeklyMedicationReminder()
  - getScheduledMedicationReminder()
- **Suporte a timezone** e DST (horário de verão)

#### C3 - Coachmarks + Quick Actions
- **Sistema de coachmarks** contextuais:
  - CoachmarkContext.tsx - State management
  - CoachmarkOverlay.tsx - UI overlay
  - Persistência em AsyncStorage (exibe apenas 1x)
- **Quick Actions Card** no dashboard:
  - 5 ações rápidas com deep-links
  - Registrar Dose
  - Registrar Peso
  - Adicionar Compra
  - Pausar Tratamento
  - Marcar Álcool
- **Haptic feedback** em todas as interações

#### C4 - Financeiro MVP
- **CRUD completo de compras** de medicamentos:
  - Tela de resumo (finance/index.tsx)
  - Tela de adicionar compra (finance/add-purchase.tsx)
  - Tela de editar compra (finance/edit-purchase.tsx)
- **Hook usePurchases.ts** com CRUD
- **lib/finance.ts** com cálculos financeiros:
  - formatCurrency(): BRL (R$ 1.234,56)
  - calculateTotalSpent()
  - calculateWeeklySpent()
  - calculateCostPerKg() (opt-in obrigatório)
  - predictNextPurchase()
- **Migration 017**: tabela purchases + campo finance_opt_in
- **Componentes**:
  - FinancialSummaryCard
  - PurchaseListItem
- **Estados vazios** amigáveis
- **Dark mode** completo

#### C5 - Pausas e Álcool
- **Sistema de pausas no tratamento**:
  - Tela treatment/pause.tsx
  - Hook useTreatmentPauses.ts
  - Cancelamento automático de lembretes ao pausar
  - Reagendamento automático ao retomar
  - Timeline de pausas anteriores
- **Registro de consumo de álcool**:
  - Tela habits/alcohol.tsx
  - Hook useAlcoholLogs.ts
  - Toggle diário de consumo
  - Calendário visual de 30 dias
  - One log per day (constraint unique)
- **Migration 018**: tabelas treatment_pauses e alcohol_logs
- **Funções de notificação**:
  - pauseReminders()
  - resumeReminders()
- **Nota de privacidade** LGPD

#### C6 - Analytics Opt-in
- **Opt-in obrigatório** para analytics:
  - getAnalyticsOptIn() com in-memory cache
  - setAnalyticsOptIn() (AsyncStorage + Supabase)
  - clearAnalyticsOptInCache()
- **Tela de privacidade** (privacy.tsx):
  - Toggle de analytics
  - Explicação do que coletamos
  - Conformidade LGPD
- **Fail-safe default**: analyticsOptIn = false
- **Bloqueio total**: trackEvent() verifica opt-in antes de enviar
- **[OPT-OUT] logging** para eventos bloqueados
- **Integração com auth**: clearAnalyticsOptInCache() no logout/delete

#### C7 - QA & Compliance
- **Checklist de QA completo** (docs/qa-checklist.md):
  - Funcionalidade
  - Compliance LGPD/GDPR
  - Acessibilidade (WCAG 2.1 AA)
  - UX
  - Performance
  - Compatibilidade
  - Segurança
- **Documentação atualizada**:
  - README.md com novas features
  - CHANGELOG.md completo
  - Planejamento de refatoração

### Modificado

#### Onboarding
- **Simplificado de 23 para 5 telas** (redução de 78%)
- **Foco em compliance** LGPD desde o início
- **Disclaimers clínicos** obrigatórios
- **Checkbox de consentimento** impeditivo

#### Dashboard
- **QuickActionsCard** integrado com 5 ações
- **Coachmarks** tour inicial (2 coachmarks principais)
- **FadeInView animations** em todos os cards

#### Notificações
- **lib/notifications.ts** expandido:
  - Suporte a lembretes semanais
  - Funções de pause/resume
  - Validações de timezone
- **Sem emojis** nos títulos de notificação (diretrizes App Store)

#### Analytics
- **lib/analytics.ts** refatorado:
  - Verificação de opt-in obrigatória
  - In-memory cache para performance
  - Logs detalhados de [OPT-IN]/[OPT-OUT]

### Removido

#### C0 - Preparação
- **Daily Nutrition** - Feature removida completamente
  - app/(tabs)/daily-nutrition/
  - components/daily-nutrition/
  - hooks/useDailyNutrition.ts
  - Migration 015: DROP TABLE daily_nutrition
- **Onboarding legado** (18 telas):
  - Telas de nutrição (4 telas)
  - Telas de comportamento (3 telas)
  - Telas de treino (2 telas)
  - Telas de sono (2 telas)
  - Telas de hidratação (2 telas)
  - Telas de humor (2 telas)
  - Telas de comunidade (1 tela)
  - Telas de gamificação (2 telas)
- **Código duplicado** e não-utilizado
- **Emojis** de notificações e títulos

### Corrigido

- **Analytics enviando sem opt-in** → Bloqueio total implementado
- **Notificações com emojis** → Removidos para compliance
- **Onboarding muito longo** → Reduzido para 5 telas
- **Frequência diária para GLP-1** → Validação impeditiva (apenas semanal/bisemanal)
- **Dark mode inconsistente** → Suporte completo em todas as telas
- **SafeArea missing** → Implementado em todas as novas telas

### Segurança

- **RLS (Row Level Security)** ativado em todas as tabelas novas:
  - purchases
  - treatment_pauses
  - alcohol_logs
- **Criptografia em repouso** (Supabase AES-256)
- **HTTPS/TLS 1.3** em trânsito
- **Cascade delete** em foreign keys
- **Analytics opt-in** com fail-safe
- **Dados sensíveis** nunca em logs

### Compliance

- **LGPD/GDPR compliance**:
  - Opt-in obrigatório para analytics
  - Disclaimers clínicos visíveis
  - Consentimento auditável
  - Deleção completa de dados ao apagar conta
- **App Store guidelines**:
  - Sem review pedido no onboarding
  - Sem emojis em notificações
  - SafeArea respeitado
- **Acessibilidade**:
  - Contraste ≥ 4.5:1 (WCAG AA)
  - Touch areas ≥ 44×44px
  - accessibilityLabel em todos os elementos interativos
  - Screen reader support (VoiceOver/TalkBack)

### Performance

- **In-memory cache** para analytics opt-in
- **AsyncStorage** para persistência offline
- **FadeInView animations** otimizadas
- **Lazy loading** de componentes pesados
- **Image optimization** em assets

### Breaking Changes

⚠️ **Atenção**: Esta é uma versão major com breaking changes significativos.

1. **Onboarding**: Usuários existentes não serão afetados, mas novos usuários verão 5 telas em vez de 23
2. **Daily Nutrition**: Feature removida completamente. Dados existentes foram migrados/arquivados
3. **Analytics**: Opt-in agora é obrigatório. Usuários sem opt-in não terão eventos rastreados
4. **Notificações**: Sistema de lembretes reescrito. Usuários devem reconfigurar horários

### Migração

Para usuários atualizando de v1.x para v2.0:

1. **Notificações**: Reconfigurar horário de lembretes em Settings → Editar horário
2. **Analytics**: Revisar configurações de privacidade em Settings → Privacidade
3. **Dados financeiros**: Adicionar compras manualmente (não há importação automática)

### Estatísticas

- **Commits**: 6 (1c24838, 0d04e9e, 5ae305b, 058f3cb, 7c5f67e, 79d5bed)
- **Arquivos adicionados**: ~40
- **Arquivos removidos**: ~30
- **Linhas de código**: +8,000 / -6,000
- **Migrations**: 4 novas (015, 016, 017, 018)
- **Telas**: 5 onboarding + 7 features novas
- **Hooks**: 3 novos (usePurchases, useTreatmentPauses, useAlcoholLogs)

---

## [1.0.0] - 2024-10-01

### Release Inicial

- Onboarding com 23 telas
- Dashboard completo
- Registro de aplicações
- Gráficos de progresso
- Sistema de autenticação (Clerk)
- Database (Supabase)
- Analytics básico
- Temas personalizados (8 temas)

---

## Formato de Versões

Este changelog segue o formato [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

### Tipos de mudanças:
- **Adicionado** para novas funcionalidades
- **Modificado** para mudanças em funcionalidades existentes
- **Descontinuado** para funcionalidades que serão removidas
- **Removido** para funcionalidades removidas
- **Corrigido** para correção de bugs
- **Segurança** para vulnerabilidades

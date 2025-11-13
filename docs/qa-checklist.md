# QA Checklist - Pinpoint GLP-1 Refatoração

Checklist de qualidade, compliance e acessibilidade para validação antes do release.

**Responsável:** QA Team
**Data:** Novembro 2025
**Versão:** 1.0.0

---

## 1. Funcionalidade

### C1 - Onboarding Core (5 telas)
- [ ] Welcome.tsx: animações funcionam, botão "Começar" redireciona
- [ ] Compliance.tsx: checkboxes obrigatórios, não avança sem aceitar
- [ ] Medication-dose.tsx: todas as medicações disponíveis, doses corretas
- [ ] Schedule.tsx: todos os dias da semana selecionáveis, time picker funcional
- [ ] Permissions.tsx: solicita permissões de notificação corretamente
- [ ] Feature-hook.tsx: salva dados no Supabase e redireciona para dashboard
- [ ] Onboarding completo persiste dados corretamente
- [ ] AsyncStorage sincroniza com Supabase

### C2 - Notificações Semanais
- [ ] Notificação agenda corretamente no dia/hora preferido
- [ ] Notificação dispara no horário correto (testar timezone local)
- [ ] Notificação abre tela correta ao tocar (deep-link)
- [ ] Edit-reminder.tsx atualiza horário e reagenda notificação
- [ ] Notificação persiste após restart do app
- [ ] Notificação persiste após reboot do dispositivo

### C3 - Coachmarks + Quick Actions
- [ ] Coachmarks exibem apenas 1x (não repetem)
- [ ] Coachmark overlay com fundo escuro visível
- [ ] Botão "Pular tour" funciona
- [ ] Botão "Entendi" avança para próximo coachmark
- [ ] AsyncStorage persiste coachmarks visualizados
- [ ] QuickActionsCard exibe 5 ações corretamente
- [ ] Deep-links das Quick Actions funcionam
- [ ] Haptic feedback funciona em todas as interações

### C4 - Financeiro MVP
- [ ] CRUD de compras funcional (criar, editar, deletar)
- [ ] Cálculo de total gasto correto
- [ ] Cálculo de R$/semana correto
- [ ] Cálculo de R$/kg correto (se opt-in e dados de peso)
- [ ] Previsão de próxima compra funcional (2+ compras)
- [ ] Estados vazios claros
- [ ] Validação de formulário impede salvar dados inválidos
- [ ] Formatação BRL correta (R$ 1.234,56)
- [ ] Dark mode funcional

### C5 - Pausas e Álcool
- [ ] Pausar tratamento cancela notificações
- [ ] Retomar tratamento reagenda notificações
- [ ] Timeline de pausas exibe corretamente
- [ ] Cálculo de duração de pausas correto
- [ ] Toggle de álcool salva corretamente
- [ ] Calendário de álcool exibe últimos 30 dias
- [ ] Um log por dia (constraint unique funciona)
- [ ] Dark mode funcional

### C6 - Analytics Opt-in
- [ ] **CRÍTICO:** Analytics NUNCA dispara sem opt-in = true
- [ ] Teste: desligar opt-in → verificar console → zero eventos de rede
- [ ] Opt-in padrão = false para novos usuários
- [ ] Tela de privacidade toggle funciona
- [ ] AsyncStorage sincroniza com Supabase
- [ ] Logout limpa cache de analytics
- [ ] Deletar conta limpa todos os dados de analytics

---

## 2. Compliance LGPD/GDPR

### Consentimento
- [ ] **Compliance.tsx:** Checkbox obrigatório para prosseguir
- [ ] **Disclaimer clínico visível:** "Este app não substitui orientação médica"
- [ ] **Opt-in analytics explícito:** Usuário deve marcar checkbox
- [ ] **Opt-in padrão = false:** Fail-safe para privacidade
- [ ] **Histórico de consentimentos:** Auditável (tabela consent_history)

### Dados Sensíveis
- [ ] **Dados de saúde criptografados em repouso** (Supabase AES-256)
- [ ] **HTTPS/TLS 1.3 em trânsito** (todas as chamadas Supabase)
- [ ] **RLS (Row Level Security) ativado** em todas as tabelas
- [ ] **Usuário só acessa próprios dados** (policies corretas)

### Deleção de Dados
- [ ] Deletar conta remove todos os dados do usuário
- [ ] Cascade delete funciona (foreign keys)
- [ ] Analytics opt-out para de enviar eventos imediatamente

### Medicamentos GLP-1
- [ ] **SEM frequência "diária"** (GLP-1 é semanal/bisemanal)
- [ ] **Doses condicionadas por medicamento** (validação impeditiva)
- [ ] **Marca/Copy clínica:** Nome genérico prioritário
- [ ] **Disclaimer:** "Consulte seu médico antes de qualquer alteração"

---

## 3. Acessibilidade (WCAG 2.1 AA)

### Contraste de Cores
- [ ] **Contraste ≥ 4.5:1** (texto normal vs fundo)
- [ ] **Contraste ≥ 3:1** (texto grande vs fundo)
- [ ] Validar com ferramenta (WebAIM Contrast Checker, Stark)
- [ ] Dark mode também atende contraste mínimo

### Touch Areas
- [ ] **Todos os botões ≥ 44×44px** (iOS HIG / Material Design)
- [ ] Espaçamento adequado entre elementos interativos
- [ ] Hitslop configurado quando necessário

### Screen Readers (VoiceOver/TalkBack)
- [ ] **accessibilityLabel** em todos os botões/ações
- [ ] **accessibilityHint** onde contexto não é óbvio
- [ ] **accessibilityRole** correto (button, link, etc.)
- [ ] Ordem de leitura lógica
- [ ] Imagens decorativas marcadas como `accessibilityElementsHidden`

### SafeArea
- [ ] **SafeAreaView** em todas as telas novas (C1-C6)
- [ ] Notch/Dynamic Island respeitado (iPhone 14+)
- [ ] Barra de navegação respeitada (Android gesture navigation)
- [ ] Conteúdo não cortado em bordas

### Navegação por Teclado
- [ ] Focus visible em todos os campos
- [ ] Tab order lógico
- [ ] Enter/Space ativam botões

### Tour de Coachmarks
- [ ] Botão "Pular tour" acessível e funcional
- [ ] Screen reader anuncia título e descrição
- [ ] Não bloqueia navegação permanentemente

---

## 4. UX

### Estados Vazios
- [ ] Ilustração + texto claro em todos os estados vazios
- [ ] CTA óbvio (ex: "Adicionar primeira compra")
- [ ] Sem telas completamente brancas/vazias

### Feedback Visual
- [ ] Loading states em todas as operações assíncronas
- [ ] Success feedback após salvar (toast, alert, haptic)
- [ ] Error feedback claro com mensagem útil
- [ ] Haptic feedback em ações importantes

### Transições
- [ ] Transições suaves entre telas
- [ ] Animações não causam jank/lag
- [ ] FadeInView funciona em todas as telas

### Validações de Formulário
- [ ] Campos obrigatórios marcados claramente
- [ ] Validação em tempo real ou ao submit
- [ ] Mensagens de erro específicas (não genéricas)
- [ ] Não permite salvar dados inválidos

### Onboarding
- [ ] **SEM pedido de review no onboarding** (App Store guidelines)
- [ ] Progresso visível (ex: "Passo 2 de 5")
- [ ] Botão "Voltar" funciona onde apropriado
- [ ] Não força decisões irreversíveis

---

## 5. Performance

### Tempo de Carregamento
- [ ] Dashboard carrega em < 2s
- [ ] Transições entre telas < 300ms
- [ ] Sem frame drops perceptíveis

### Memória
- [ ] Sem memory leaks em uso prolongado
- [ ] App não crashea após 30min de uso
- [ ] Imagens otimizadas

### Rede
- [ ] Retry lógica em falhas de rede
- [ ] Timeout configurado (não infinito)
- [ ] Offline-first onde possível (AsyncStorage)

---

## 6. Compatibilidade

### iOS
- [ ] iOS 13+ suportado
- [ ] iPhone SE (tela pequena) funcional
- [ ] iPhone 14 Pro (Dynamic Island) funcional
- [ ] iPad (layout responsivo)

### Android
- [ ] Android 10+ suportado
- [ ] Diferentes tamanhos de tela (small, normal, large)
- [ ] Gesture navigation funcional
- [ ] Material Design respeitado

### Dark Mode
- [ ] **Todas as telas C1-C6 funcionam em dark mode**
- [ ] Cores adaptam corretamente
- [ ] Contraste mantido
- [ ] Sem "flash" branco ao alternar

---

## 7. Segurança

### Autenticação
- [ ] Clerk auth funciona
- [ ] Token refresh automático
- [ ] Logout limpa tokens

### Dados
- [ ] Senhas nunca logadas
- [ ] Tokens nunca expostos em logs
- [ ] Dados sensíveis não em AsyncStorage plain text

### Permissions
- [ ] Permissões solicitadas com contexto claro
- [ ] App funciona se usuário negar permissões (graceful degradation)

---

## 8. Testes Específicos de Edge Cases

### Onboarding
- [ ] Fechar app no meio do onboarding → retoma de onde parou
- [ ] Perder conexão durante salvamento → retry ou erro claro
- [ ] Timezone diferente → notificações no horário correto

### Notificações
- [ ] Trocar fuso horário → notificações ajustam
- [ ] DST (horário de verão) → notificações ajustam
- [ ] App fechado → notificação ainda dispara
- [ ] App em background → notificação ainda dispara

### Financeiro
- [ ] R$/kg com peso = 0 → não divide por zero
- [ ] R$/kg sem opt-in → métrica oculta
- [ ] Previsão com 1 compra → "Dados insuficientes"

### Pausas
- [ ] Pausar múltiplas vezes → histórico correto
- [ ] Retomar sem pausar → erro/aviso claro
- [ ] Pausar + deletar app + reinstalar → estado correto

---

## 9. Checklist de Deploy

### Pre-Release
- [ ] Versão atualizada em app.json
- [ ] Changelog atualizado
- [ ] README atualizado
- [ ] Screenshots atualizados
- [ ] Vídeos/GIFs documentados

### Release
- [ ] Build de produção testado
- [ ] Sentry/error tracking configurado
- [ ] Analytics configurado (se opt-in)
- [ ] App Store Connect metadata preenchido
- [ ] Google Play Console metadata preenchido

---

## 10. Sign-off

**QA Lead:** _____________________ Data: _____
**Compliance Officer:** _____________________ Data: _____
**Product Manager:** _____________________ Data: _____

---

## Notas

- Todos os itens marcados devem ser **100% verde** antes do release
- Qualquer item **crítico** bloqueante deve ser resolvido antes de prosseguir
- Bugs não-bloqueantes devem ser documentados e priorizados para próximo release

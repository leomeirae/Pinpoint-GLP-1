# Pinpoint GLP-1

**Aplicativo para acompanhamento de medicamentos GLP-1 (Mounjaro, Ozempic, Saxenda, Wegovy)**

---

## 📱 Sobre o Projeto

O Pinpoint GLP-1 é um aplicativo React Native desenvolvido com Expo que ajuda usuários a acompanhar suas aplicações de medicamentos GLP-1, monitorar progresso de peso, registrar efeitos colaterais e manter um histórico completo de sua jornada.

### Funcionalidades Principais

- 📊 **Dashboard Completo** - Visão geral do progresso e próximas aplicações
- 💉 **Registro de Aplicações** - Controle de doses, locais e horários
- 📈 **Gráficos de Progresso** - Acompanhamento de peso e níveis estimados de medicação
- 🎓 **Onboarding Simplificado** - 5 telas focadas (Boas-vindas, Compliance, Medicação, Agendamento, Permissões)
- 🔔 **Lembretes Semanais** - Notificações configuráveis por dia e horário preferido
- 💰 **Financeiro MVP** - Controle de gastos, R$/semana, previsão de compras (R$/kg opcional com opt-in)
- ⏸️ **Pausas no Tratamento** - Sistema de pausas com desligamento automático de lembretes
- 🍷 **Registro de Álcool** - Calendário discreto de consumo com privacidade garantida
- 🎯 **Quick Actions** - 5 ações rápidas para funcionalidades mais usadas
- 🎓 **Coachmarks** - Tour guiado contextual (exibe apenas 1x)
- 🔒 **Privacidade LGPD** - Analytics opt-in obrigatório, fail-safe default (false)
- 🌙 **Dark Mode** - Suporte completo em todas as telas

---

## 🛠️ Stack Tecnológica

- **Framework:** Expo SDK 54+
- **Linguagem:** TypeScript (strict mode)
- **Autenticação:** Clerk
- **Database:** Supabase
- **Estilo:** StyleSheet nativo do React Native
- **Analytics:** Sistema próprio com tracking de eventos

---

## 📚 Documentação

### Documentos Principais

- **[DOCS-INDEX.md](./DOCS-INDEX.md)** - Índice completo da documentação
- **[docs/PLANEJAMENTO_REFATORACAO.md](./docs/PLANEJAMENTO_REFATORACAO.md)** - Planejamento detalhado da refatoração (C0-C7)
- **[docs/qa-checklist.md](./docs/qa-checklist.md)** - Checklist de QA e compliance
- **[PARITY-ANALYSIS-SUMMARY.md](./PARITY-ANALYSIS-SUMMARY.md)** - Análise de paridade com Shotsy
- **[IMPLEMENTATION-PHASES.md](./IMPLEMENTATION-PHASES.md)** - Fases de implementação
- **[DATA-MODEL-MAP.md](./DATA-MODEL-MAP.md)** - Mapeamento do modelo de dados

### Documentação Estruturada

- **[docs/README.md](./docs/README.md)** - Documentação técnica detalhada
- **[docs/guides/QUICK-START.md](./docs/guides/QUICK-START.md)** - Guia de início rápido
- **[docs/technical/ARCHITECTURE.md](./docs/technical/ARCHITECTURE.md)** - Arquitetura do sistema

### Especificações

- **[TRACKING-EVENTS-SPEC.md](./TRACKING-EVENTS-SPEC.md)** - Eventos de analytics
- **[MICROCOPY-TABLE.md](./MICROCOPY-TABLE.md)** - Textos da interface
- **[PARITY-BACKLOG.md](./PARITY-BACKLOG.md)** - Backlog de desenvolvimento

---

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 18+
- Expo CLI
- Conta Supabase
- Conta Clerk

### Instalação

```bash
# Clone o repositório
git clone https://github.com/leomeirae/Pinpoint-GLP-1.git
cd Pinpoint-GLP-1

# Instale dependências
npm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute o projeto
npx expo start
```

### Configuração

1. **Supabase:** Configure as tabelas usando os scripts em `supabase/migrations/`
2. **Clerk:** Configure autenticação e webhooks

---

## 📁 Estrutura do Projeto

```
pinpoint-glp-1/
├── app/                    # Expo Router (file-based routing)
│   ├── (auth)/            # Telas de autenticação
│   ├── (tabs)/            # Telas principais (tabs)
│   └── _layout.tsx        # Layout raiz
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de UI básicos
│   └── [feature]/        # Componentes específicos por feature
├── lib/                   # Configurações e utilitários
├── hooks/                 # Custom hooks
├── constants/            # Constantes (cores, temas)
├── docs/                 # Documentação estruturada
├── scripts/              # Scripts utilitários
├── supabase/             # Migrações e configurações DB
└── reference/            # Materiais de referência
```

---

## 🧪 Testes e Qualidade

### Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run lint` - Executa linting
- `npm run type-check` - Verificação de tipos TypeScript

### Verificações

- **[scripts/verify-onboarding.sh](./scripts/verify-onboarding.sh)** - Verifica integridade do onboarding
- **[SQL-VALIDATION.sql](./archive/2025-01/SQL-VALIDATION.sql)** - Validações de banco de dados

---

## 🎯 Roadmap

### ✅ Fase de Refatoração (Concluída - Nov 2025)

**C0 - Preparação:**
- [x] Limpeza de código legado
- [x] Remoção de features não-utilizadas

**C1 - Onboarding Core:**
- [x] 5 telas simplificadas e focadas
- [x] Compliance LGPD com disclaimers clínicos
- [x] Seleção de medicação e dosagem
- [x] Configuração de agendamento
- [x] Permissões de notificação

**C2 - Notificações Semanais:**
- [x] Lembretes configuráveis (dia + horário)
- [x] Tela de edição de lembretes
- [x] Integração com onboarding

**C3 - Coachmarks + Quick Actions:**
- [x] Sistema de coachmarks contextuais (1x)
- [x] 5 Quick Actions no dashboard
- [x] Deep-links funcionais

**C4 - Financeiro MVP:**
- [x] CRUD de compras de medicamentos
- [x] Cálculos: Total gasto, R$/semana, Próxima compra
- [x] R$/kg opcional (atrás de opt-in)
- [x] Formatação BRL correta

**C5 - Pausas e Álcool:**
- [x] Sistema de pausas com timeline
- [x] Cancelamento/reagendamento de lembretes
- [x] Registro diário de consumo de álcool
- [x] Calendário visual de 30 dias

**C6 - Analytics Opt-in:**
- [x] Opt-in obrigatório (fail-safe: false)
- [x] Tela de configurações de privacidade
- [x] Bloqueio total sem consentimento

**C7 - QA & Compliance:**
- [x] Checklist de QA completo
- [x] Documentação atualizada
- [x] Validações de compliance LGPD

### 🚧 Fase 2 - P1 (Próximos passos)

- [ ] Paywall e assinaturas
- [ ] FAQ integrado
- [ ] Exportação de dados (PDF, CSV)
- [ ] Widgets iOS/Android
- [ ] Overlays de álcool em gráficos

### 📋 Fase 3 - P2 (Planejado)

- [ ] Apple Health / Google Fit
- [ ] Compartilhamento social
- [ ] Relatórios avançados
- [ ] Modo offline completo
- [ ] A/B testing de onboarding

---

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Diretrizes

- Siga o TypeScript strict mode
- Mantenha arquivos com máximo 300 linhas
- Documente mudanças significativas
- Teste em iOS e Android

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 📞 Contato

- **Desenvolvedor:** Leonardo Meira
- **Email:** leo@pinpointglp1.app
- **GitHub:** [github.com/leomeirae/Pinpoint-GLP-1](https://github.com/leomeirae/Pinpoint-GLP-1)

---

## 📋 Histórico

- **2025-11:** Refatoração completa (C0-C7) - Onboarding simplificado, Financeiro, Pausas, Álcool, LGPD compliance
- **2025-01:** Limpeza e organização do repositório
- **2024-11:** Implementação do carrossel Shotsy
- **2024-10:** Lançamento da versão P0

**Documentos históricos:** Veja `archive/2025-01/` para documentação de desenvolvimento anterior.

---

_Última atualização: Novembro 2025_

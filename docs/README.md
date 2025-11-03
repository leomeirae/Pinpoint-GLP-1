# Shotsy Documentation Hub

> Documentação completa do projeto Shotsy - Medication Tracker App

## Navegação Rápida

### Para Executivos e Stakeholders
- **[Executive Summary](./planning/EXECUTIVE-SUMMARY.md)** - Visão geral em 1 página
- **[Product Vision](./planning/PRODUCT-VISION.md)** - Visão do produto e diferenciação
- **[Business Metrics](./planning/BUSINESS-METRICS.md)** - KPIs e métricas de sucesso

### Para Product Managers
- **[Roadmap Master](../SHOTSY-THINK-DIFFERENT-ROADMAP.md)** - Roadmap completo detalhado
- **[Phase Checklist](./planning/PHASE-IMPLEMENTATION-CHECKLIST.md)** - Checklist de implementação por fase
- **[Feature Prioritization](./planning/FEATURE-PRIORITIZATION.md)** - Matriz de priorização

### Para Desenvolvedores
- **[Technical Architecture](./technical/ARCHITECTURE.md)** - Arquitetura técnica geral
- **[Tech Stack Guide](./technical/TECH-STACK.md)** - Stack tecnológico detalhado
- **[Implementation Guide](./guides/IMPLEMENTATION-GUIDE.md)** - Guia de implementação
- **[API Documentation](./technical/API-DOCS.md)** - Documentação de APIs

### Para Novos Desenvolvedores (Onboarding)
- **[Quick Start](./guides/QUICK-START.md)** - Começar em 15 minutos
- **[Development Setup](./guides/DEV-SETUP.md)** - Setup completo do ambiente
- **[Code Standards](./guides/CODE-STANDARDS.md)** - Padrões de código
- **[Project Glossary](./guides/GLOSSARY.md)** - Terminologia do projeto

### Para Designers
- **[Design Principles](./planning/DESIGN-PRINCIPLES.md)** - Princípios de design "Think Different"
- **[Design System](./technical/DESIGN-SYSTEM.md)** - Sistema de design e componentes

### Decision Log
- **[Technology Decisions](./decisions/TECH-DECISIONS.md)** - Por que escolhemos cada tecnologia
- **[Architecture Decisions](./decisions/ARCHITECTURE-DECISIONS.md)** - ADRs (Architectural Decision Records)

---

## Estrutura de Documentação

```
docs/
├── README.md                          # Este arquivo - hub central
├── planning/                          # Planejamento e visão
│   ├── EXECUTIVE-SUMMARY.md          # 1 página para executivos
│   ├── PRODUCT-VISION.md             # Visão do produto
│   ├── BUSINESS-METRICS.md           # Métricas de negócio
│   ├── PHASE-IMPLEMENTATION-CHECKLIST.md  # Checklist por fase
│   ├── FEATURE-PRIORITIZATION.md     # Priorização de features
│   └── DESIGN-PRINCIPLES.md          # Princípios de design
├── technical/                         # Documentação técnica
│   ├── ARCHITECTURE.md               # Arquitetura geral
│   ├── TECH-STACK.md                 # Stack tecnológico
│   ├── DESIGN-SYSTEM.md              # Sistema de design
│   ├── API-DOCS.md                   # APIs
│   ├── DATABASE-SCHEMA.md            # Schema do banco
│   └── SECURITY.md                   # Segurança e privacidade
├── guides/                           # Guias práticos
│   ├── QUICK-START.md                # Início rápido
│   ├── DEV-SETUP.md                  # Setup de desenvolvimento
│   ├── IMPLEMENTATION-GUIDE.md       # Guia de implementação
│   ├── CODE-STANDARDS.md             # Padrões de código
│   ├── TESTING-GUIDE.md              # Testes
│   └── GLOSSARY.md                   # Glossário
└── decisions/                        # Log de decisões
    ├── TECH-DECISIONS.md             # Decisões de tecnologia
    └── ARCHITECTURE-DECISIONS.md     # ADRs
```

---

## Como Usar Esta Documentação

### Se você é novo no projeto:
1. Comece com [Executive Summary](./planning/EXECUTIVE-SUMMARY.md)
2. Leia [Product Vision](./planning/PRODUCT-VISION.md)
3. Siga [Quick Start](./guides/QUICK-START.md)
4. Configure ambiente com [Dev Setup](./guides/DEV-SETUP.md)

### Se você vai implementar uma feature:
1. Consulte o [Roadmap Master](../SHOTSY-THINK-DIFFERENT-ROADMAP.md) para contexto
2. Verifique [Phase Checklist](./planning/PHASE-IMPLEMENTATION-CHECKLIST.md)
3. Revise [Technical Architecture](./technical/ARCHITECTURE.md)
4. Siga [Implementation Guide](./guides/IMPLEMENTATION-GUIDE.md)
5. Documente decisões em [Decision Log](./decisions/)

### Se você está fazendo code review:
1. Verifique conformidade com [Code Standards](./guides/CODE-STANDARDS.md)
2. Revise [Testing Guide](./guides/TESTING-GUIDE.md)
3. Consulte [Tech Stack Guide](./technical/TECH-STACK.md) para padrões

---

## Manutenção da Documentação

### Princípios
1. **Documentação viva**: Atualizar junto com código
2. **Single source of truth**: Evitar duplicação
3. **Clareza primeiro**: Escrever para humanos
4. **Exemplos práticos**: Código > teoria
5. **Links entre docs**: Facilitar navegação

### Quando Atualizar
- **Imediatamente**: Mudanças em arquitetura ou decisões técnicas
- **Com a feature**: Nova funcionalidade = documentação atualizada
- **Semanalmente**: Revisão de consistência
- **Mensalmente**: Auditoria completa

### Como Contribuir
1. Identifique gap ou erro na documentação
2. Crie/atualize documento relevante
3. Adicione links cruzados
4. Marque data de atualização
5. PR com label `documentation`

---

## Status da Documentação

| Documento | Status | Última Atualização |
|-----------|--------|-------------------|
| Executive Summary | ✅ Completo | 2025-11-01 |
| Product Vision | ✅ Completo | 2025-11-01 |
| Technical Architecture | ✅ Completo | 2025-11-01 |
| Tech Stack Guide | ✅ Completo | 2025-11-01 |
| Phase Checklist | ✅ Completo | 2025-11-01 |
| Implementation Guide | ✅ Completo | 2025-11-01 |
| Tech Decisions | ✅ Completo | 2025-11-01 |
| Quick Start | ✅ Completo | 2025-11-01 |
| Glossary | ✅ Completo | 2025-11-01 |

---

## Links Úteis

### Projeto
- [GitHub Repository](https://github.com/your-org/shotsy)
- [Roadmap Completo](../SHOTSY-THINK-DIFFERENT-ROADMAP.md)
- [Projeto no Notion/Jira](#)

### Recursos Externos
- [Expo Documentation](https://docs.expo.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [React Native Docs](https://reactnative.dev/)

### Comunidade
- [Slack Channel](#)
- [Weekly Sync Notes](#)
- [Design Files (Figma)](#)

---

**Última Atualização:** 2025-11-01
**Mantido por:** Equipe Shotsy
**Licença:** Proprietary

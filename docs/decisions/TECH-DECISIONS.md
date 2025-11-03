# Technology Decisions Log

> Documentação de decisões tecnológicas do projeto Shotsy

**Propósito:** Manter registro transparente do **por que** escolhemos cada tecnologia, não apenas **o que** usamos.

**Última Atualização:** 2025-11-01

---

## Como Usar Este Documento

Cada decisão segue o formato:

**Tecnologia:** Nome
**Data:** Quando decidimos
**Status:** Active | Deprecated | Under Review
**Decisores:** Quem decidiu
**Contexto:** Problema que estávamos resolvendo
**Alternativas Consideradas:** O que mais avaliamos
**Decisão:** O que escolhemos e por quê
**Consequências:** Trade-offs e implicações
**Próxima Revisão:** Quando reavaliar

---

## Frontend Framework

### React Native (Expo)

**Data:** 2025-10-15
**Status:** Active
**Decisores:** Equipe Core

**Contexto:**
Precisávamos de framework para app mobile multiplataforma (iOS + Android) com:
- Development velocity alta
- Single codebase
- Acesso a features nativas
- Ecosistema robusto

**Alternativas Consideradas:**

1. **Flutter**
   - Pros: Performance excelente, hot reload, widgets ricos
   - Cons: Dart (linguagem menos familiar), ecosistema menor em health tech
   - Por que não: Time tem mais expertise em React/TypeScript

2. **Native (Swift + Kotlin)**
   - Pros: Performance máxima, acesso total a APIs nativas
   - Cons: 2x codebases, 2x tempo de desenvolvimento, custo alto
   - Por que não: Time pequeno, budget limitado

3. **Ionic/Capacitor**
   - Pros: Web tech, reutilizar código web
   - Cons: Performance inferior, feel menos nativo
   - Por que não: UX premium requer feel nativo

**Decisão: React Native (Expo)**

**Por quê:**
- **Velocidade:** Single codebase = 2x mais rápido
- **Expertise:** Time já conhece React
- **TypeScript:** Type safety critical em health app
- **Expo:** Simplifica builds, OTA updates, easy testing
- **Ecosistema:** Libs para tudo que precisamos (charts, animations, health kits)
- **Performance:** Suficiente para nossas necessidades (não é jogo 3D)

**Consequências:**

Positivas:
- Development 2x mais rápido
- Contratar devs mais fácil (React popular)
- Hot reload = iteração rápida
- Expo managed workflow = menos config

Negativas:
- Bundle size maior que native
- Algumas features nativas requerem custom modules
- Performance < native puro (mas ok para nosso caso)
- Dependência do Expo (mitigado: podemos eject)

**Próxima Revisão:** 2025-12-01 (após Fase 3)

---

## Backend & Database

### Supabase (PostgreSQL)

**Data:** 2025-10-15
**Status:** Active
**Decisores:** Equipe Core

**Contexto:**
Precisávamos de backend que oferecesse:
- Database relacional (health data é relacional)
- Real-time capabilities (comunidade)
- Auth (já temos Clerk, mas good to have)
- Storage (imagens, PDFs)
- Serverless functions
- Escalabilidade

**Alternativas Consideradas:**

1. **Firebase**
   - Pros: Ecosistema Google, real-time excelente, fácil setup
   - Cons: NoSQL (nosso data é relacional), vendor lock-in pesado, queries complexas difíceis
   - Por que não: NoSQL não ideal para health data com relationships

2. **Custom Backend (Node + PostgreSQL + AWS)**
   - Pros: Controle total, otimização máxima
   - Cons: Muito setup, DevOps overhead, tempo, custo
   - Por que não: Time pequeno, querer focar em produto

3. **Hasura + PostgreSQL**
   - Pros: GraphQL auto-gerado, real-time, PostgreSQL
   - Cons: Mais complex, menos features out-of-box
   - Por que não: Supabase tem mais batteries included

4. **PlanetScale + tRPC**
   - Pros: MySQL escalável, type-safe APIs
   - Cons: MySQL (preferimos PostgreSQL features), mais peças para gerenciar
   - Por que não: Supabase mais all-in-one

**Decisão: Supabase**

**Por quê:**
- **PostgreSQL:** Melhor para relational health data
- **Real-time:** Built-in (critical para comunidade)
- **Row Level Security:** Privacy por design
- **Storage:** Imagens, PDFs, avatares
- **Edge Functions:** Serverless processing
- **pgvector:** IA/embeddings no futuro (Fase 6)
- **Free tier:** Generoso para MVP
- **Escalabilidade:** Auto-scaling conforme crescemos

**Consequências:**

Positivas:
- Setup rápido (~1 dia vs semanas)
- RLS = security by default
- Real-time sem infra extra
- Migrations versionadas
- Dashboard admin útil
- Backup automático

Negativas:
- Vendor lock-in (mitigado: PostgreSQL standard)
- Menos controle que self-hosted
- Custo pode crescer (mas previsível)
- Debugging mais difícil que código próprio

**Próxima Revisão:** 2026-01-01 (após scale)

---

## Authentication

### Clerk

**Data:** 2025-10-15
**Status:** Active
**Decisores:** Equipe Core

**Contexto:**
Precisávamos de auth robusto com:
- OAuth social (Google, Apple)
- Security (health data = crítico)
- User management
- Multi-factor auth
- Session management

**Alternativas Consideradas:**

1. **Supabase Auth**
   - Pros: Integrado com Supabase, grátis, simple
   - Cons: Menos features que Clerk, UI básico
   - Por que não: Clerk tem UX superior

2. **Auth0**
   - Pros: Enterprise-grade, muito maduro
   - Cons: Caro, complex para nosso tamanho, overkill
   - Por que não: Custo vs benefício

3. **Custom Auth**
   - Pros: Controle total
   - Cons: Security risk, muito trabalho, fácil errar
   - Por que não: "Don't roll your own crypto/auth"

**Decisão: Clerk**

**Por quê:**
- **UX:** Componentes pre-built lindos
- **OAuth:** Google, Apple out-of-box
- **Security:** Enterprise-grade por padrão
- **DX:** SDK excelente para React Native
- **User Management:** Dashboard admin útil
- **Pricing:** Free tier generoso, crescimento previsível

**Consequências:**

Positivas:
- Auth implementado em dias, não semanas
- UX premium sem esforço
- Security battle-tested
- User management fácil

Negativas:
- Custo adicional (~$25/mês após free tier)
- Vendor lock-in (migrar auth é difícil)
- Dependência de serviço externo

**Próxima Revisão:** 2025-12-01

---

## State Management

### Zustand + React Query

**Data:** 2025-10-20
**Status:** Active
**Decisores:** Tech Lead

**Contexto:**
Precisávamos gerenciar:
- Estado global (user, preferences)
- Estado de servidor (API data)
- Cache de dados
- Optimistic updates

**Alternativas Consideradas:**

1. **Redux Toolkit**
   - Pros: Maduro, muito robusto, DevTools
   - Cons: Boilerplate, overkill para nosso tamanho
   - Por que não: Complexidade desnecessária

2. **Context API + useState**
   - Pros: Built-in, zero deps
   - Cons: Re-render issues, sem cache, boilerplate
   - Por que não: Não escala bem

3. **MobX**
   - Pros: Simples, reativo
   - Cons: Menos popular, magic pode confundir
   - Por que não: Preferimos explícito

4. **Recoil**
   - Pros: Moderno, atoms/selectors elegantes
   - Cons: Facebook experimental, menos maduro
   - Por que não: Zustand mais estável

**Decisão: Zustand + React Query**

**Por quê:**
- **Zustand:** Global state minimal, sem boilerplate
- **React Query:** Server state/cache expert
- **Separation of concerns:** Client state (Zustand) vs Server state (React Query)
- **Performance:** Selective re-renders
- **DX:** Simple API, fácil debug
- **Size:** Tiny bundles

**Consequências:**

Positivas:
- Código limpo, pouco boilerplate
- Performance excelente
- Cache automático com React Query
- Optimistic updates fáceis
- DevTools úteis

Negativas:
- Dois sistemas (mas é feature, não bug)
- Curva de aprendizado mínima

**Próxima Revisão:** 2026-01-01

---

## Animations

### React Native Reanimated 3

**Data:** 2025-10-20
**Status:** Active
**Decisores:** Tech Lead

**Contexto:**
Precisávamos de animações:
- 60fps garantido
- Complexas (avatar, micro-interactions)
- Gesture-based
- Performáticas

**Alternativas Consideradas:**

1. **Animated API (built-in)**
   - Pros: Built-in, zero deps
   - Cons: JS thread (não 60fps garantido), limited
   - Por que não: Performance inadequada

2. **Lottie**
   - Pros: Animações designer-made
   - Cons: Apenas playback, sem interatividade
   - Por que não: Precisamos mais que playback

3. **React Native Skia**
   - Pros: Canvas-based, muito poderoso
   - Cons: Low-level, muito código para simple animations
   - Por que não: Overkill para maioria dos casos (usaremos em casos específicos)

**Decisão: Reanimated 3 (+ Skia para casos específicos)**

**Por quê:**
- **UI Thread:** Animações rodam fora do JS thread = 60fps
- **Worklets:** JavaScript no UI thread
- **Gesture Handler:** Integração perfeita
- **Shared Values:** Performance otimizada
- **DX:** API declarativa

**Consequências:**

Positivas:
- Animações buttery smooth
- Gestos naturais
- Performance excelente
- Comunidade ativa

Negativas:
- Bundle size maior
- Debugging mais difícil (worklets)
- Curva de aprendizado

**Próxima Revisão:** N/A (padrão da indústria)

---

## Charts & Data Visualization

### Victory Native XL

**Data:** 2025-10-22
**Status:** Active
**Decisores:** Tech Lead

**Contexto:**
Precisávamos de charts:
- Bonitos e customizáveis
- Performáticos (muitos data points)
- Touch interactions
- Animações

**Alternativas Consideradas:**

1. **react-native-chart-kit**
   - Pros: Simple, popular
   - Cons: Customização limitada, SVG (performance)
   - Por que não: Não suficiente customização

2. **react-native-svg-charts**
   - Pros: Muito customizável
   - Cons: Low-level, muito código
   - Por que não: Muita complexidade

3. **Victory Native (original)**
   - Pros: React-like API
   - Cons: Performance com muitos pontos
   - Por que não: Victory Native XL é evolução

**Decisão: Victory Native XL**

**Por quê:**
- **Skia-based:** Performance excelente
- **Declarativo:** React-like API
- **Customização:** Total controle
- **Animações:** Built-in
- **Gestures:** Touch interactions
- **TypeScript:** Full type safety

**Consequências:**

Positivas:
- Charts lindos e performáticos
- Animações smooth
- Customização total
- Type-safe

Negativas:
- Novo (menos maduro)
- Bundle size
- Menos examples que alternatives

**Próxima Revisão:** 2025-12-01

---

## AI/ML

### OpenAI GPT-4 Turbo + pgvector (futuro)

**Data:** 2025-10-25
**Status:** Active (GPT-4) | Planned (pgvector)
**Decisores:** Tech Lead + Product

**Contexto:**
Precisávamos de IA para:
- Personalização de conteúdo
- Chatbot educacional (Fase 4)
- Pattern detection (Fase 2)
- Insights geração

**Alternativas Consideradas:**

1. **Anthropic Claude**
   - Pros: Excelente para texto longo, safe
   - Cons: Mais caro, menos features
   - Por que não: GPT-4 mais versátil

2. **Open-source models (Llama 2)**
   - Pros: Custo baixo, controle
   - Cons: Hosting, manutenção, qualidade menor
   - Por que não: Quality > cost em health

3. **Google Vertex AI**
   - Pros: Integrado com Google Cloud
   - Cons: Vendor lock-in, menos flexible
   - Por que não: OpenAI API mais friendly

**Decisão: OpenAI GPT-4 Turbo**

**Por quê:**
- **Quality:** Best-in-class para generation
- **API:** Excellent DX
- **Features:** Function calling, JSON mode, etc
- **Embeddings:** text-embedding-3 para RAG
- **Cost:** Reasonable para use case
- **pgvector:** Supabase suporta (Fase 6)

**Consequências:**

Positivas:
- Insights de alta qualidade
- Chatbot inteligente
- RAG para educational content
- API confiável

Negativas:
- Custo variável (mitigar com cache)
- Dependência de OpenAI
- Latência (mitigar com streaming)
- Rate limits

**Mitigações:**
- Cache responses quando possível
- Fallback para templates quando API falhar
- Rate limiting próprio
- Monitoring de custo

**Próxima Revisão:** 2026-01-01

---

## Analytics & Monitoring

### Mixpanel (Analytics) + Sentry (Errors)

**Data:** 2025-10-25
**Status:** Active
**Decisores:** Tech Lead

**Contexto:**
Precisávamos de:
- Product analytics
- Error tracking
- Performance monitoring
- User behavior insights

**Alternativas Consideradas:**

1. **Google Analytics**
   - Pros: Grátis, familiar
   - Cons: Não ideal para app, privacy concerns
   - Por que não: Better alternatives para mobile

2. **Amplitude**
   - Pros: Excelente analytics
   - Cons: Mais caro que Mixpanel
   - Por que não: Custo vs benefício

3. **PostHog**
   - Pros: Open-source, self-hostable
   - Cons: Menos maduro, mais setup
   - Por que não: Preferimos managed

**Decisão: Mixpanel + Sentry**

**Por quê:**

**Mixpanel:**
- Event-based analytics perfeito para app
- Funnels, cohorts, retention
- User profiles
- A/B testing
- Free tier generoso

**Sentry:**
- Best error tracking
- Source maps
- Release tracking
- Performance monitoring
- Breadcrumbs (debug)

**Consequências:**

Positivas:
- Insights profundos de uso
- Bugs caught rapidamente
- Performance issues visíveis
- Data-driven decisions

Negativas:
- Custo (mas worth it)
- Dois sistemas
- Privacy considerations (mitigar com PII scrubbing)

**Próxima Revisão:** 2026-01-01

---

## Styling

### Tamagui (Planejado) | NativeWind (Alternativa)

**Data:** 2025-10-28
**Status:** Under Review
**Decisores:** Tech Lead + Design

**Contexto:**
Precisávamos de sistema de styling:
- Type-safe
- Theme support
- Performance
- DX excelente
- Design tokens

**Alternativas Consideradas:**

1. **StyleSheet (built-in)**
   - Pros: Built-in, familiar
   - Cons: Verbose, sem theming built-in
   - Por que não: Muito manual

2. **Styled Components**
   - Pros: CSS-in-JS familiar
   - Cons: Runtime cost, performance
   - Por que não: Performance concerns

3. **Tamagui**
   - Pros: Type-safe, performático, tokens, components
   - Cons: Learning curve, newer
   - Por que: Promising, design system included

4. **NativeWind**
   - Pros: Tailwind-like, familiar, compile-time
   - Cons: Utility-class verbose
   - Por que: Excelente fallback

**Decisão: Avaliar Tamagui primeiro, fallback para NativeWind**

**Por quê:**
- **Tamagui:** More opinionated design system
- **NativeWind:** Se Tamagui não fit

**Status:** Testing em Fase 1

**Próxima Revisão:** 2025-11-15 (após testing)

---

## Testing

### Jest + React Native Testing Library + Detox

**Data:** 2025-10-28
**Status:** Active
**Decisores:** Tech Lead

**Contexto:**
Precisávamos de testing stack:
- Unit tests
- Component tests
- Integration tests
- E2E tests

**Alternativas Consideradas:**

1. **Maestro (E2E)**
   - Pros: Simpler que Detox, YAML config
   - Cons: Menos maduro
   - Por que talvez: Considerar no futuro

**Decisão:**
- **Unit/Integration:** Jest + React Native Testing Library
- **E2E:** Detox

**Por quê:**
- **Jest:** Padrão da indústria, fast
- **RTL:** Best practices testing
- **Detox:** Maduro, confiável para E2E

**Próxima Revisão:** 2026-01-01

---

## Payments

### RevenueCat

**Data:** 2025-10-29
**Status:** Planned (Fase 8)
**Decisores:** Product + Tech Lead

**Contexto:**
Precisávamos de subscription management:
- IAP (Apple + Google)
- Cross-platform
- Analytics
- Webhooks
- Restore purchases

**Alternativas Consideradas:**

1. **Stripe (direto)**
   - Pros: Controle total, web payments
   - Cons: IAP complex, sem abstractions
   - Por que não: RevenueCat especializado em mobile

2. **Custom (IAP direto)**
   - Pros: Sem custo de terceiro
   - Cons: Complexidade alta, bugs fáceis
   - Por que não: Don't reinvent wheel

**Decisão: RevenueCat**

**Por quê:**
- **Abstração:** Unifica Apple + Google
- **Analytics:** Built-in revenue analytics
- **Webhooks:** Integração backend fácil
- **Trials:** Gestão de trials
- **Restore:** Cross-device/platform
- **DX:** SDK excelente

**Consequências:**
- 1-2% fee (worth it)
- Vendor dependency (mitigável)

**Próxima Revisão:** Fase 8

---

## Decisões Pendentes

### 1. Design System Final
**Status:** Under Review
**Deadline:** Fase 1
**Opções:** Tamagui vs NativeWind
**Próximo Passo:** Prototype comparison

### 2. Notification Service
**Status:** Planned
**Deadline:** Fase 1
**Opções:** Expo Notifications vs OneSignal
**Próximo Passo:** Requirements finalization

### 3. ML Training Infrastructure
**Status:** Planned
**Deadline:** Fase 6
**Opções:** Google Vertex AI vs AWS SageMaker
**Próximo Passo:** Cost analysis

---

## Padrão para Novas Decisões

Quando adicionar nova tecnologia, documente:

```markdown
### [Nome da Tecnologia]

**Data:** YYYY-MM-DD
**Status:** Active | Deprecated | Under Review
**Decisores:** Nomes

**Contexto:**
[Problema que estávamos resolvendo]

**Alternativas Consideradas:**
1. **[Alternativa]**
   - Pros:
   - Cons:
   - Por que não:

**Decisão: [Escolha]**

**Por quê:**
[Razões detalhadas]

**Consequências:**
Positivas:
-
Negativas:
-

**Próxima Revisão:** YYYY-MM-DD
```

---

**Última Atualização:** 2025-11-01
**Próxima Auditoria:** 2025-12-01
**Mantido por:** Tech Lead

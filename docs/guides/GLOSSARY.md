# Shotsy: Glossary & Terminology

> Definições de termos técnicos, de produto e do domínio de saúde

**Última Atualização:** 2025-11-01

---

## Como Usar Este Glossário

- **Termos em negrito** são termos principais
- Links para documentação relacionada quando relevante
- Organizados por categoria e alfabeticamente

---

## Termos do Produto

### **Shotsy**
Nome do produto/app. Derivado de "shot" (injeção) + sufixo amigável. Brand identity: fun, pessoal, empoderador.

### **Think Different**
Filosofia de produto inspirada na Apple. Shotsy não é apenas mais um app de saúde - pensamos diferente sobre UX, privacidade, comunidade.

### **Shotsy Score**
Score holístico (0-100) que mede saúde geral do usuário, composto de:
- Consistency (aderir ao cronograma)
- Progress (progresso em direção a metas)
- Engagement (uso do app)
- Data Quality (completude de dados)

Veja: [Fase 2 do Roadmap](../../SHOTSY-THINK-DIFFERENT-ROADMAP.md)

### **Avatar**
Representação visual personalizada do usuário que:
- Evolui com progresso
- Reage a eventos (conquistas, milestones)
- Expressa personality do usuário

Veja: [Fase 1 do Roadmap](../../SHOTSY-THINK-DIFFERENT-ROADMAP.md)

### **Tone & Voice**
Sistema de personalização de comunicação do app. Usuário escolhe:
- **Communication Style:** coach | friend | scientist | minimalist
- **Humor Level:** 1-5
- **Motivation Type:** data-driven | emotional | balanced

### **Health Story**
Narrativa visual de 30 dias mostrando jornada do usuário com storytelling, não apenas gráficos.

### **Pattern**
Comportamento ou correlação detectada automaticamente nos dados do usuário.
Exemplo: "Você perde mais peso nos fins de semana" ou "Aplicações noturnas resultam em menos side effects".

### **Insight**
Informação acionável gerada a partir de dados do usuário. Diferente de pattern: insight sugere ação.

---

## Termos Médicos/de Saúde

### **GLP-1**
**Glucagon-Like Peptide-1**: Hormônio natural do corpo que regula apetite e açúcar no sangue. Medicações GLP-1 são versões sintéticas/análogas.

### **Mounjaro**
Nome comercial de **tirzepatide**, medicação GLP-1/GIP para diabetes tipo 2 e perda de peso.
- Fabricante: Eli Lilly
- Administração: Injeção subcutânea semanal
- Dosagens: 2.5mg, 5mg, 7.5mg, 10mg, 12.5mg, 15mg

### **Ozempic**
Nome comercial de **semaglutide** (diabetes). Mesmo princípio ativo que Wegovy.
- Fabricante: Novo Nordisk
- Administração: Injeção subcutânea semanal

### **Wegovy**
Nome comercial de **semaglutide** (perda de peso).
- Fabricante: Novo Nordisk
- Administração: Injeção subcutânea semanal

### **Tirzepatide**
Princípio ativo do Mounjaro. Agonista dual GLP-1/GIP.

### **Semaglutide**
Princípio ativo do Ozempic e Wegovy. Agonista GLP-1.

### **Application** (ou Shot)
Ato de injetar medicação GLP-1. No app, registramos:
- Data/hora
- Dosagem (mg)
- Local do corpo (abdômen, coxa, braço)
- Notas opcionais

### **Side Effect**
Efeito colateral da medicação. Comuns em GLP-1:
- Náusea
- Fadiga
- Constipação
- Diarreia
- Dor abdominal

No app, usuários podem rastrear severidade, duração e estratégias que ajudaram.

### **Plateau**
Período onde peso permanece estável apesar de aderência ao tratamento. Normal e esperado em jornadas de perda de peso.

### **Titration**
Processo gradual de aumentar dose de medicação para minimizar side effects e otimizar resultados.

### **Subcutaneous Injection**
Injeção sob a pele (não no músculo). Método de administração de GLP-1s.

---

## Termos Técnicos (Frontend)

### **Expo**
Framework para React Native que simplifica desenvolvimento, build e deploy.
- **Managed Workflow:** Expo cuida de native code
- **Bare Workflow:** Acesso total a native code (após eject)

Veja: [Tech Stack](../technical/TECH-STACK.md)

### **Expo Router**
Sistema de navegação file-based para React Native.
- Baseado em Next.js App Router
- Cada arquivo em `app/` é uma rota
- Suporta layouts, tabs, stacks

### **React Query** (TanStack Query)
Library para data fetching e state management de servidor.
- Cache automático
- Background refetching
- Optimistic updates

### **Zustand**
Library minimalista para global state management.
- Sem boilerplate
- Seletores automáticos
- Persiste state com AsyncStorage

### **Reanimated 3**
Library para animações 60fps em React Native.
- Worklets (JavaScript no UI thread)
- Shared Values
- Gesture Handler integration

### **Skia**
Canvas 2D high-performance para React Native.
- Usado em animações complexas
- Victory Native XL usa Skia para charts

### **Victory Native XL**
Library de charts baseada em Skia.
- Performance excelente
- Altamente customizável
- Touch interactions

### **Tamagui**
Design system e styling library (under evaluation).
- Type-safe
- Theme support
- Performance otimizada

### **NativeWind**
Tailwind CSS para React Native (alternativa a Tamagui).
- Utility-first
- Compile-time
- Familiar para devs web

---

## Termos Técnicos (Backend)

### **Supabase**
Backend-as-a-Service baseado em PostgreSQL.
Componentes:
- **Database:** PostgreSQL gerenciado
- **Auth:** Sistema de autenticação
- **Storage:** Object storage (S3-like)
- **Realtime:** WebSockets para live updates
- **Edge Functions:** Serverless functions (Deno)

Veja: [Architecture](../technical/ARCHITECTURE.md)

### **RLS (Row Level Security)**
Feature do PostgreSQL que garante security no nível de linha.
Exemplo: Usuário só vê seus próprios dados.

```sql
-- Policy: usuário só vê próprias weight entries
CREATE POLICY "Users view own weights"
ON weight_entries FOR SELECT
USING (auth.uid() = user_id);
```

### **pgvector**
Extensão do PostgreSQL para vetores e similarity search.
- Usado para embeddings (Fase 6)
- Enables RAG (Retrieval Augmented Generation)

### **Edge Functions**
Serverless functions rodando na edge (próximo ao usuário).
- Runtime: Deno
- Deploy: Supabase CLI
- Use cases: Webhooks, cron jobs, AI processing

### **Clerk**
Auth-as-a-Service para aplicações modernas.
- OAuth social (Google, Apple)
- User management
- Session handling
- Pre-built UI components

### **PostgREST**
Auto-generated REST API a partir de schema PostgreSQL.
- Usado internamente pelo Supabase
- Queries via URL parameters

---

## Termos de AI/ML

### **LLM (Large Language Model)**
Modelo de IA treinado em grandes volumes de texto.
- Shotsy usa: OpenAI GPT-4 Turbo
- Use cases: Insights personalizados, chatbot educacional

### **RAG (Retrieval Augmented Generation)**
Técnica de combinar LLM com busca em knowledge base.

Processo:
1. User faz pergunta
2. Busca documentos relevantes (vector search)
3. LLM gera resposta baseado em documentos
4. Resultado: respostas baseadas em fontes confiáveis

Veja: [Fase 4 do Roadmap](../../SHOTSY-THINK-DIFFERENT-ROADMAP.md)

### **Embedding**
Representação vetorial de texto.
- Shotsy usa: OpenAI text-embedding-3
- Armazenado em: pgvector
- Usado para: Similarity search

### **TensorFlow Lite**
Versão otimizada de TensorFlow para mobile.
- Modelos on-device (privacy)
- Predições rápidas
- Usado em: Fase 6 (predictive analytics)

### **Federated Learning**
Treinar modelos sem centralizar dados.
- Modelos treinados no device
- Apenas updates agregados enviados ao servidor
- Privacy-preserving

---

## Termos de Comunidade

### **Anonymous Story**
Post da comunidade sem identificação do autor.
- Author ID hasheado
- Zero PII (Personally Identifiable Information)
- Reações anônimas

### **Buddy**
Match anônimo com pessoa em jornada similar.
- Matching baseado em similarity score
- Chat E2E encrypted
- Accountability partner

### **Challenge**
Desafio colaborativo da comunidade.
Tipos:
- **Consistency:** Manter streak por X dias
- **Milestone:** Atingir meta coletiva
- **Support:** Dar apoio a N pessoas

### **Crowd Wisdom**
Agregação anônima de estratégias da comunidade.
Exemplo: "80% da comunidade aplica medicação de manhã"

---

## Termos de DevOps

### **EAS (Expo Application Services)**
Serviço de build e deploy do Expo.
- **EAS Build:** Build nativo na nuvem
- **EAS Submit:** Submit para stores
- **EAS Update:** OTA updates

### **OTA Update (Over-The-Air)**
Atualização de JavaScript bundle sem rebuild.
- Usuário recebe update automaticamente
- Bypass app store review (para JS changes)
- Não funciona para native code changes

### **Sentry**
Platform de error tracking e performance monitoring.
- Crash reports
- Source maps para debugging
- Performance APM
- Release tracking

### **Mixpanel**
Product analytics platform.
- Event-based tracking
- Funnels, cohorts
- User profiles
- A/B testing

### **RevenueCat**
Subscription management para mobile apps.
- Unified API para Apple + Google IAP
- Analytics de receita
- Webhooks
- Restore purchases cross-platform

---

## Termos de Performance

### **TTFB (Time To First Byte)**
Tempo até receber primeiro byte do servidor.
- Target: <200ms

### **FCP (First Contentful Paint)**
Tempo até primeiro elemento visual renderizar.
- Target: <1s

### **LCP (Largest Contentful Paint)**
Tempo até maior elemento visual renderizar.
- Target: <2s

### **TTI (Time To Interactive)**
Tempo até app estar totalmente interativo.
- Target: <2.5s

### **FPS (Frames Per Second)**
Taxa de frames de animações.
- Target: 60fps (16.67ms per frame)

---

## Termos de Testes

### **Unit Test**
Teste de unidade isolada (função, hook, utility).
```typescript
test('calculateBMI returns correct value', () => {
  expect(calculateBMI(70, 1.75)).toBe(22.86);
});
```

### **Component Test**
Teste de componente React isolado.
```typescript
test('Button renders with correct text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### **Integration Test**
Teste de integração entre múltiplas unidades.
```typescript
test('Logging weight updates dashboard', async () => {
  // Test data flow: form → API → database → UI
});
```

### **E2E Test (End-to-End)**
Teste de user journey completo.
```typescript
test('User can sign up and log weight', async () => {
  // Simula usuário real usando app
});
```

### **Coverage**
% do código coberto por testes.
- Target: >80%
- Measure: `npm run test:coverage`

---

## Termos de Segurança

### **E2E Encryption (End-to-End)**
Criptografia onde apenas sender e receiver podem ler mensagem.
- Usado em: Buddy chat (Fase 3)
- Protocol: Signal Protocol

### **HIPAA (Health Insurance Portability and Accountability Act)**
Lei dos EUA sobre privacidade de dados de saúde.
- Shotsy: HIPAA-ready (futuro, Fase 9)
- Requer: Encryption, audit logs, compliance

### **GDPR (General Data Protection Regulation)**
Lei europeia de proteção de dados.
- Right to access
- Right to deletion
- Right to portability

### **PII (Personally Identifiable Information)**
Informação que identifica indivíduo.
Exemplos: nome, email, endereço, foto
- Shotsy minimiza PII em comunidade (anonymous)

### **Hashing**
Transformação one-way de dados.
```typescript
// User ID hasheado para anonymous stories
const authorHash = sha256(userId);
```

---

## Termos de Roadmap

### **MVP (Minimum Viable Product)**
Versão mínima do produto com valor suficiente.
- Shotsy MVP: Fases 1-2-7

### **MoSCoW Prioritization**
Framework de priorização:
- **Must have:** Critical
- **Should have:** Important mas não crítico
- **Could have:** Nice to have
- **Won't have:** Out of scope

### **ADR (Architectural Decision Record)**
Documento que registra decisão arquitetural importante.
Formato: Context → Decision → Consequences

Veja: [Decision Log](../decisions/)

### **Technical Debt**
Atalhos técnicos que precisarão ser refatorados.
- Trade-off: velocidade agora vs custo futuro
- Gerenciar: Documentar e priorizar pagamento

---

## Acrônimos Comuns

### Produto
- **DAU:** Daily Active Users
- **MAU:** Monthly Active Users
- **NPS:** Net Promoter Score
- **MRR:** Monthly Recurring Revenue
- **LTV:** Lifetime Value
- **CAC:** Customer Acquisition Cost
- **ARPU:** Average Revenue Per User

### Técnico
- **API:** Application Programming Interface
- **SDK:** Software Development Kit
- **JWT:** JSON Web Token
- **SQL:** Structured Query Language
- **NoSQL:** Not Only SQL
- **REST:** Representational State Transfer
- **GraphQL:** Graph Query Language
- **CI/CD:** Continuous Integration/Continuous Deployment
- **APM:** Application Performance Monitoring
- **CDN:** Content Delivery Network

### Desenvolvimento
- **PR:** Pull Request
- **WIP:** Work In Progress
- **TDD:** Test-Driven Development
- **DX:** Developer Experience
- **UX:** User Experience
- **UI:** User Interface
- **QA:** Quality Assurance
- **POC:** Proof of Concept

---

## Convenções de Nomenclatura

### Variáveis e Funções
```typescript
// camelCase para variáveis e funções
const userName = "John";
function calculateBMI() {}

// PascalCase para componentes e types
const UserProfile = () => {};
type UserData = {};

// UPPER_CASE para constantes
const MAX_RETRY_ATTEMPTS = 3;

// Prefixos para hooks
const useWeights = () => {};  // use*
const useAuth = () => {};
```

### Arquivos
```
// Components: PascalCase
UserProfile.tsx
WeightChart.tsx

// Utilities: camelCase
formatDate.ts
calculateBMI.ts

// Types: kebab-case ou PascalCase
database.types.ts
UserTypes.ts

// Testes: *.test.tsx ou *.spec.tsx
UserProfile.test.tsx
formatDate.spec.ts
```

### Database
```sql
-- Tabelas: snake_case, plural
CREATE TABLE weight_entries (...);
CREATE TABLE medication_applications (...);

-- Colunas: snake_case
user_id
created_at
weight_kg

-- Indexes: idx_table_column
CREATE INDEX idx_weights_user_date ON weight_entries(user_id, recorded_at);
```

---

## Contribuindo para o Glossário

Encontrou termo não documentado? Adicione aqui!

1. Fork repo
2. Adicione termo na categoria apropriada
3. Inclua: definição clara + exemplo se aplicável + links
4. PR com label `documentation`

---

**Última Atualização:** 2025-11-01
**Mantido por:** Equipe Shotsy
**Sugestões:** Abra issue no GitHub

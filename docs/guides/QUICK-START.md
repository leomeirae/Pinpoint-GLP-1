# Shotsy: Quick Start Guide

> De zero a rodando localmente em 15 minutos

**Última Atualização:** 2025-11-01

---

## Pré-requisitos

Antes de começar, certifique-se que você tem:

- [ ] **Node.js 18+** instalado ([nodejs.org](https://nodejs.org))
- [ ] **Git** instalado
- [ ] **Expo CLI** instalado globalmente: `npm install -g expo-cli`
- [ ] **iOS Simulator** (Mac) ou **Android Studio** (qualquer OS)
- [ ] Editor de código (recomendamos **VS Code**)

### Verificar Instalações

```bash
node --version    # Deve ser v18.x ou superior
git --version     # Qualquer versão recente
expo --version    # Qualquer versão recente
```

---

## 1. Clone o Repositório

```bash
# Clone do GitHub
git clone https://github.com/yourorg/shotsy.git
cd shotsy

# Ou se já tem acesso SSH
git clone git@github.com:yourorg/shotsy.git
cd shotsy
```

---

## 2. Instale Dependências

```bash
# Instalar todas as dependências npm
npm install

# Ou com yarn
yarn install
```

Isso deve levar **2-3 minutos** dependendo da sua conexão.

---

## 3. Configure Variáveis de Ambiente

```bash
# Copie o arquivo de exemplo
cp .env.example .env.local

# Abra o arquivo para editar
code .env.local  # ou seu editor preferido
```

### Preencha as Variáveis Necessárias

```bash
# .env.local

# Supabase (obtenha em https://supabase.com)
EXPO_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui

# Clerk (obtenha em https://clerk.com)
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# OpenAI (opcional para MVP, obtenha em https://platform.openai.com)
OPENAI_API_KEY=sk-xxxxx

# Mixpanel (opcional, obtenha em https://mixpanel.com)
EXPO_PUBLIC_MIXPANEL_TOKEN=seu-token

# Sentry (opcional, obtenha em https://sentry.io)
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### Onde Obter as Keys

#### Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Crie novo projeto (ou use existente)
3. Vá em **Settings → API**
4. Copie `URL` e `anon/public key`

#### Clerk
1. Acesse [clerk.com](https://clerk.com)
2. Crie nova aplicação
3. Em **API Keys**, copie `Publishable Key`
4. Configure OAuth providers (Google, Apple)

#### OpenAI (Opcional para MVP)
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie API key em **API Keys**
3. Adicione créditos ($5-10 suficiente para testes)

---

## 4. Configure o Banco de Dados

### Opção A: Usando Supabase CLI (Recomendado)

```bash
# Instale Supabase CLI
npm install -g supabase

# Login
supabase login

# Link ao projeto
supabase link --project-ref seu-projeto-id

# Rode migrations
supabase db push
```

### Opção B: Manual (via Dashboard)

1. Acesse Supabase Dashboard
2. Vá em **SQL Editor**
3. Execute os arquivos em `supabase/migrations/` na ordem

---

## 5. Inicie o App

```bash
# Inicie o servidor Expo
npm run start

# Ou para iniciar direto no iOS
npm run ios

# Ou para Android
npm run android
```

### O que acontece agora?

1. Metro bundler inicia (JavaScript bundler)
2. Expo Dev Tools abre no navegador
3. Escolha onde rodar:
   - **i** para iOS Simulator
   - **a** para Android Emulator
   - **w** para Web (limitado)
   - Scan QR code com Expo Go app no celular físico

---

## 6. Primeiro Login

1. App abre na tela de Sign In
2. Clique **"Continue with Google"**
3. Faça login com Google
4. Siga o onboarding flow
5. Você está dentro!

---

## Estrutura do Projeto (Rápida)

```
shotsy/
├── app/                    # Telas do app (Expo Router)
│   ├── (auth)/            # Telas de autenticação
│   │   ├── sign-in.tsx
│   │   └── onboarding.tsx
│   ├── (tabs)/            # Telas principais (tabs)
│   │   ├── index.tsx      # Dashboard
│   │   ├── add-weight.tsx
│   │   └── community.tsx
│   └── _layout.tsx
│
├── components/            # Componentes React
│   ├── ui/               # Design system
│   └── dashboard/        # Componentes de dashboard
│
├── lib/                  # Código core
│   ├── supabase.ts      # Cliente Supabase
│   └── theme.ts         # Sistema de temas
│
├── hooks/               # React hooks customizados
├── types/               # TypeScript types
└── constants/           # Constantes
```

---

## Comandos Úteis

### Development

```bash
# Iniciar dev server
npm run start

# Rodar no iOS
npm run ios

# Rodar no Android
npm run android

# Limpar cache (se algo quebrar)
npm run reset-project

# TypeScript check
npm run type-check
```

### Testing

```bash
# Rodar todos os testes
npm run test

# Testes em watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Linting & Formatting

```bash
# Rodar ESLint
npm run lint

# Fixar issues automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format
```

---

## Troubleshooting Comum

### 1. "Metro bundler failed to start"

```bash
# Solução: Limpe cache
npm run reset-project
npm start -- --clear
```

### 2. "Cannot connect to Supabase"

- Verifique se `EXPO_PUBLIC_SUPABASE_URL` está correto em `.env.local`
- Certifique-se que projeto Supabase está rodando (não pausado)
- Teste conexão: `curl https://seu-projeto.supabase.co`

### 3. "Clerk authentication not working"

- Verifique `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- No Clerk Dashboard, adicione `exp://localhost:8081` em **Allowed Origins**
- Para production, adicione domains do Expo

### 4. "Database tables not found"

```bash
# Rode migrations novamente
supabase db push

# Ou manualmente via SQL Editor no Supabase Dashboard
```

### 5. "iOS build failed"

```bash
# Limpe build do iOS
cd ios
pod install
cd ..
npm run ios
```

### 6. "Android build failed"

```bash
# Limpe gradle
cd android
./gradlew clean
cd ..
npm run android
```

---

## Próximos Passos

Agora que você tem o app rodando:

### Para Desenvolvedores

1. **Leia a arquitetura:** [Architecture Guide](../technical/ARCHITECTURE.md)
2. **Entenda o código:** [Code Standards](./CODE-STANDARDS.md)
3. **Veja o roadmap:** [Full Roadmap](../../SHOTSY-THINK-DIFFERENT-ROADMAP.md)
4. **Pegue uma task:** Veja issues no GitHub

### Para Product/Design

1. **Entenda a visão:** [Product Vision](../planning/EXECUTIVE-SUMMARY.md)
2. **Veja o roadmap:** [Roadmap](../../SHOTSY-THINK-DIFFERENT-ROADMAP.md)
3. **Check phase plans:** [Phase Checklist](../planning/PHASE-IMPLEMENTATION-CHECKLIST.md)

### Para Todos

1. **Explore o app:** Crie conta, adicione dados, navegue
2. **Reporte bugs:** Abra issues no GitHub
3. **Sugira melhorias:** Discussões no GitHub

---

## Recursos Adicionais

### Documentação Externa

- [Expo Docs](https://docs.expo.dev/)
- [React Native Docs](https://reactnative.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Clerk Docs](https://clerk.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Comunidade

- **Slack:** #shotsy-dev
- **GitHub Discussions:** [Link](#)
- **Weekly Sync:** Terças 10am PT

### Getting Help

1. **Check documentation first**
2. **Search existing issues** no GitHub
3. **Ask in Slack** #shotsy-dev
4. **Open new issue** se ainda não resolvido

---

## Checklist de Setup Completo

Antes de começar a desenvolver, certifique-se:

- [ ] App roda no simulador/emulator
- [ ] Login com Google funciona
- [ ] Consegue adicionar peso
- [ ] Dashboard mostra dados
- [ ] Testes passam (`npm test`)
- [ ] Linter passa (`npm run lint`)
- [ ] TypeScript passa (`npm run type-check`)
- [ ] Leu [Code Standards](./CODE-STANDARDS.md)
- [ ] Leu [Architecture](../technical/ARCHITECTURE.md)
- [ ] Configurou Git hooks (opcional mas recomendado)

---

## Git Workflow (Resumo)

```bash
# 1. Crie branch para feature
git checkout -b feature/nome-da-feature

# 2. Faça commits atômicos
git add .
git commit -m "feat: add avatar customization"

# 3. Push para remote
git push origin feature/nome-da-feature

# 4. Abra Pull Request no GitHub

# 5. Após review + approval, merge
```

**Padrão de commits:** Seguimos [Conventional Commits](https://www.conventionalcommits.org/)

```
feat: nova feature
fix: correção de bug
docs: documentação
style: formatação
refactor: refatoração
test: adicionar testes
chore: tarefas de manutenção
```

---

## Pronto para Começar!

Você agora tem:

- ✅ App rodando localmente
- ✅ Banco de dados configurado
- ✅ Auth funcionando
- ✅ Ambiente de desenvolvimento pronto

**Próximo passo:** Escolha uma task e comece a codar!

```bash
# Boa sorte! 🚀
npm run start
```

---

**Dúvidas?**
- Slack: #shotsy-dev
- Email: dev@shotsy.app
- Docs: [Full Documentation](../README.md)

**Última Atualização:** 2025-11-01

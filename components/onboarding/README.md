# Sistema de Onboarding do Shotsy

Este diretório contém toda a estrutura de onboarding do aplicativo Shotsy, um sistema completo de 23 telas sequenciais.

## Estrutura de Arquivos

### Componentes Base
- `OnboardingProgressBar.tsx` - Barra de progresso horizontal mostrando progresso atual/total
- `OnboardingScreenBase.tsx` - Componente base reutilizável para todas as telas com header, botão voltar, ScrollView e footer

### Telas de Onboarding (Sequência Completa)

#### Introdução (Telas 1-4)
1. **WelcomeScreen.tsx** - Carrossel de boas-vindas com 3 slides, dots de navegação e termos
2. **WidgetsIntroScreen.tsx** - Apresentação dos widgets personalizáveis
3. **ChartsIntroScreen.tsx** - Apresentação dos gráficos e insights
4. **CustomizationIntroScreen.tsx** - Apresentação de temas e cores de destaque

#### Medicação (Telas 5-9)
5. **AlreadyUsingGLP1Screen.tsx** - Pergunta se já está usando GLP-1 (radio buttons)
6. **MedicationSelectionScreen.tsx** - Seleção do medicamento (Zepbound, Mounjaro, etc.)
7. **InitialDoseScreen.tsx** - Seleção da dose inicial recomendada
8. **DeviceTypeScreen.tsx** - Tipo de dispositivo (caneta, seringa, auto-injetor)
9. **InjectionFrequencyScreen.tsx** - Frequência de aplicação com opção personalizada

#### Educação (Telas 10-11)
10. **EducationGraphScreen.tsx** - Gráfico educacional sobre níveis do medicamento
11. **HealthDisclaimerScreen.tsx** - Aviso de saúde com checkbox obrigatório

#### Dados Físicos (Telas 12-15)
12. **HeightInputScreen.tsx** - Input de altura com toggle cm/pés
13. **CurrentWeightScreen.tsx** - Input de peso atual com toggle kg/lb
14. **StartingWeightScreen.tsx** - Peso inicial e data de início
15. **TargetWeightScreen.tsx** - Peso meta com cálculo de IMC e barra de progresso

#### Motivação e Rotina (Telas 16-22)
16. **MotivationalMessageScreen.tsx** - Mensagem motivacional personalizada
17. **WeightLossRateScreen.tsx** - Velocidade esperada de perda de peso (lento/moderado/rápido)
18. **DailyRoutineScreen.tsx** - Nível de atividade física (5 opções)
19. **FluctuationsEducationScreen.tsx** - Educação sobre flutuações normais de peso
20. **FoodNoiseScreen.tsx** - Dia da semana com mais "food noise"
21. **SideEffectsConcernsScreen.tsx** - Efeitos colaterais que preocupam (múltipla escolha)
22. **MotivationScreen.tsx** - Motivação principal para usar GLP-1

#### Finalização (Tela 23)
23. **AppRatingScreen.tsx** - Solicitação de avaliação na App Store

## Fluxo Principal

O arquivo `/app/(auth)/onboarding-flow.tsx` gerencia:
- Estado global de onboarding
- Navegação entre as 23 telas
- Coleta de dados de cada tela
- Persistência e conclusão do onboarding

## Padrões Utilizados

### Componentes
- Todas as telas usam `OnboardingScreenBase` como wrapper
- Radio buttons para seleção única (com `Ionicons`)
- Checkboxes para múltipla escolha
- TextInput com validação para números
- Toggle para alternar unidades (kg/lb, cm/ft)
- ShotsyCard para cards visuais
- ShotsyButton para botões principais

### Temas
- `useShotsyColors()` para cores consistentes
- `useTheme()` para accent colors e temas
- Suporte completo a modo claro/escuro

### Coleta de Dados
Cada tela coleta dados via callback `onNext`:
```typescript
onNext({ key: value })
```

Dados coletados:
- Informações de medicação (tipo, dose, frequência)
- Dados físicos (altura, peso atual, peso inicial, peso meta)
- Preferências (nível de atividade, preocupações)
- Motivações e comportamentos

## Como Usar

### Navegação para o Onboarding
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/(auth)/onboarding-flow');
```

### Importação de Componentes Individuais
```typescript
import { WelcomeScreen, OnboardingProgressBar } from '@/components/onboarding';
```

## Validações

- Inputs numéricos validam valores positivos
- Datas não podem ser futuras
- Peso meta deve ser menor que peso atual
- Todos os campos obrigatórios são validados antes de avançar
- Botão "Continuar" fica desabilitado até validação completa

## Dependências

O sistema usa apenas dependências já presentes no projeto:
- React Native (componentes nativos)
- Expo Router (navegação)
- Ionicons (ícones)
- React Native Safe Area Context

**Não requer instalação de pacotes adicionais.**

## Personalização

Para adicionar novas telas:
1. Crie o componente usando `OnboardingScreenBase`
2. Adicione ao array de telas em `onboarding-flow.tsx`
3. Atualize `totalScreens`
4. Adicione o case no `renderScreen()`

## Estado do Onboarding

Interface completa dos dados coletados:
```typescript
interface OnboardingData {
  alreadyUsing?: boolean;
  medication?: string;
  initialDose?: string;
  deviceType?: string;
  frequency?: number;
  height?: number;
  heightUnit?: 'cm' | 'ft';
  currentWeight?: number;
  weightUnit?: 'kg' | 'lb';
  startingWeight?: number;
  startDate?: string;
  targetWeight?: number;
  weightLossRate?: number;
  activityLevel?: string;
  foodNoiseDay?: string;
  sideEffectsConcerns?: string[];
  motivation?: string;
}
```

## Conclusão do Onboarding

Ao completar todas as telas:
1. Dados são consolidados em `onboardingData`
2. Podem ser salvos no Supabase
3. Flag de conclusão é salva localmente
4. Usuário é redirecionado para `/(tabs)`

---

**Criado para o Shotsy - Seu companheiro de jornada GLP-1**

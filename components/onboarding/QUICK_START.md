# Quick Start - Sistema de Onboarding Shotsy

## Acesso Rápido

### Navegar para o Onboarding
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/(auth)/onboarding-flow');
```

### Testar Localmente
```bash
# Iniciar o app
npm start

# Ou
npx expo start
```

## Arquivos Principais

### Fluxo de Onboarding
`/app/(auth)/onboarding-flow.tsx` - Gerencia todas as 23 telas

### Componentes
`/components/onboarding/` - Todos os componentes de onboarding

## Estrutura de Dados

```typescript
interface OnboardingData {
  // Medicação
  alreadyUsing?: boolean;
  medication?: string;
  initialDose?: string;
  deviceType?: string;
  frequency?: number;

  // Físico
  height?: number;
  heightUnit?: 'cm' | 'ft';
  currentWeight?: number;
  weightUnit?: 'kg' | 'lb';
  startingWeight?: number;
  startDate?: string;
  targetWeight?: number;

  // Estilo de vida
  weightLossRate?: number;
  activityLevel?: string;
  foodNoiseDay?: string;
  sideEffectsConcerns?: string[];
  motivation?: string;
}
```

## Personalização

### Adicionar Nova Tela
1. Criar componente em `/components/onboarding/NovaTelaScreen.tsx`
2. Adicionar import em `onboarding-flow.tsx`
3. Incrementar `totalScreens`
4. Adicionar case no `renderScreen()`

### Modificar Fluxo
Edite o método `renderScreen()` em `/app/(auth)/onboarding-flow.tsx`

## Salvando Dados

No método `completeOnboarding()`:

```typescript
const completeOnboarding = async () => {
  try {
    // 1. Salvar no Supabase
    const { error } = await supabase
      .from('onboarding_data')
      .insert({
        user_id: userId,
        ...onboardingData,
      });

    if (error) throw error;

    // 2. Marcar como completo
    await AsyncStorage.setItem(
      '@shotsy:onboarding_completed',
      'true'
    );

    // 3. Navegar para o app
    router.replace('/(tabs)');
  } catch (error) {
    console.error('Error saving onboarding:', error);
  }
};
```

## Verificar Onboarding Completo

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

const checkOnboarding = async () => {
  const completed = await AsyncStorage.getItem(
    '@shotsy:onboarding_completed'
  );

  if (!completed) {
    router.push('/(auth)/onboarding-flow');
  }
};
```

## Componentes Disponíveis

```typescript
import {
  // Base
  OnboardingProgressBar,
  OnboardingScreenBase,

  // Telas
  WelcomeScreen,
  WidgetsIntroScreen,
  ChartsIntroScreen,
  // ... todas as 23 telas
} from '@/components/onboarding';
```

## Testes Rápidos

### Testar uma tela específica
```typescript
// Modificar currentScreen inicial
const [currentScreen, setCurrentScreen] = useState(5); // Tela 6
```

### Pular validações (apenas para testes)
```typescript
// Temporariamente remover disableNext
<OnboardingScreenBase
  // disableNext={!selected}  // Comentar esta linha
  onNext={handleNext}
  onBack={handleBack}
>
```

## Problemas Comuns

### Ícones não aparecem
- Certifique-se de que o app tem `@expo/vector-icons`
- Rode `npx expo install @expo/vector-icons`

### Navegação não funciona
- Verifique se o arquivo está em `app/(auth)/onboarding-flow.tsx`
- Confirme que o router está configurado

### Dados não são salvos
- Implemente a função `completeOnboarding()`
- Conecte ao Supabase ou AsyncStorage

## Links Úteis

- Documentação completa: `/components/onboarding/README.md`
- Resumo detalhado: `/ONBOARDING_SUMMARY.md`

---

**Pronto para começar! 🚀**

# Phase 3 - Progress Ring com Gradiente

Documentação completa do componente **ShotsyCircularProgressV2** criado na Fase 3.

## 🎯 Componente Principal

### ShotsyCircularProgressV2
**Localização:** `components/ui/ShotsyCircularProgressV2.tsx`

Progress ring circular com gradiente colorido estilo Shotsy, animações suaves e múltiplas variantes.

---

## ✨ Características

- ✅ **Gradiente colorido** (laranja → amarelo → verde → azul → ciano)
- ✅ **Animações suaves** com react-native-reanimated
- ✅ **4 tamanhos pré-definidos**: small, medium, large, xlarge
- ✅ **Tamanhos customizados** com suporte a custom size e stroke width
- ✅ **4 estados visuais**: normal, success, warning, error
- ✅ **Shadow effect** opcional (iOS-style)
- ✅ **Texto central** customizável
- ✅ **Label secundário** abaixo do texto
- ✅ **Conteúdo customizado** via children
- ✅ **Gradientes customizados** por tema
- ✅ **Animação configurável** (duração)
- ✅ **Tema claro/escuro** suportado

---

## 📏 Tamanhos Disponíveis

| Tamanho | Diâmetro | Stroke Width | Font Size | Uso Recomendado |
|---------|----------|--------------|-----------|-----------------|
| `small` | 120px | 8px | 24px | Cards pequenos, widgets |
| `medium` | 180px | 12px | 32px | Dashboard padrão |
| `large` | 240px | 16px | 40px | Tela principal, destaque |
| `xlarge` | 280px | 18px | 48px | Splash, onboarding |

---

## 🎨 Estados Visuais

### Normal (padrão)
Gradiente colorido Shotsy: Laranja → Amarelo → Verde → Azul → Ciano

### Success
Gradiente verde: `#10B981` → `#22C55E`

### Warning
Gradiente amarelo/laranja: `#F59E0B` → `#FBBF24`

### Error
Gradiente vermelho: `#EF4444` → `#DC2626`

---

## 🔧 Props

```typescript
interface ShotsyCircularProgressV2Props {
  /** Progresso de 0 a 1 (ex: 0.75 = 75%) */
  progress: number;

  /** Tamanho pré-definido */
  size?: 'small' | 'medium' | 'large' | 'xlarge';

  /** Tamanho customizado em pixels (sobrescreve size) */
  customSize?: number;

  /** Largura customizada do stroke */
  customStrokeWidth?: number;

  /** Estado visual */
  state?: 'normal' | 'success' | 'warning' | 'error';

  /** Texto central (ex: "75%") */
  centerText?: string;

  /** Label abaixo do texto central */
  centerLabel?: string;

  /** Cores customizadas do gradiente */
  customGradient?: string[];

  /** Mostrar sombra */
  showShadow?: boolean;

  /** Duração da animação em ms */
  animationDuration?: number;

  /** Conteúdo customizado no centro */
  children?: React.ReactNode;

  /** Estilo adicional do container */
  style?: ViewStyle;
}
```

---

## 💡 Exemplos de Uso

### 1. Uso Básico (Dashboard)

```typescript
import { ShotsyCircularProgressV2 } from '@/components/ui/ShotsyCircularProgressV2';

function Dashboard() {
  return (
    <ShotsyCircularProgressV2
      progress={0.75}
      size="medium"
      centerText="75%"
      centerLabel="Completed"
    />
  );
}
```

### 2. Com Componente Helper (Porcentagem)

```typescript
import {
  ShotsyCircularProgressV2,
  ProgressPercentage
} from '@/components/ui/ShotsyCircularProgressV2';

function WeekProgress() {
  const progress = 0.85; // 85%

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="large"
    >
      <ProgressPercentage value={progress} />
    </ShotsyCircularProgressV2>
  );
}
```

**Resultado:** Mostra "85" com "%" menor ao lado

### 3. Com Valor e Label Customizados

```typescript
import {
  ShotsyCircularProgressV2,
  ProgressValue
} from '@/components/ui/ShotsyCircularProgressV2';

function ShotsProgress() {
  const shotsCompleted = 12;
  const totalShots = 16;
  const progress = shotsCompleted / totalShots; // 0.75

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="medium"
    >
      <ProgressValue
        value={`${shotsCompleted}/${totalShots}`}
        label="Shots"
      />
    </ShotsyCircularProgressV2>
  );
}
```

**Resultado:** Mostra "12/16" com "Shots" abaixo

### 4. Estado de Sucesso

```typescript
<ShotsyCircularProgressV2
  progress={1.0}
  size="medium"
  state="success"
  centerText="✓"
  centerLabel="Complete"
  showShadow={true}
/>
```

### 5. Estado de Alerta

```typescript
<ShotsyCircularProgressV2
  progress={0.25}
  size="small"
  state="warning"
  centerText="25%"
  centerLabel="Low"
/>
```

### 6. Tamanho Customizado

```typescript
<ShotsyCircularProgressV2
  progress={0.6}
  customSize={320}
  customStrokeWidth={20}
  centerText="60%"
  centerLabel="Progress"
  animationDuration={1500}
/>
```

### 7. Gradiente Customizado (Temas)

```typescript
import { useTheme } from '@/lib/theme-context';

function ThemedProgress() {
  const { themeGradient } = useTheme();
  const customColors = [
    themeGradient.start,
    themeGradient.middle1,
    themeGradient.middle2,
    themeGradient.end,
  ];

  return (
    <ShotsyCircularProgressV2
      progress={0.8}
      size="large"
      customGradient={customColors}
      centerText="80%"
    />
  );
}
```

### 8. Conteúdo Totalmente Customizado

```typescript
import { View, Text } from 'react-native';
import { Heart } from 'phosphor-react-native';

<ShotsyCircularProgressV2
  progress={0.9}
  size="medium"
>
  <View style={{ alignItems: 'center' }}>
    <Heart size={32} weight="fill" color="#EC4899" />
    <Text style={{ marginTop: 8, fontSize: 14 }}>90% Health</Text>
  </View>
</ShotsyCircularProgressV2>
```

---

## 🎭 Casos de Uso Reais

### Dashboard - Adherence Progress

```typescript
function AdherenceCard() {
  const adherenceRate = 0.92; // 92%

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Weekly Adherence</Text>
      <ShotsyCircularProgressV2
        progress={adherenceRate}
        size="large"
        state={adherenceRate >= 0.8 ? 'success' : 'warning'}
        centerText={`${Math.round(adherenceRate * 100)}%`}
        centerLabel="On Track"
      />
    </View>
  );
}
```

### Results - Weight Loss Progress

```typescript
function WeightLossProgress() {
  const currentWeight = 85;
  const initialWeight = 95;
  const targetWeight = 75;
  const progress = (initialWeight - currentWeight) / (initialWeight - targetWeight);

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="xlarge"
    >
      <ProgressValue
        value={`${(initialWeight - currentWeight).toFixed(1)}kg`}
        label="Lost"
        valueColor="#10B981"
      />
    </ShotsyCircularProgressV2>
  );
}
```

### Calendar - Month Completion

```typescript
function MonthProgress() {
  const shotsThisMonth = 4;
  const expectedShots = 4;
  const progress = shotsThisMonth / expectedShots;

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="small"
      state={progress >= 1 ? 'success' : 'normal'}
    >
      <ProgressValue
        value={`${shotsThisMonth}/${expectedShots}`}
        label="Shots"
      />
    </ShotsyCircularProgressV2>
  );
}
```

---

## 🎨 Customização Avançada

### Estilos Customizados

```typescript
<ShotsyCircularProgressV2
  progress={0.7}
  size="medium"
  style={{
    marginVertical: 20,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 999,
    padding: 10,
  }}
  showShadow={false}
/>
```

### Animação Customizada

```typescript
// Animação rápida
<ShotsyCircularProgressV2
  progress={0.5}
  animationDuration={500}
/>

// Animação lenta e suave
<ShotsyCircularProgressV2
  progress={0.5}
  animationDuration={2000}
/>

// Sem animação
<ShotsyCircularProgressV2
  progress={0.5}
  animationDuration={0}
/>
```

---

## 🔄 Comparação: V1 vs V2

| Aspecto | V1 (ShotsyCircularProgress) | V2 (ShotsyCircularProgressV2) |
|---------|----------------------------|------------------------------|
| Animação | Não | ✅ Sim (reanimated) |
| Tamanhos | 1 (customizável) | 4 pré-definidos + custom |
| Estados | Não | ✅ 4 estados (normal, success, warning, error) |
| Gradiente | Baseado em tema | ✅ Shotsy + customizável |
| Shadow | Não | ✅ Sim (opcional) |
| Helpers | Não | ✅ ProgressPercentage, ProgressValue |
| Duração animação | N/A | ✅ Configurável |
| Design Tokens | Não | ✅ Usa ShotsyDesignTokens |

---

## 📦 Componentes Auxiliares

### ProgressPercentage

Mostra valor de progresso como porcentagem estilizada.

```typescript
<ProgressPercentage value={0.75} />
// Mostra: 75%
```

### ProgressValue

Mostra valor customizado com label.

```typescript
<ProgressValue
  value="12/16"
  label="Completed"
  valueColor="#10B981"
/>
```

---

## 🎯 Integração com Temas

O componente automaticamente se adapta ao tema do usuário (Classic, Ocean, Drizzle, etc.):

```typescript
// Usa gradiente do tema selecionado
import { useTheme } from '@/lib/theme-context';

function ThemedRing() {
  const { themeGradient } = useTheme();

  return (
    <ShotsyCircularProgressV2
      progress={0.8}
      customGradient={[
        themeGradient.start,
        themeGradient.middle1,
        themeGradient.middle2,
        themeGradient.end,
      ]}
    />
  );
}
```

---

## ⚡ Performance

- ✅ Usa `react-native-reanimated` para animações nativas (60fps)
- ✅ Animações rodando na UI thread (não JS thread)
- ✅ Memoização automática de props animadas
- ✅ Renderização otimizada com SVG nativo

---

## 🐛 Troubleshooting

### Animação não está suave
- Verifique se `react-native-reanimated` está instalado corretamente
- Confirme que o Babel plugin do reanimated está configurado

### Cores não aparecem
- Verifique se `react-native-svg` está instalado
- Confirme compatibilidade de versões

### Shadow não aparece no Android
- Sombras iOS-style podem não aparecer no Android
- Use `elevation` como alternativa se necessário

---

## ✅ Checklist de Implementação

- ✅ Gradiente colorido Shotsy
- ✅ Animações suaves (reanimated)
- ✅ 4 tamanhos pré-definidos
- ✅ Tamanhos customizados
- ✅ 4 estados visuais
- ✅ Shadow effect
- ✅ Texto central customizável
- ✅ Componentes auxiliares
- ✅ Suporte a temas
- ✅ TypeScript completo
- ✅ Documentação completa

---

**Criado em:** Fase 3 - Progress Ring com Gradiente
**Versão:** 2.0.0
**Data:** 2025-11-08

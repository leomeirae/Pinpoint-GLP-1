# Phase 2 - Gráficos com Victory Native

Este guia documenta os novos componentes de gráficos criados na Fase 2 do alinhamento com Shotsy.

## 📊 Componentes Criados

### 1. EstimatedLevelsChartV2
**Localização:** `components/dashboard/EstimatedLevelsChartV2.tsx`

Gráfico de níveis estimados de medicação com estilo Shotsy.

#### Características:
- ✅ Gráfico de **área com gradiente azul** preenchido
- ✅ **Linha tracejada** para projeções futuras
- ✅ **Tabs de período**: Week, Month, 90 days, All time
- ✅ **Botão "Jump to Today"** para navegação rápida
- ✅ **Grid lines discretas** para melhor leitura
- ✅ **Card de nível atual** destacado
- ✅ **Interpolação natural** (curva suave)
- ✅ **Legenda** explicativa (Actual levels vs Projected decay)
- ✅ Usa **Design Tokens** do Shotsy

#### Uso:

```typescript
import { EstimatedLevelsChartV2 } from '@/components/dashboard/EstimatedLevelsChartV2';

// No componente Dashboard
<EstimatedLevelsChartV2 />
```

**Props:** Nenhuma (usa hooks internos)

#### Diferenças da V1:
| Aspecto | V1 (LineChart) | V2 (Victory Native) |
|---------|----------------|---------------------|
| Biblioteca | react-native-chart-kit | victory-native |
| Estilo | Linha simples | Área preenchida com gradiente |
| Projeções | Marcadas com asterisco | Linha tracejada |
| Gradiente | Não | Sim (azul → ciano) |
| Animações | Limitadas | Suaves e nativas |
| Customização | Baixa | Alta |

---

### 2. WeightChartV2
**Localização:** `components/results/WeightChartV2.tsx`

Gráfico de progresso de peso com cores por dosagem.

#### Características:
- ✅ **Múltiplas linhas coloridas** por dosagem
- ✅ **Cores únicas** para cada dosagem (2.5mg, 5mg, 7.5mg, etc.)
- ✅ **Cards de estatísticas** (Current, Lost, Progress)
- ✅ **Seletores de período**: 1 month, 3 months, 6 months, All time
- ✅ **Linha de meta** tracejada (se fornecida)
- ✅ **Pontos destacados** em cada medição
- ✅ **Legenda de dosagens** com cores
- ✅ **Grid discreto** para leitura fácil
- ✅ Usa **sistema de cores** de `lib/dosageColors.ts`

#### Uso:

```typescript
import { WeightChartV2 } from '@/components/results/WeightChartV2';

interface WeightDataPoint {
  date: Date;
  weight: number;
  dosage?: number; // Dosagem naquela data
}

// No componente Results
<WeightChartV2
  data={weightData}
  targetWeight={75} // Opcional
  initialWeight={95} // Opcional
/>
```

**Props:**
- `data: WeightDataPoint[]` - Array de medições de peso
- `targetWeight?: number` - Peso meta (opcional)
- `initialWeight?: number` - Peso inicial (opcional)

#### Exemplo de dados:

```typescript
const weightData: WeightDataPoint[] = [
  { date: new Date('2024-01-01'), weight: 95, dosage: 2.5 },
  { date: new Date('2024-01-15'), weight: 93, dosage: 2.5 },
  { date: new Date('2024-02-01'), weight: 90, dosage: 5 },
  { date: new Date('2024-02-15'), weight: 88, dosage: 5 },
  { date: new Date('2024-03-01'), weight: 85, dosage: 7.5 },
  { date: new Date('2024-03-15'), weight: 82, dosage: 7.5 },
];
```

#### Cores por dosagem:
```typescript
2.5mg  → Roxo (#A855F7)
5mg    → Violeta (#8B5CF6)
7.5mg  → Ciano (#06B6D4)
10mg   → Azul (#3B82F6)
12.5mg → Rosa (#EC4899)
15mg   → Laranja (#F97316)
```

---

## 🎨 Design Tokens Usados

Ambos os componentes utilizam o sistema de Design Tokens criado na Fase 1:

```typescript
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';

// Spacing
padding: ShotsyDesignTokens.spacing.lg,  // 16px

// Border Radius
borderRadius: ShotsyDesignTokens.borderRadius.lg,  // 16px

// Shadows
...ShotsyDesignTokens.shadows.card,  // iOS-style shadow

// Typography
...ShotsyDesignTokens.typography.h3,  // Title style
```

---

## 🔄 Migração dos Componentes Antigos

### Para EstimatedLevelsChart:

**Antes (V1):**
```typescript
import { EstimatedLevelsChart } from '@/components/dashboard/EstimatedLevelsChart';

<EstimatedLevelsChart />
```

**Depois (V2):**
```typescript
import { EstimatedLevelsChartV2 } from '@/components/dashboard/EstimatedLevelsChartV2';

<EstimatedLevelsChartV2 />
```

### Para WeightChart (Results):

**Antes (V1):**
```typescript
import { WeightChart } from '@/components/results/WeightChart';

<WeightChart
  data={data}
  targetWeight={targetWeight}
  periodFilter="3months"
/>
```

**Depois (V2):**
```typescript
import { WeightChartV2 } from '@/components/results/WeightChartV2';

<WeightChartV2
  data={data}
  targetWeight={targetWeight}
  initialWeight={initialWeight}
/>
// O período é selecionável internamente via tabs
```

---

## 📚 Dependências

Os novos componentes usam:

- ✅ `victory-native` (^41.20.1) - Já instalado
- ✅ `react-native-svg` (15.12.1) - Já instalado
- ✅ `expo-linear-gradient` (^15.0.7) - Já instalado
- ✅ `phosphor-react-native` (^1.1.2) - Já instalado

**Nenhuma instalação adicional necessária!**

---

## 🎯 Próximos Passos (Fase 3)

1. **Criar ShotsyCircularProgressV2** - Progress ring com gradiente colorido
2. **Adicionar animações** com react-native-reanimated
3. **Implementar tooltips interativos** nos gráficos
4. **Migrar telas** para usar os novos componentes

---

## ✅ Validação

- ✅ Design Tokens aplicados consistentemente
- ✅ Cores por dosagem funcionando
- ✅ Gradientes nativos implementados
- ✅ Compatível com tema claro/escuro
- ✅ TypeScript com tipos seguros
- ✅ Estrutura escalável

---

## 📝 Notas de Implementação

### EstimatedLevelsChartV2:
- Usa `VictoryArea` para gráfico de área preenchida
- Gradiente definido via `LinearGradient` do react-native-svg
- Linha tracejada para futuro usando `strokeDasharray`
- Interpolação `natural` para curvas suaves

### WeightChartV2:
- Usa `VictoryLine` + `VictoryScatter` para linhas com pontos
- Múltiplos `VictoryGroup` para agrupar linhas por dosagem
- Cores obtidas dinamicamente via `getDosageColor()`
- Linha de meta opcional com `strokeDasharray`

---

**Criado em:** Fase 2 - Componentes de Gráficos
**Versão:** 1.0.0
**Data:** 2025-11-08

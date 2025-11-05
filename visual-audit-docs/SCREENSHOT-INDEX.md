# 📸 Índice de Screenshots - Shotsy

Este documento lista todos os 37 screenshots disponíveis do Shotsy para referência na auditoria visual.

**Fonte:** `/Users/user/Desktop/shotsy-imagens/imagens-screenshots/`

---

## 📋 LISTA COMPLETA DE SCREENSHOTS

| # | Arquivo | Descrição Visual | Tela Correspondente | Status |
|---|---------|------------------|---------------------|--------|
| 1 | IMG_0613.PNG | Dashboard com gráfico de níveis estimados + Next Shot widget | Dashboard (Main) | ✅ Piloto |
| 2 | IMG_0614.PNG | Widgets iOS (Home Screen) - "You did it!" + mini chart | iOS Widgets (Promo) | ⏸️ Pendente |
| 3 | IMG_0615.PNG | Results - Weight Change chart com doses marcadas | Results Screen | ⏸️ Pendente |
| 4 | IMG_0616.PNG | Settings - Customize themes (Sunset selected) | Settings > Customize | ⏸️ Pendente |
| 5 | IMG_0617.PNG | Onboarding - "Você já está tomando GLP-1?" (2 opções) | Onboarding Step 4 | ⏸️ Pendente |
| 6 | IMG_0618.PNG | Onboarding - Medication Selection (6 opções) | Onboarding Step 5 | ⏸️ Pendente |
| 7 | IMG_0619.PNG | Onboarding - Initial Dose (7 doses + "Outro") | Onboarding Step 6 | ✅ Piloto |
| 8 | IMG_0620.PNG | Onboarding - Device Type (4 opções) | Onboarding Step 7 | ⏸️ Pendente |
| 9 | IMG_0621.PNG | Onboarding - Injection Frequency (selected: 7 dias) | Onboarding Step 8 | ⏸️ Pendente |
| 10 | IMG_0622.PNG | Onboarding - Education Graph (níveis estimados) | Onboarding Step 9 | ⏸️ Pendente |
| 11-37 | IMG_0623.PNG - IMG_0651.PNG | A examinar | A mapear | ⏸️ Pendente |

---

## 🔍 SCREENSHOTS EXAMINADOS (Piloto)

### IMG_0613.PNG - Dashboard com Estimated Levels Chart
**Status:** ✅ Auditado no Piloto

**Elementos Identificados:**
- Header: "Summary" + "Add shot" button
- Título: "Estimated Medication Levels" + info icon
- Tabs: Week, Month, 90 days, All time
- "Jump to Today" button
- Valor atual: "1.17mg" + timestamp
- Gráfico: Area chart (azul preenchido)
  - Linha contínua + área preenchida
  - Projeção futura (tracejada)
  - Grid horizontal (sem vertical)
  - Eixo X: datas (6/22, 6/29, 7/6, 7/13)
  - Eixo Y: 0-4mg
- Widget: "Next Shot" (anel colorido + "It's shot day!")
- Bottom Navigation: Summary, Shots, Results, Calendar, Settings

**Arquivo Mounjaro:** `components/dashboard/EstimatedLevelsChart.tsx`

---

### IMG_0619.PNG - Initial Dose Selection Screen
**Status:** ✅ Auditado no Piloto

**Elementos Identificados:**
- Progress bar: ~15% (step 6 de ~22)
- Back button (top left)
- Título: "Você sabe sua dose inicial recomendada?"
- Subtítulo: "Não tem problema se você não tiver certeza!"
- 7 opções em cards:
  - 2.5mg
  - 5mg
  - 7.5mg
  - 10mg
  - 12.5mg
  - 15mg
  - Outro
- Botão: "Continuar" (disabled - cinza)
- Layout: Cards com border-radius generoso, padding espaçoso
- Radio buttons: círculos à esquerda

**Arquivo Mounjaro:** `components/onboarding/InitialDoseScreen.tsx`

---

## 📸 SCREENSHOTS A EXAMINAR (Próximas Etapas)

### Onboarding Screens (Prioridade P0)

| Screenshot | Descrição Provável | Tela Mounjaro |
|------------|-------------------|---------------|
| IMG_0617.PNG | Already using GLP-1? | AlreadyUsingGLP1Screen.tsx |
| IMG_0618.PNG | Medication Selection | MedicationSelectionScreen.tsx |
| IMG_0620.PNG | Device Type | DeviceTypeScreen.tsx |
| IMG_0621.PNG | Injection Frequency | InjectionFrequencyScreen.tsx |
| IMG_0622.PNG | Education Graph | EducationGraphScreen.tsx |
| IMG_062X.PNG | Health Disclaimer? | HealthDisclaimerScreen.tsx |
| IMG_062X.PNG | Height Input? | HeightInputScreen.tsx |
| IMG_062X.PNG | Current Weight? | CurrentWeightScreen.tsx |
| IMG_062X.PNG | Starting Weight? | StartingWeightScreen.tsx |
| IMG_062X.PNG | Target Weight? | TargetWeightScreen.tsx |
| IMG_062X.PNG | Weight Loss Rate? | WeightLossRateScreen.tsx |
| IMG_062X.PNG | Side Effects? | SideEffectsConcernsScreen.tsx |

### Dashboard / Main Screens (Prioridade P0/P1)

| Screenshot | Descrição Provável | Tela Mounjaro |
|------------|-------------------|---------------|
| IMG_0613.PNG | Dashboard ✅ | app/(tabs)/dashboard.tsx |
| IMG_0615.PNG | Results | app/(tabs)/results.tsx |

### Settings / Secondary (Prioridade P1/P2)

| Screenshot | Descrição Provável | Tela Mounjaro |
|------------|-------------------|---------------|
| IMG_0616.PNG | Customize Themes | app/(tabs)/settings.tsx > Customize |

### Promo / Features (Prioridade P2)

| Screenshot | Descrição Provável | Relevância |
|------------|-------------------|------------|
| IMG_0614.PNG | iOS Widgets | Marketing/Promo (não implementar) |

---

## 📋 PRÓXIMA TAREFA: MAPEAR SCREENSHOTS 11-37

### Ações Necessárias:

1. **Examinar cada screenshot** (IMG_0623 até IMG_0651)
2. **Identificar a tela** correspondente no Mounjaro Tracker
3. **Categorizar por prioridade** (P0, P1, P2)
4. **Anotar elementos chave** (títulos, botões, layout)
5. **Atualizar esta tabela** com as informações

### Template para Análise:

```markdown
### IMG_XXXX.PNG - [Nome da Tela]
**Status:** ⏸️ Pendente

**Elementos Identificados:**
- Progress bar: XX%
- Título: "..."
- Subtítulo: "..."
- Elementos principais: [lista]
- Botões: [lista]
- Layout especial: [descrição]

**Arquivo Mounjaro:** `path/to/component.tsx`
**Prioridade:** P0 / P1 / P2
```

---

## 🎯 OBJETIVOS DO MAPEAMENTO

### Fase 1: Identificação (Esta Etapa)
- [ ] Examinar 37 screenshots
- [ ] Identificar tela correspondente
- [ ] Categorizar por prioridade
- [ ] Criar tabela completa

### Fase 2: Auditoria (Próxima Etapa)
- [ ] Auditar 22 telas de onboarding (P0)
- [ ] Auditar 4 gráficos (P0)
- [ ] Auditar Dashboard e Results (P1)
- [ ] Auditar telas secundárias (P2)

### Fase 3: Implementação (Final)
- [ ] Implementar mudanças P0
- [ ] Checkpoint estratégico
- [ ] Implementar P1/P2 (condicional)

---

## 📊 PROGRESSO

### Screenshots Mapeados: 9 / 37 (24%)
- ✅ IMG_0613 - Dashboard ✅ Auditado
- ✅ IMG_0614 - iOS Widgets (promo)
- ✅ IMG_0615 - Results
- ✅ IMG_0616 - Settings/Customize
- ✅ IMG_0617 - Onboarding Step 4
- ✅ IMG_0618 - Onboarding Step 5
- ✅ IMG_0619 - Onboarding Step 6 ✅ Auditado
- ✅ IMG_0620 - Onboarding Step 7
- ✅ IMG_0621 - Onboarding Step 8
- ⏸️ IMG_0622 - IMG_0651 (28 screenshots pendentes)

### Screenshots Auditados: 2 / 37 (5%)
- ✅ IMG_0613 - Estimated Levels Chart (Piloto)
- ✅ IMG_0619 - Initial Dose Screen (Piloto)

---

## 🔄 ATUALIZAR ESTE DOCUMENTO

Este índice será atualizado conforme os screenshots forem examinados e mapeados.

**Próxima atualização:** Após examinar screenshots 11-37 e criar tabela completa de correspondências.

---

**Última atualização:** 5 de novembro de 2025  
**Status:** 🟡 24% mapeado (9/37)  
**Próxima ação:** Examinar IMG_0622 - IMG_0651


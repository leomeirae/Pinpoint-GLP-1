# Fase 1: Personalização Radical - Plano de Implementação Técnica

**Status:** 🚧 Em Progresso
**Duração Estimada:** 2-3 semanas
**Complexidade:** Média
**Data Início:** 2025-11-01

---

## 📋 Sumário Executivo

A Fase 1 transforma Shotsy de um app genérico em um companheiro verdadeiramente pessoal. Vamos implementar três pilares de personalização:

1. **Avatar & Identidade** - Representação visual personalizada que evolui
2. **Metas Personalizadas** - Objetivos além de peso
3. **Tone & Voice** - Comunicação adaptada ao estilo do usuário

---

## 🎯 Objetivos da Fase 1

### O Que Queremos Alcançar
- Usuários sentem que o app é "deles"
- Cada pessoa tem experiência única e relevante
- Engajamento aumenta através de personalização profunda
- Foundation para todas as outras fases

### Métricas de Sucesso
- **Personalização:** 90%+ dos usuários completam setup de preferências
- **Engajamento:** 30% aumento em sessões diárias
- **Satisfação:** NPS aumenta em 15+ pontos
- **Retenção:** 20% redução em churn Day 7

---

## 🏗️ Arquitetura da Solução

### Estado Atual do Projeto

```typescript
// Já temos:
- Expo + React Native
- Clerk (Auth)
- Supabase (Database)
- Tabelas: profiles, applications, weights, settings

// Falta:
- Sistema de personalização avançado
- Campos expandidos no schema
- Hooks para personalização
- UI components para customização
```

### Mudanças Necessárias

#### 1. Database Schema (Supabase)
```sql
-- Expandir tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS personalization JSONB DEFAULT '{}'::jsonb;

-- Criar tabela de avatares
CREATE TABLE public.user_avatars (...)

-- Criar tabela de metas
CREATE TABLE public.user_goals (...)

-- Criar tabela de preferências de comunicação
CREATE TABLE public.communication_preferences (...)
```

#### 2. Types (TypeScript)
```typescript
interface UserAvatar { ... }
interface PersonalGoal { ... }
interface AppPersonality { ... }
```

#### 3. Hooks
```typescript
useAvatar()
useGoals()
usePersonality()
```

#### 4. Components
```typescript
AvatarCustomizer
GoalBuilder
PersonalitySelector
```

---

## 📝 Implementação Detalhada

## Feature 1.1: Sistema de Avatar Personalizável

### Objetivo
Avatar visual que representa o usuário e evolui com progresso.

### Spec Técnica

#### Database Schema
```sql
-- Migration: 003_personalization_avatar.sql
CREATE TABLE IF NOT EXISTS public.user_avatars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Avatar appearance
  style TEXT NOT NULL DEFAULT 'minimal',
    -- 'abstract' | 'minimal' | 'illustrated' | 'photo'
  primary_color TEXT NOT NULL DEFAULT '#0891B2',
  accessories JSONB DEFAULT '[]'::jsonb,
    -- ['glasses', 'hat', 'medal']
  mood TEXT DEFAULT 'motivated',
    -- 'motivated' | 'chill' | 'determined' | 'playful'

  -- Avatar evolution
  level INTEGER DEFAULT 1,
  evolution_stage TEXT DEFAULT 'beginner',
    -- 'beginner' | 'intermediate' | 'advanced' | 'master'
  unlock_date TIMESTAMPTZ DEFAULT NOW(),

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_avatars ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own avatar"
  ON public.user_avatars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own avatar"
  ON public.user_avatars FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatar"
  ON public.user_avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_avatars_user_id ON public.user_avatars(user_id);

-- Trigger
CREATE TRIGGER update_user_avatars_updated_at
  BEFORE UPDATE ON public.user_avatars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### TypeScript Types
```typescript
// lib/types/avatar.ts
export type AvatarStyle = 'abstract' | 'minimal' | 'illustrated' | 'photo';
export type AvatarMood = 'motivated' | 'chill' | 'determined' | 'playful';
export type EvolutionStage = 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface UserAvatar {
  id: string;
  user_id: string;

  // Appearance
  style: AvatarStyle;
  primary_color: string;
  accessories: string[];
  mood: AvatarMood;

  // Evolution
  level: number;
  evolution_stage: EvolutionStage;
  unlock_date: Date;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface AvatarCustomization {
  style: AvatarStyle;
  primary_color: string;
  accessories: string[];
  mood: AvatarMood;
}
```

#### Hook: useAvatar
```typescript
// hooks/useAvatar.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';
import { UserAvatar, AvatarCustomization } from '@/lib/types/avatar';

export const useAvatar = () => {
  const { user } = useUser();
  const [avatar, setAvatar] = useState<UserAvatar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchAvatar();
    }
  }, [user]);

  const fetchAvatar = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_avatars')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // Avatar doesn't exist, create default
        await createAvatar();
        return;
      }

      if (error) throw error;
      setAvatar(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createAvatar = async (customization?: Partial<AvatarCustomization>) => {
    try {
      const defaultAvatar = {
        user_id: user?.id,
        style: customization?.style || 'minimal',
        primary_color: customization?.primary_color || '#0891B2',
        accessories: customization?.accessories || [],
        mood: customization?.mood || 'motivated',
      };

      const { data, error } = await supabase
        .from('user_avatars')
        .insert([defaultAvatar])
        .select()
        .single();

      if (error) throw error;
      setAvatar(data);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateAvatar = async (updates: Partial<AvatarCustomization>) => {
    try {
      const { data, error } = await supabase
        .from('user_avatars')
        .update(updates)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setAvatar(data);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const evolveAvatar = async (newLevel: number) => {
    // Logic to evolve avatar based on achievements
    const stages = ['beginner', 'intermediate', 'advanced', 'master'];
    const stage = stages[Math.floor((newLevel - 1) / 10)];

    await updateAvatar({
      // level: newLevel,  // Tipo incorreto, level não está em AvatarCustomization
      // evolution_stage: stage,
      // Precisaremos fazer update direto ou expandir o tipo
    });
  };

  return {
    avatar,
    loading,
    error,
    updateAvatar,
    createAvatar,
    evolveAvatar,
    refetch: fetchAvatar,
  };
};
```

#### Component: AvatarCustomizer
```typescript
// components/personalization/AvatarCustomizer.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useAvatar } from '@/hooks/useAvatar';
import { AvatarStyle, AvatarMood } from '@/lib/types/avatar';

const AVATAR_STYLES: AvatarStyle[] = ['abstract', 'minimal', 'illustrated', 'photo'];
const MOODS: AvatarMood[] = ['motivated', 'chill', 'determined', 'playful'];
const COLORS = ['#0891B2', '#EC4899', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];
const ACCESSORIES = ['glasses', 'hat', 'medal', 'headphones', 'crown'];

export const AvatarCustomizer: React.FC = () => {
  const { avatar, updateAvatar, loading } = useAvatar();
  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>(avatar?.style || 'minimal');
  const [selectedColor, setSelectedColor] = useState(avatar?.primary_color || '#0891B2');
  const [selectedMood, setSelectedMood] = useState<AvatarMood>(avatar?.mood || 'motivated');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(avatar?.accessories || []);

  const handleSave = async () => {
    await updateAvatar({
      style: selectedStyle,
      primary_color: selectedColor,
      mood: selectedMood,
      accessories: selectedAccessories,
    });
  };

  const toggleAccessory = (accessory: string) => {
    if (selectedAccessories.includes(accessory)) {
      setSelectedAccessories(prev => prev.filter(a => a !== accessory));
    } else {
      setSelectedAccessories(prev => [...prev, accessory]);
    }
  };

  if (loading) {
    return <Text>Loading avatar...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Customize Your Avatar</Text>

      {/* Preview */}
      <View style={styles.preview}>
        {/* TODO: Avatar visual representation */}
        <Text>Avatar Preview</Text>
      </View>

      {/* Style Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Style</Text>
        <View style={styles.optionsRow}>
          {AVATAR_STYLES.map(style => (
            <TouchableOpacity
              key={style}
              style={[
                styles.option,
                selectedStyle === style && styles.optionSelected
              ]}
              onPress={() => setSelectedStyle(style)}
            >
              <Text>{style}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Color</Text>
        <View style={styles.optionsRow}>
          {COLORS.map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected
              ]}
              onPress={() => setSelectedColor(color)}
            />
          ))}
        </View>
      </View>

      {/* Mood Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood</Text>
        <View style={styles.optionsRow}>
          {MOODS.map(mood => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.option,
                selectedMood === mood && styles.optionSelected
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text>{mood}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accessories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessories</Text>
        <View style={styles.optionsRow}>
          {ACCESSORIES.map(accessory => (
            <TouchableOpacity
              key={accessory}
              style={[
                styles.option,
                selectedAccessories.includes(accessory) && styles.optionSelected
              ]}
              onPress={() => toggleAccessory(accessory)}
            >
              <Text>{accessory}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Avatar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  preview: {
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: '#e0f2fe',
    borderColor: '#0891B2',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorSelected: {
    borderColor: '#000',
  },
  saveButton: {
    backgroundColor: '#0891B2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
```

---

## Feature 1.2: Metas Personalizadas

### Objetivo
Sistema de metas além de peso, com milestones e celebrações customizáveis.

### Spec Técnica

#### Database Schema
```sql
-- Migration: 004_personalization_goals.sql
CREATE TABLE IF NOT EXISTS public.user_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Goal definition
  type TEXT NOT NULL,
    -- 'weight_loss' | 'energy_boost' | 'consistency' | 'custom'
  title TEXT NOT NULL,
  description TEXT,

  -- Target & Timeline
  target_value NUMERIC(10, 2),
  target_unit TEXT,
  target_date TIMESTAMPTZ,

  -- Progress tracking
  current_value NUMERIC(10, 2) DEFAULT 0,
  progress_percentage INTEGER DEFAULT 0,

  -- Milestones
  milestones JSONB DEFAULT '[]'::jsonb,
    -- [{ value: 25, label: '25% done', achieved: false, date: null }]

  -- Customization
  celebration_style TEXT DEFAULT 'energetic',
    -- 'subtle' | 'energetic' | 'zen'
  reminder_enabled BOOLEAN DEFAULT TRUE,

  -- Status
  status TEXT DEFAULT 'active',
    -- 'active' | 'paused' | 'completed' | 'abandoned'
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_goals ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own goals"
  ON public.user_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.user_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.user_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.user_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_user_goals_user_id ON public.user_goals(user_id);
CREATE INDEX idx_user_goals_status ON public.user_goals(user_id, status);

-- Trigger
CREATE TRIGGER update_user_goals_updated_at
  BEFORE UPDATE ON public.user_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### TypeScript Types
```typescript
// lib/types/goals.ts
export type GoalType = 'weight_loss' | 'energy_boost' | 'consistency' | 'custom';
export type CelebrationStyle = 'subtle' | 'energetic' | 'zen';
export type GoalStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface Milestone {
  value: number;
  label: string;
  achieved: boolean;
  achieved_date?: Date;
}

export interface PersonalGoal {
  id: string;
  user_id: string;

  // Definition
  type: GoalType;
  title: string;
  description?: string;

  // Target
  target_value?: number;
  target_unit?: string;
  target_date?: Date;

  // Progress
  current_value: number;
  progress_percentage: number;

  // Milestones
  milestones: Milestone[];

  // Customization
  celebration_style: CelebrationStyle;
  reminder_enabled: boolean;

  // Status
  status: GoalStatus;
  started_at: Date;
  completed_at?: Date;

  // Metadata
  created_at: Date;
  updated_at: Date;
}
```

#### Hook: useGoals
```typescript
// hooks/useGoals.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';
import { PersonalGoal, GoalType, CelebrationStyle } from '@/lib/types/goals';

export const useGoals = () => {
  const { user } = useUser();
  const [goals, setGoals] = useState<PersonalGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<PersonalGoal, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'current_value' | 'progress_percentage'>) => {
    try {
      const { data, error } = await supabase
        .from('user_goals')
        .insert([{
          user_id: user?.id,
          ...goalData,
        }])
        .select()
        .single();

      if (error) throw error;
      await fetchGoals();
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<PersonalGoal>) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updateProgress = async (goalId: string, newValue: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.target_value) return;

    const percentage = Math.min(100, Math.round((newValue / goal.target_value) * 100));

    await updateGoal(goalId, {
      current_value: newValue,
      progress_percentage: percentage,
      ...(percentage >= 100 && { status: 'completed', completed_at: new Date() }),
    });
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      await fetchGoals();
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    goals,
    activeGoals: goals.filter(g => g.status === 'active'),
    completedGoals: goals.filter(g => g.status === 'completed'),
    loading,
    error,
    createGoal,
    updateGoal,
    updateProgress,
    deleteGoal,
    refetch: fetchGoals,
  };
};
```

---

## Feature 1.3: Tone & Voice Personalizado

### Objetivo
App que se comunica no tom e estilo preferido pelo usuário.

### Spec Técnica

#### Database Schema
```sql
-- Migration: 005_personalization_communication.sql
CREATE TABLE IF NOT EXISTS public.communication_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Communication style
  style TEXT NOT NULL DEFAULT 'friend',
    -- 'coach' | 'friend' | 'scientist' | 'minimalist'
  humor_level INTEGER DEFAULT 3 CHECK (humor_level BETWEEN 1 AND 5),
  motivation_type TEXT DEFAULT 'balanced',
    -- 'data-driven' | 'emotional' | 'balanced'

  -- Preferences
  use_emojis BOOLEAN DEFAULT TRUE,
  formality_level INTEGER DEFAULT 3 CHECK (formality_level BETWEEN 1 AND 5),
    -- 1 = very casual, 5 = very formal
  preferred_language TEXT DEFAULT 'en',

  -- Notification preferences
  notification_tone TEXT DEFAULT 'encouraging',
    -- 'encouraging' | 'neutral' | 'direct' | 'playful'
  notification_frequency TEXT DEFAULT 'normal',
    -- 'minimal' | 'normal' | 'frequent'

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.communication_preferences ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own communication preferences"
  ON public.communication_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own communication preferences"
  ON public.communication_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own communication preferences"
  ON public.communication_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_communication_preferences_user_id
  ON public.communication_preferences(user_id);

-- Trigger
CREATE TRIGGER update_communication_preferences_updated_at
  BEFORE UPDATE ON public.communication_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

#### TypeScript Types
```typescript
// lib/types/communication.ts
export type CommunicationStyle = 'coach' | 'friend' | 'scientist' | 'minimalist';
export type MotivationType = 'data-driven' | 'emotional' | 'balanced';
export type NotificationTone = 'encouraging' | 'neutral' | 'direct' | 'playful';
export type NotificationFrequency = 'minimal' | 'normal' | 'frequent';

export interface AppPersonality {
  id: string;
  user_id: string;

  // Style
  style: CommunicationStyle;
  humor_level: number; // 1-5
  motivation_type: MotivationType;

  // Preferences
  use_emojis: boolean;
  formality_level: number; // 1-5
  preferred_language: string;

  // Notifications
  notification_tone: NotificationTone;
  notification_frequency: NotificationFrequency;

  // Metadata
  created_at: Date;
  updated_at: Date;
}
```

#### Hook: usePersonality
```typescript
// hooks/usePersonality.ts
import { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';
import { AppPersonality } from '@/lib/types/communication';

export const usePersonality = () => {
  const { user } = useUser();
  const [personality, setPersonality] = useState<AppPersonality | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
      fetchPersonality();
    }
  }, [user]);

  const fetchPersonality = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communication_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code === 'PGRST116') {
        await createPersonality();
        return;
      }

      if (error) throw error;
      setPersonality(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const createPersonality = async (prefs?: Partial<AppPersonality>) => {
    try {
      const defaults = {
        user_id: user?.id,
        style: 'friend',
        humor_level: 3,
        motivation_type: 'balanced',
        use_emojis: true,
        formality_level: 3,
        preferred_language: 'en',
        notification_tone: 'encouraging',
        notification_frequency: 'normal',
        ...prefs,
      };

      const { data, error } = await supabase
        .from('communication_preferences')
        .insert([defaults])
        .select()
        .single();

      if (error) throw error;
      setPersonality(data);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const updatePersonality = async (updates: Partial<AppPersonality>) => {
    try {
      const { data, error } = await supabase
        .from('communication_preferences')
        .update(updates)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;
      setPersonality(data);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  // Helper to get personalized message
  const getPersonalizedMessage = (
    baseMessage: string,
    context?: { isEncouraging?: boolean; isImportant?: boolean }
  ): string => {
    if (!personality) return baseMessage;

    let message = baseMessage;

    // Add emojis if enabled
    if (personality.use_emojis && context?.isEncouraging) {
      message += ' 🎉';
    }

    // Adjust tone based on style
    // This would be more sophisticated in production
    // Could integrate with OpenAI for dynamic message generation

    return message;
  };

  return {
    personality,
    loading,
    error,
    updatePersonality,
    getPersonalizedMessage,
    refetch: fetchPersonality,
  };
};
```

---

## 📅 Cronograma de Implementação

### Semana 1: Database & Foundation
**Dias 1-2: Setup do Schema**
- [ ] Criar migration 003_personalization_avatar.sql
- [ ] Criar migration 004_personalization_goals.sql
- [ ] Criar migration 005_personalization_communication.sql
- [ ] Aplicar migrations no Supabase
- [ ] Verificar RLS policies
- [ ] Testar queries básicas

**Dias 3-5: Types & Hooks**
- [ ] Criar types (avatar.ts, goals.ts, communication.ts)
- [ ] Implementar useAvatar hook
- [ ] Implementar useGoals hook
- [ ] Implementar usePersonality hook
- [ ] Testes unitários dos hooks
- [ ] Integração com Clerk auth

### Semana 2: UI Components
**Dias 1-3: Avatar System**
- [ ] Criar AvatarCustomizer component
- [ ] Implementar preview visual
- [ ] Sistema de cores e estilos
- [ ] Acessórios e mood
- [ ] Animações de transição

**Dias 4-5: Goals System**
- [ ] Criar GoalBuilder component
- [ ] Goal cards com progresso
- [ ] Milestone tracker
- [ ] Celebration animations

### Semana 3: Integration & Polish
**Dias 1-2: Personality System**
- [ ] PersonalitySelector component
- [ ] Message tone preview
- [ ] Integration com notificações

**Dias 3-4: Onboarding Update**
- [ ] Adicionar personalização ao onboarding
- [ ] Flow de descoberta de preferências
- [ ] Tutoriais interativos

**Dia 5: Testing & QA**
- [ ] Testes de integração
- [ ] Beta testing
- [ ] Bug fixes
- [ ] Performance optimization

---

## 🧪 Testing Strategy

### Unit Tests
```typescript
// __tests__/hooks/useAvatar.test.ts
describe('useAvatar', () => {
  it('should create default avatar for new user', async () => {
    // Test implementation
  });

  it('should update avatar customization', async () => {
    // Test implementation
  });

  it('should evolve avatar on level up', async () => {
    // Test implementation
  });
});
```

### Integration Tests
- Avatar + Profile integration
- Goals + Weight tracking correlation
- Personality + Notifications integration

### E2E Tests
- Complete onboarding personalization flow
- Avatar customization flow
- Goal creation and tracking flow

---

## 📊 Success Metrics

### Technical Metrics
- **Performance:**
  - Avatar load time < 200ms
  - Goal updates < 100ms
  - Database query time < 50ms

- **Quality:**
  - Zero critical bugs
  - 80%+ code coverage
  - All E2E tests passing

### User Metrics
- **Engagement:**
  - 90%+ complete personalization setup
  - 70%+ customize avatar
  - 60%+ create custom goals

- **Satisfaction:**
  - 4.5+ rating on personalization features
  - <5% support tickets related to personalization

---

## 🚧 Risks & Mitigations

### Risk 1: Too Complex for Users
**Mitigation:**
- Progressive disclosure
- Smart defaults
- Skip options
- Wizard-style flows

### Risk 2: Performance Issues
**Mitigation:**
- Aggressive caching
- Lazy loading
- Optimistic updates
- Database indexing

### Risk 3: Low Adoption
**Mitigation:**
- Show value upfront
- Before/after previews
- Gamification of setup
- Social proof

---

## 📝 Next Steps After Fase 1

Com a Fase 1 completa, teremos:
- ✅ Foundation de personalização sólida
- ✅ Database schema expandido
- ✅ Hooks reutilizáveis
- ✅ Components de UI prontos

Isso nos prepara para:
- **Fase 2:** Insights que Surpreendem (usar personalização para customizar insights)
- **Fase 3:** Comunidade (perfis anônimos personalizados)
- **Fase 7:** Experiência Premium (micro-interactions baseadas em preferências)

---

**Status:** 📋 Planejamento Completo - Pronto para Implementação
**Próxima Ação:** Começar implementação do schema de database

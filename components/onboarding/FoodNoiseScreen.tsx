import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { Ionicons } from '@expo/vector-icons';

interface FoodNoiseScreenProps {
  onNext: (data: { foodNoiseDay: string }) => void;
  onBack: () => void;
}

const daysOfWeek = [
  { id: 'monday', label: 'Segunda-feira' },
  { id: 'tuesday', label: 'Terça-feira' },
  { id: 'wednesday', label: 'Quarta-feira' },
  { id: 'thursday', label: 'Quinta-feira' },
  { id: 'friday', label: 'Sexta-feira' },
  { id: 'saturday', label: 'Sábado' },
  { id: 'sunday', label: 'Domingo' },
  { id: 'none', label: 'Não tenho um dia específico' },
];

export function FoodNoiseScreen({ onNext, onBack }: FoodNoiseScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      onNext({ foodNoiseDay: selected });
    }
  };

  return (
    <OnboardingScreenBase
      title="Em qual dia da semana você costuma ter mais 'food noise'?"
      subtitle="Food noise são pensamentos constantes sobre comida que dificultam manter a dieta"
      onNext={handleNext}
      onBack={onBack}
      disableNext={!selected}
    >
      <View style={styles.content}>
        <ShotsyCard style={styles.explanationCard}>
          <Text style={styles.explanationEmoji}>🧠</Text>
          <Text style={[styles.explanationTitle, { color: colors.text }]}>
            O que é "food noise"?
          </Text>
          <Text style={[styles.explanationText, { color: colors.textSecondary }]}>
            São pensamentos intrusivos e constantes sobre comida, tornando difícil resistir a
            desejos e manter escolhas alimentares saudáveis. Medicamentos GLP-1 ajudam a reduzir
            esse "ruído mental".
          </Text>
        </ShotsyCard>

        <View style={styles.optionsList}>
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day.id}
              style={[
                styles.option,
                {
                  backgroundColor: colors.card,
                  borderColor: selected === day.id ? currentAccent : colors.border,
                  borderWidth: selected === day.id ? 2 : 1,
                },
              ]}
              onPress={() => setSelected(day.id)}
            >
              <Text style={[styles.optionLabel, { color: colors.text }]}>{day.label}</Text>
              {selected === day.id && (
                <Ionicons name="checkmark-circle" size={24} color={currentAccent} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  explanationCard: {
    alignItems: 'center',
    padding: 20,
  },
  explanationEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  option: {
    alignItems: 'center',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionsList: {
    gap: 10,
  },
});

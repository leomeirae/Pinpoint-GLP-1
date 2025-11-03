import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface CurrentWeightScreenProps {
  onNext: (data: { currentWeight: number; weightUnit: 'kg' | 'lb' }) => void;
  onBack: () => void;
}

export function CurrentWeightScreen({ onNext, onBack }: CurrentWeightScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [unit, setUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum) && weightNum > 0) {
        onNext({ currentWeight: weightNum, weightUnit: unit });
      }
    }
  };

  const isValid = weight && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0;

  return (
    <OnboardingScreenBase
      title="Qual é o seu peso atual?"
      subtitle="Essa será a base para acompanhar seu progresso"
      onNext={handleNext}
      onBack={onBack}
      disableNext={!isValid}
    >
      <View style={styles.content}>
        <View style={styles.unitToggle}>
          <TouchableOpacity
            style={[
              styles.unitButton,
              {
                backgroundColor: unit === 'kg' ? currentAccent : colors.card,
                borderColor: unit === 'kg' ? currentAccent : colors.border,
              },
            ]}
            onPress={() => setUnit('kg')}
          >
            <Text
              style={[
                styles.unitButtonText,
                { color: unit === 'kg' ? '#FFFFFF' : colors.text },
              ]}
            >
              kg
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              {
                backgroundColor: unit === 'lb' ? currentAccent : colors.card,
                borderColor: unit === 'lb' ? currentAccent : colors.border,
              },
            ]}
            onPress={() => setUnit('lb')}
          >
            <Text
              style={[
                styles.unitButtonText,
                { color: unit === 'lb' ? '#FFFFFF' : colors.text },
              ]}
            >
              lb
            </Text>
          </TouchableOpacity>
        </View>

        <ShotsyCard variant="elevated" style={styles.inputCard}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Peso atual
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={unit === 'kg' ? '75.0' : '165.0'}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
              {unit}
            </Text>
          </View>
        </ShotsyCard>

        <Text style={styles.emoji}>⚖️</Text>

        <ShotsyCard style={styles.tipCard}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Para resultados mais precisos, pese-se sempre no mesmo horário,
            de preferência pela manhã, após ir ao banheiro.
          </Text>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  unitToggle: {
    flexDirection: 'row',
    gap: 12,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  inputCard: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputSuffix: {
    fontSize: 20,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  tipCard: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});

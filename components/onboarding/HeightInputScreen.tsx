import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface HeightInputScreenProps {
  onNext: (data: { height: number; heightUnit: 'cm' | 'ft' }) => void;
  onBack: () => void;
}

export function HeightInputScreen({ onNext, onBack }: HeightInputScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [unit, setUnit] = useState<'cm' | 'ft'>('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  const handleNext = () => {
    if (unit === 'cm' && heightCm) {
      const height = parseFloat(heightCm);
      if (!isNaN(height) && height > 0) {
        onNext({ height, heightUnit: 'cm' });
      }
    } else if (unit === 'ft' && heightFt) {
      const ft = parseFloat(heightFt);
      const inches = heightIn ? parseFloat(heightIn) : 0;
      if (!isNaN(ft) && ft > 0) {
        const totalCm = (ft * 30.48) + (inches * 2.54);
        onNext({ height: totalCm, heightUnit: 'ft' });
      }
    }
  };

  const isValid = unit === 'cm'
    ? heightCm && !isNaN(parseFloat(heightCm)) && parseFloat(heightCm) > 0
    : heightFt && !isNaN(parseFloat(heightFt)) && parseFloat(heightFt) > 0;

  return (
    <OnboardingScreenBase
      title="Qual é a sua altura?"
      subtitle="Essa informação nos ajuda a calcular seu IMC"
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
                backgroundColor: unit === 'cm' ? currentAccent : colors.card,
                borderColor: unit === 'cm' ? currentAccent : colors.border,
              },
            ]}
            onPress={() => setUnit('cm')}
          >
            <Text
              style={[
                styles.unitButtonText,
                { color: unit === 'cm' ? '#FFFFFF' : colors.text },
              ]}
            >
              cm
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.unitButton,
              {
                backgroundColor: unit === 'ft' ? currentAccent : colors.card,
                borderColor: unit === 'ft' ? currentAccent : colors.border,
              },
            ]}
            onPress={() => setUnit('ft')}
          >
            <Text
              style={[
                styles.unitButtonText,
                { color: unit === 'ft' ? '#FFFFFF' : colors.text },
              ]}
            >
              pés/pol
            </Text>
          </TouchableOpacity>
        </View>

        <ShotsyCard variant="elevated" style={styles.inputCard}>
          {unit === 'cm' ? (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Altura em centímetros
              </Text>
              <View style={styles.inputRow}>
                <TextInput
                  style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                  value={heightCm}
                  onChangeText={setHeightCm}
                  keyboardType="decimal-pad"
                  placeholder="170"
                  placeholderTextColor={colors.textMuted}
                />
                <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
                  cm
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
                Altura em pés e polegadas
              </Text>
              <View style={styles.dualInputRow}>
                <View style={styles.dualInput}>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    value={heightFt}
                    onChangeText={setHeightFt}
                    keyboardType="decimal-pad"
                    placeholder="5"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
                    pés
                  </Text>
                </View>
                <View style={styles.dualInput}>
                  <TextInput
                    style={[styles.input, { color: colors.text, borderColor: colors.border }]}
                    value={heightIn}
                    onChangeText={setHeightIn}
                    keyboardType="decimal-pad"
                    placeholder="7"
                    placeholderTextColor={colors.textMuted}
                  />
                  <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
                    pol
                  </Text>
                </View>
              </View>
            </View>
          )}
        </ShotsyCard>

        <Text style={styles.emoji}>📏</Text>
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
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dualInputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dualInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputSuffix: {
    fontSize: 16,
    fontWeight: '500',
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
});

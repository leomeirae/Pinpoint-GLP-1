import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface TargetWeightScreenProps {
  onNext: (data: { targetWeight: number }) => void;
  onBack: () => void;
  weightUnit?: 'kg' | 'lb';
  currentWeight?: number;
  startingWeight?: number;
  height?: number;
}

export function TargetWeightScreen({
  onNext,
  onBack,
  weightUnit = 'kg',
  currentWeight = 0,
  startingWeight = 0,
  height = 170,
}: TargetWeightScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [weight, setWeight] = useState('');

  const handleNext = () => {
    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum) && weightNum > 0) {
        onNext({ targetWeight: weightNum });
      }
    }
  };

  const calculateBMI = (weightKg: number, heightCm: number) => {
    const heightM = heightCm / 100;
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const targetWeightNum = parseFloat(weight);
  const showProgress = !isNaN(targetWeightNum) && targetWeightNum > 0;

  const weightToLose = currentWeight - targetWeightNum;
  const currentBMI = calculateBMI(currentWeight, height);
  const targetBMI = showProgress ? calculateBMI(targetWeightNum, height) : '0';

  const isValid = weight && !isNaN(targetWeightNum) && targetWeightNum > 0 && targetWeightNum < currentWeight;

  return (
    <OnboardingScreenBase
      title="Qual é o seu peso meta?"
      subtitle="Defina um objetivo realista e saudável"
      onNext={handleNext}
      onBack={onBack}
      disableNext={!isValid}
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.inputCard}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Peso meta
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={weightUnit === 'kg' ? '70.0' : '154.0'}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
              {weightUnit}
            </Text>
          </View>
        </ShotsyCard>

        {showProgress && (
          <>
            <ShotsyCard style={styles.progressCard}>
              <Text style={[styles.progressTitle, { color: colors.text }]}>
                Sua jornada
              </Text>
              <View style={styles.progressBar}>
                <View style={styles.progressLabels}>
                  <View style={styles.progressLabel}>
                    <Text style={[styles.progressValue, { color: colors.text }]}>
                      {startingWeight.toFixed(1)}
                    </Text>
                    <Text style={[styles.progressLabelText, { color: colors.textMuted }]}>
                      Início
                    </Text>
                  </View>
                  <View style={styles.progressLabel}>
                    <Text style={[styles.progressValue, { color: currentAccent }]}>
                      {currentWeight.toFixed(1)}
                    </Text>
                    <Text style={[styles.progressLabelText, { color: colors.textMuted }]}>
                      Atual
                    </Text>
                  </View>
                  <View style={styles.progressLabel}>
                    <Text style={[styles.progressValue, { color: colors.text }]}>
                      {targetWeightNum.toFixed(1)}
                    </Text>
                    <Text style={[styles.progressLabelText, { color: colors.textMuted }]}>
                      Meta
                    </Text>
                  </View>
                </View>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: currentAccent,
                        width: `${((startingWeight - currentWeight) / (startingWeight - targetWeightNum)) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
              <Text style={[styles.progressGoal, { color: colors.textSecondary }]}>
                Meta: perder {weightToLose.toFixed(1)} {weightUnit}
              </Text>
            </ShotsyCard>

            <ShotsyCard style={styles.bmiCard}>
              <Text style={[styles.bmiTitle, { color: colors.text }]}>
                IMC (Índice de Massa Corporal)
              </Text>
              <View style={styles.bmiRow}>
                <View style={styles.bmiItem}>
                  <Text style={[styles.bmiValue, { color: colors.textSecondary }]}>
                    {currentBMI}
                  </Text>
                  <Text style={[styles.bmiLabel, { color: colors.textMuted }]}>
                    Atual
                  </Text>
                </View>
                <Text style={[styles.bmiArrow, { color: colors.textMuted }]}>→</Text>
                <View style={styles.bmiItem}>
                  <Text style={[styles.bmiValue, { color: currentAccent }]}>
                    {targetBMI}
                  </Text>
                  <Text style={[styles.bmiLabel, { color: colors.textMuted }]}>
                    Meta
                  </Text>
                </View>
              </View>
            </ShotsyCard>
          </>
        )}

        <Text style={styles.emoji}>🎯</Text>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
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
  progressCard: {
    padding: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressBar: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressLabelText: {
    fontSize: 12,
    marginTop: 2,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressGoal: {
    fontSize: 14,
    textAlign: 'center',
  },
  bmiCard: {
    padding: 20,
  },
  bmiTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  bmiRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
  },
  bmiItem: {
    alignItems: 'center',
  },
  bmiValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  bmiLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  bmiArrow: {
    fontSize: 24,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { Ionicons } from '@expo/vector-icons';

interface WeightLossRateScreenProps {
  onNext: (data: { weightLossRate: number }) => void;
  onBack: () => void;
  weightUnit?: 'kg' | 'lb';
}

const rates = [
  {
    value: 0.5,
    label: 'Lento e constante',
    description: '0,5 kg/semana',
    lbDescription: '1 lb/semana',
  },
  { value: 1, label: 'Moderado', description: '1 kg/semana', lbDescription: '2 lb/semana' },
  { value: 1.5, label: 'Rápido', description: '1,5 kg/semana', lbDescription: '3 lb/semana' },
];

export function WeightLossRateScreen({
  onNext,
  onBack,
  weightUnit = 'kg',
}: WeightLossRateScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleNext = () => {
    onNext({ weightLossRate: rates[selectedIndex].value });
  };

  const currentRate = rates[selectedIndex];

  return (
    <OnboardingScreenBase
      title="Qual velocidade de perda de peso você espera?"
      subtitle="Isso nos ajuda a projetar sua jornada de forma realista"
      onNext={handleNext}
      onBack={onBack}
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.rateCard}>
          <Text style={[styles.rateLabel, { color: colors.textSecondary }]}>
            {currentRate.label}
          </Text>
          <Text style={[styles.rateValue, { color: currentAccent }]}>
            {weightUnit === 'kg' ? currentRate.description : currentRate.lbDescription}
          </Text>
        </ShotsyCard>

        <View style={styles.optionsContainer}>
          {rates.map((rate, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                {
                  backgroundColor: selectedIndex === index ? currentAccent : colors.card,
                  borderColor: selectedIndex === index ? currentAccent : colors.border,
                },
              ]}
              onPress={() => setSelectedIndex(index)}
            >
              <Text
                style={[
                  styles.optionLabel,
                  { color: selectedIndex === index ? '#FFFFFF' : colors.text },
                ]}
              >
                {rate.label}
              </Text>
              {selectedIndex === index && (
                <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <ShotsyCard style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Estudos mostram que uma perda de peso gradual e consistente é mais sustentável a longo
            prazo. Lembre-se: cada pessoa responde de forma diferente ao tratamento.
          </Text>
        </ShotsyCard>

        <Text style={styles.emoji}>⚖️</Text>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  infoCard: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  infoEmoji: {
    fontSize: 24,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
  option: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 12,
  },
  rateCard: {
    alignItems: 'center',
    padding: 32,
  },
  rateLabel: {
    fontSize: 18,
    marginBottom: 8,
  },
  rateValue: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';

interface InitialDoseScreenProps {
  onNext: (data: { initialDose: string }) => void;
  onBack: () => void;
  medication?: string;
}

// V0 Design: Simple list with "Outro" option
const dosages = ['2.5mg', '5mg', '7.5mg', '10mg', '12.5mg', '15mg', 'Outro'];

export function InitialDoseScreen({
  onNext,
  onBack,
  medication = 'tirzepatide',
}: InitialDoseScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected) {
      onNext({ initialDose: selected });
    }
  };

  return (
    <OnboardingScreenBase
      title="Você sabe sua dose inicial recomendada?"
      subtitle="Não tem problema se você não tiver certeza!"
      onNext={handleNext}
      onBack={onBack}
      disableNext={!selected}
    >
      <View style={styles.content}>
        {dosages.map((dosage) => (
          <TouchableOpacity
            key={dosage}
            style={[
              styles.option,
              {
                backgroundColor: colors.backgroundSecondary,
                borderColor: selected === dosage ? colors.primary : 'transparent',
                borderWidth: selected === dosage ? 2 : 0,
              },
            ]}
            onPress={() => setSelected(dosage)}
          >
            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radio,
                  {
                    borderColor: selected === dosage ? colors.primary : colors.border,
                  },
                ]}
              >
                {selected === dosage && (
                  <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                )}
              </View>
              <Text style={[styles.optionLabel, { color: colors.text }]}>{dosage}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 24,
  },
  option: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    minHeight: 60,
    padding: 20,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  radio: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  radioInner: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
});

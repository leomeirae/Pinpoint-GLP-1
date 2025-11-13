import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { Ionicons } from '@expo/vector-icons';

interface SideEffectsConcernsScreenProps {
  onNext: (data: { sideEffectsConcerns: string[] }) => void;
  onBack: () => void;
}

// V0 Design: Simple list
const options = [
  'Náusea',
  'Azia',
  'Fadiga',
  'Queda de cabelo',
  'Prisão de Ventre',
  'Perda de massa muscular',
];

export function SideEffectsConcernsScreen({ onNext, onBack }: SideEffectsConcernsScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelection = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option]
    );
  };

  const handleNext = () => {
    onNext({ sideEffectsConcerns: selected });
  };

  return (
    <OnboardingScreenBase
      title="Quais efeitos colaterais mais te preocupam (se houver)?"
      subtitle="Nos informe para que possamos personalizar sua experiência."
      onNext={handleNext}
      onBack={onBack}
      disableNext={selected.length === 0}
    >
      <View style={styles.content}>
        {options.map((option) => {
          const isSelected = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected
                    ? colors.backgroundSecondary
                    : colors.backgroundSecondary,
                  borderColor: isSelected ? colors.border : 'transparent',
                  borderWidth: isSelected ? 2 : 0,
                },
              ]}
              onPress={() => toggleSelection(option)}
            >
              <View style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isSelected ? colors.primary : colors.border,
                      backgroundColor: isSelected ? colors.primary : 'transparent',
                    },
                  ]}
                >
                  {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
                </View>
                <Text style={[styles.optionLabel, { color: colors.text }]}>{option}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  checkbox: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    gap: 12,
    paddingHorizontal: 24,
    paddingTop: 8, // Extra padding to avoid overlap with back button
  },
  option: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    minHeight: 60,
    padding: 16,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});

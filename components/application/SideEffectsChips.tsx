import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface SideEffectsChipsProps {
  value: string[];
  onChange: (effects: string[]) => void;
}

const SIDE_EFFECTS = [
  'Náusea',
  'Vômito',
  'Diarreia',
  'Constipação',
  'Fadiga',
  'Dor de cabeça',
  'Tontura',
  'Azia',
  'Gases',
  'Dor abdominal',
];

export function SideEffectsChips({ value, onChange }: SideEffectsChipsProps) {
  const colors = useShotsyColors();

  const toggleEffect = (effect: string) => {
    if (value.includes(effect)) {
      onChange(value.filter(e => e !== effect));
    } else {
      onChange([...value, effect]);
    }
  };

  return (
    <View style={styles.container}>
      {SIDE_EFFECTS.map((effect) => {
        const isSelected = value.includes(effect);
        return (
          <TouchableOpacity
            key={effect}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.cardSecondary,
                borderColor: isSelected ? colors.primary : colors.border,
              }
            ]}
            onPress={() => toggleEffect(effect)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.chipText,
                { color: isSelected ? '#FFFFFF' : colors.text }
              ]}
            >
              {effect}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    margin: 4,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface DosageSelectorProps {
  value: number | null;
  onChange: (dosage: number) => void;
}

const DOSAGES = [2.5, 5, 7.5, 10, 12.5, 15];

export function DosageSelector({ value, onChange }: DosageSelectorProps) {
  const colors = useShotsyColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {DOSAGES.map((dosage) => {
        const isSelected = value === dosage;
        return (
          <TouchableOpacity
            key={dosage}
            style={[
              styles.button,
              {
                borderColor: isSelected ? colors.primary : colors.border,
                backgroundColor: isSelected ? colors.primary : 'transparent',
              },
            ]}
            onPress={() => onChange(dosage)}
            activeOpacity={0.7}
          >
            <Text style={[styles.text, { color: isSelected ? '#FFFFFF' : colors.text }]}>
              {dosage}mg
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    borderWidth: 2,
    marginRight: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  container: {
    paddingVertical: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});

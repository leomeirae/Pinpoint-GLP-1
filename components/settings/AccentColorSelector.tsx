import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@/lib/theme-context';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ACCENT_COLORS, type AccentColor } from '@/constants/ShotsyThemes';

export const AccentColorSelector: React.FC = () => {
  const { setAccentColor, currentAccent } = useTheme();
  const colors = useShotsyColors();

  const accentOptions: Array<{ id: AccentColor; label: string; color: string }> = [
    { id: 'yellow', label: 'Amarelo', color: ACCENT_COLORS.yellow },
    { id: 'orange', label: 'Laranja', color: ACCENT_COLORS.orange },
    { id: 'pink', label: 'Rosa', color: ACCENT_COLORS.pink },
    { id: 'purple', label: 'Roxo', color: ACCENT_COLORS.purple },
    { id: 'blue', label: 'Azul', color: ACCENT_COLORS.blue },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {accentOptions.map((accent) => {
          const isSelected = currentAccent === accent.color;

          return (
            <TouchableOpacity
              key={accent.id}
              style={[
                styles.colorOption,
                {
                  borderColor: isSelected ? accent.color : colors.border,
                  borderWidth: isSelected ? 3 : 1.5,
                },
              ]}
              onPress={() => setAccentColor(accent.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.colorCircle, { backgroundColor: accent.color }]}>
                {isSelected && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkIcon}>✓</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.colorLabel,
                  {
                    color: isSelected ? colors.text : colors.textSecondary,
                    fontWeight: isSelected ? '700' : '600',
                  },
                ]}
              >
                {accent.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  checkmark: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkmarkIcon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  colorCircle: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    marginBottom: 8,
    width: 48,
  },
  colorLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  colorOption: {
    alignItems: 'center',
    borderRadius: 12,
    minWidth: 80,
    padding: 12,
  },
  container: {
    paddingVertical: 8,
  },
  scrollContent: {
    gap: 16,
    paddingHorizontal: 16,
  },
});

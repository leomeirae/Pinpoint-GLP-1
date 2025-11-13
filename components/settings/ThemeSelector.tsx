import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@/lib/theme-context';
import { useShotsyColors } from '@/hooks/useShotsyColors';

export const ThemeSelector: React.FC = () => {
  const { mode, setMode } = useTheme();
  const colors = useShotsyColors();

  const themes = [
    { id: 'light' as const, label: 'Claro', icon: '☀️' },
    { id: 'dark' as const, label: 'Escuro', icon: '🌙' },
    { id: 'system' as const, label: 'Sistema', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {themes.map((theme, index) => (
        <TouchableOpacity
          key={theme.id}
          style={[
            styles.themeOption,
            {
              backgroundColor: mode === theme.id ? colors.primary + '20' : colors.card,
              borderColor: mode === theme.id ? colors.primary : colors.border,
            },
            index === 0 && styles.firstOption,
            index === themes.length - 1 && styles.lastOption,
          ]}
          onPress={() => setMode(theme.id)}
          activeOpacity={0.7}
        >
          <View style={styles.optionContent}>
            <Text style={styles.icon}>{theme.icon}</Text>
            <Text
              style={[
                styles.label,
                {
                  color: mode === theme.id ? colors.primary : colors.text,
                },
              ]}
            >
              {theme.label}
            </Text>
          </View>
          {mode === theme.id && (
            <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
              <Text
                style={[styles.checkmarkIcon, { color: colors.isDark ? colors.text : '#FFFFFF' }]}
              >
                ✓
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkmark: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkmarkIcon: {
    fontSize: 14,
    fontWeight: '700',
  },
  container: {
    gap: 0,
  },
  firstOption: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  icon: {
    fontSize: 24,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastOption: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  optionContent: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  themeOption: {
    alignItems: 'center',
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
});

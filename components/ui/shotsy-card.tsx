import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '@/lib/theme-context';

interface ShotsyCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'default' | 'elevated' | 'outline';
}

export function ShotsyCard({ children, style, variant = 'default' }: ShotsyCardProps) {
  const { effectiveMode, colors } = useTheme();
  const isDark = effectiveMode === 'dark';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? colors.cardDark : colors.cardLight,
          borderColor: variant === 'outline' ? (isDark ? colors.borderDark : colors.borderLight) : 'transparent',
        },
        variant === 'elevated' && styles.elevated,
        variant === 'outline' && styles.outline,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
  },
  elevated: {
    shadowColor: '#000', // Shadow color is always black, opacity varies
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, // Lighter shadow for both modes
    shadowRadius: 8,
    elevation: 3,
  },
  outline: {
    borderWidth: 1,
  },
});

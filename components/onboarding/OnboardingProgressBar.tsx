import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';

interface OnboardingProgressBarProps {
  current: number;
  total: number;
}

export function OnboardingProgressBar({ current, total }: OnboardingProgressBarProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const progress = (current / total) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <View style={[styles.progressBackground, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${progress}%`,
                backgroundColor: currentAccent,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {current} de {total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  progressBackground: {
    borderRadius: 3,
    flex: 1,
    height: 6,
    overflow: 'hidden',
  },
  progressBar: {
    borderRadius: 3,
    height: '100%',
  },
  progressContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
    textAlign: 'right',
  },
});

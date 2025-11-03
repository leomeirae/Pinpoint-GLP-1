import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';

export type PeriodFilter = '7days' | '30days' | '90days' | 'all';

interface PeriodSelectorProps {
  selectedPeriod: PeriodFilter;
  onPeriodChange: (period: PeriodFilter) => void;
}

const PERIODS: { key: PeriodFilter; label: string }[] = [
  { key: '7days', label: '7 dias' },
  { key: '30days', label: '30 dias' },
  { key: '90days', label: '90 dias' },
  { key: 'all', label: 'Tudo' },
];

export const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {PERIODS.map((period) => {
        const isSelected = period.key === selectedPeriod;
        return (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.tab,
              {
                backgroundColor: isSelected ? currentAccent : colors.card,
                borderColor: isSelected ? currentAccent : colors.border,
              },
            ]}
            onPress={() => onPeriodChange(period.key)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: isSelected ? '#FFFFFF' : colors.text,
                  fontWeight: isSelected ? '700' : '600',
                },
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    maxHeight: 50,
  },
  content: {
    paddingHorizontal: 16,
    gap: 10,
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 15,
  },
});

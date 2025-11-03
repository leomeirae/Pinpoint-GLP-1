import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';

type Period = 'week' | 'month' | '90days' | 'all';

interface MedicationLevelChartProps {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  data?: any;
}

export function MedicationLevelChart({}: MedicationLevelChartProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const { width } = useWindowDimensions(); // ✅ Responsivo a rotação do dispositivo
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');

  // Dados de exemplo - serão substituídos por dados reais
  const chartData = {
    labels: ['6/22', '6/29', '7/6', '7/13'],
    datasets: [
      {
        data: [0.8, 1.2, 0.7, 1.17],
        color: () => currentAccent,
        strokeWidth: 3,
      },
    ],
  };

  const periods: { key: Period; label: string }[] = [
    { key: 'week', label: 'Semana' },
    { key: 'month', label: 'Mês' },
    { key: '90days', label: '90 dias' },
    { key: 'all', label: 'Tudo' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Níveis Estimados de Medicação
        </Text>
        <Text style={[styles.info, { color: colors.textMuted }]}>ⓘ</Text>
      </View>

      {/* Tabs de período */}
      <View style={styles.tabs}>
        {periods.map((period) => (
          <TouchableOpacity
            key={period.key}
            style={[
              styles.tab,
              {
                backgroundColor:
                  selectedPeriod === period.key
                    ? colors.card
                    : 'transparent',
              },
            ]}
            onPress={() => setSelectedPeriod(period.key)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    selectedPeriod === period.key
                      ? colors.text
                      : colors.textMuted,
                  fontWeight: selectedPeriod === period.key ? '600' : '400',
                },
              ]}
            >
              {period.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botão Jump to Today */}
      <View style={styles.jumpContainer}>
        <TouchableOpacity
          style={[styles.jumpButton, { backgroundColor: colors.card }]}
        >
          <Text style={[styles.jumpText, { color: colors.textSecondary }]}>
            Jump to Today
          </Text>
        </TouchableOpacity>
      </View>

      {/* Valor atual */}
      <View style={styles.currentValue}>
        <Text style={[styles.currentValueNumber, { color: colors.text }]}>
          1.17mg
        </Text>
        <Text style={[styles.currentValueDate, { color: colors.textSecondary }]}>
          Jul 6, 2025 at 7 PM
        </Text>
      </View>

      {/* Gráfico */}
      <LineChart
        data={chartData}
        width={width - 48}
        height={220}
        chartConfig={{
          backgroundColor: colors.background,
          backgroundGradientFrom: colors.background,
          backgroundGradientTo: colors.background,
          decimalPlaces: 2,
          color: () => currentAccent,
          labelColor: () => colors.textMuted,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: currentAccent,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines
        withOuterLines
        withVerticalLines={false}
        withHorizontalLines
        withDots
        withShadow={false}
        fromZero
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  info: {
    fontSize: 16,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tabText: {
    fontSize: 14,
  },
  jumpContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  jumpButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  jumpText: {
    fontSize: 12,
    fontWeight: '500',
  },
  currentValue: {
    alignItems: 'center',
    marginBottom: 8,
  },
  currentValueNumber: {
    fontSize: 28,
    fontWeight: '700',
  },
  currentValueDate: {
    fontSize: 12,
  },
  chart: {
    borderRadius: 16,
  },
});

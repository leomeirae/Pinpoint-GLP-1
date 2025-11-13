import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';

interface WeightDataPoint {
  date: Date;
  weight: number;
  dosage?: number; // Optional dosage for tooltip
}

interface WeightChartProps {
  data: WeightDataPoint[];
  targetWeight: number;
  periodFilter: 'week' | 'month' | '90days' | 'all';
}

export const WeightChart: React.FC<WeightChartProps> = ({ data, targetWeight, periodFilter }) => {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const { width } = useWindowDimensions();

  // Filter data based on period
  const filteredData = useMemo(() => {
    const now = new Date();
    switch (periodFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter((d) => d.date >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return data.filter((d) => d.date >= monthAgo);
      case '90days':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return data.filter((d) => d.date >= ninetyDaysAgo);
      default:
        return data;
    }
  }, [data, periodFilter]);

  // Prepare chart data - V0 Design: Format dates as "Mar 2025"
  const chartData = useMemo(() => {
    const weights = filteredData.map((d) => d.weight);
    const labels = filteredData.map((d) => {
      // V0 Design: Format as "Mar 2025"
      return d.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    });

    return {
      labels,
      datasets: [
        {
          data: weights,
        },
      ],
    };
  }, [filteredData]);

  // Calculate Y-axis domain - V0 Design: Fixed domain based on data range
  const yDomain = useMemo(() => {
    if (filteredData.length === 0) return [0, 100];
    const weights = filteredData.map((d) => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = (max - min) * 0.1; // 10% padding
    return [Math.max(0, min - padding), max + padding];
  }, [filteredData]);

  const hasData = filteredData.length > 0;

  if (!hasData) {
    return (
      <View
        style={[styles.emptyChart, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Nenhum dado de peso disponível
        </Text>
      </View>
    );
  }

  const chartWidth = width - 96; // Account for padding
  const chartHeight = 300; // V0 Design: 300px height

  // V0 Design: Cyan color (#06b6d4) - using currentAccent which should be cyan
  const chartColor = currentAccent || '#06b6d4';

  return (
    <View
      style={[styles.chartContainer, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <LineChart
        data={chartData}
        width={chartWidth}
        height={chartHeight}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 1,
          color: () => chartColor, // V0 Design: Cyan (#06b6d4)
          labelColor: () => colors.textMuted, // V0 Design: Gray (#999)
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4', // V0 Design: radius 4
            strokeWidth: '0',
            stroke: chartColor,
            fill: chartColor,
          },
          propsForBackgroundLines: {
            strokeDasharray: '3 3', // V0 Design: Dashed grid
            stroke: colors.border, // V0 Design: Light gray (#f0f0f0)
            strokeWidth: 1,
          },
        }}
        bezier={false} // V0 Design: Straight line (monotone)
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        segments={4}
        // V0 Design: Custom tooltip showing weight and dosage
        decorator={() => {
          return null; // Tooltip is handled by react-native-chart-kit
        }}
        formatYLabel={(value) => {
          return parseFloat(value).toFixed(0);
        }}
        formatXLabel={(value) => {
          return value; // Already formatted as "Mar 2025"
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  chartContainer: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    padding: 16,
  },
  emptyChart: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 300,
    padding: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

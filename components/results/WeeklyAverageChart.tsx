import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { useTheme } from '@/lib/theme-context';

interface WeightDataPoint {
  date: Date;
  weight: number;
}

interface WeeklyAverageChartProps {
  data: WeightDataPoint[];
  periodFilter: 'week' | 'month' | '90days' | 'all';
}

export const WeeklyAverageChart: React.FC<WeeklyAverageChartProps> = ({
  data,
  periodFilter,
}) => {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const { width } = useWindowDimensions();

  // Filtrar dados baseado no período
  const filteredData = useMemo(() => {
    const now = new Date();
    switch (periodFilter) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return data.filter(d => d.date >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return data.filter(d => d.date >= monthAgo);
      case '90days':
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return data.filter(d => d.date >= ninetyDaysAgo);
      default:
        return data;
    }
  }, [data, periodFilter]);

  // Group data by week and calculate weekly loss
  const weeklyData = useMemo(() => {
    if (filteredData.length < 2) return [];

    const sortedData = [...filteredData].sort((a, b) => a.date.getTime() - b.date.getTime());
    const weeks: { weekStart: Date; loss: number }[] = [];

    // Get the first date as reference
    const firstDate = sortedData[0].date;

    // Group by week
    const weekMap = new Map<number, { weights: number[]; weekStart: Date }>();

    sortedData.forEach((point) => {
      const daysSinceStart = Math.floor(
        (point.date.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const weekNumber = Math.floor(daysSinceStart / 7);

      if (!weekMap.has(weekNumber)) {
        weekMap.set(weekNumber, {
          weights: [],
          weekStart: new Date(firstDate.getTime() + weekNumber * 7 * 24 * 60 * 60 * 1000),
        });
      }

      weekMap.get(weekNumber)!.weights.push(point.weight);
    });

    // Calculate weekly loss
    const weekNumbers = Array.from(weekMap.keys()).sort((a, b) => a - b);
    for (let i = 1; i < weekNumbers.length; i++) {
      const prevWeek = weekMap.get(weekNumbers[i - 1])!;
      const currentWeek = weekMap.get(weekNumbers[i])!;

      const prevAvg = prevWeek.weights.reduce((a, b) => a + b, 0) / prevWeek.weights.length;
      const currentAvg = currentWeek.weights.reduce((a, b) => a + b, 0) / currentWeek.weights.length;

      const loss = prevAvg - currentAvg;

      weeks.push({
        weekStart: currentWeek.weekStart,
        loss: Math.max(0, loss), // Only show positive losses
      });
    }

    return weeks;
  }, [filteredData]);

  const hasData = weeklyData.length > 0;

  if (!hasData) {
    return (
      <ShotsyCard style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>Perda Semanal</Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Adicione registros de peso de pelo menos 2 semanas para visualizar esta comparação.
          </Text>
        </View>
      </ShotsyCard>
    );
  }

  const losses = weeklyData.map(d => d.loss);
  const labels = weeklyData.map((d, index) => {
    const weekNumber = index + 1;
    return `S${weekNumber}`;
  });

  const avgLoss = losses.reduce((a, b) => a + b, 0) / losses.length;
  const maxLoss = Math.max(...losses);
  const minLoss = Math.min(...losses);

  const chartData = {
    labels,
    datasets: [
      {
        data: losses,
      },
    ],
  };

  return (
    <ShotsyCard style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>Perda Semanal</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Média</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            -{avgLoss.toFixed(1)} kg
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Melhor</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            -{maxLoss.toFixed(1)} kg
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Menor</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            -{minLoss.toFixed(1)} kg
          </Text>
        </View>
      </View>

      <BarChart
        data={chartData}
        width={width - 64}
        height={220}
        yAxisLabel=""
        yAxisSuffix=" kg"
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 1,
          color: () => currentAccent,
          labelColor: () => colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
          },
        }}
        style={styles.chart}
        showValuesOnTopOfBars
        fromZero
      />

      <Text style={[styles.hint, { color: colors.textSecondary }]}>
        Compare a perda de peso entre diferentes semanas do tratamento
      </Text>
    </ShotsyCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  hint: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

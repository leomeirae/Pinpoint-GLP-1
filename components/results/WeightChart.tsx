import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { useTheme } from '@/lib/theme-context';

interface WeightDataPoint {
  date: Date;
  weight: number;
}

interface WeightChartProps {
  data: WeightDataPoint[];
  targetWeight: number;
  periodFilter: 'week' | 'month' | '90days' | 'all';
}

export const WeightChart: React.FC<WeightChartProps> = ({
  data,
  targetWeight,
  periodFilter,
}) => {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const { width } = useWindowDimensions();
  const [selectedPoint, setSelectedPoint] = useState<{ index: number; value: number; date: Date } | null>(null);

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

  // Calculate trend line using linear regression
  const trendLine = useMemo(() => {
    if (filteredData.length < 2) return null;

    const n = filteredData.length;
    const xValues = filteredData.map((_, i) => i);
    const yValues = filteredData.map(d => d.weight);

    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return xValues.map(x => slope * x + intercept);
  }, [filteredData]);

  // Calculate average weekly loss for projection
  const avgWeeklyLoss = useMemo(() => {
    if (filteredData.length < 2) return 0.5;
    const firstWeight = filteredData[filteredData.length - 1].weight;
    const lastWeight = filteredData[0].weight;
    const timeDiff = filteredData[0].date.getTime() - filteredData[filteredData.length - 1].date.getTime();
    const weeks = timeDiff / (7 * 24 * 60 * 60 * 1000);
    return weeks > 0 ? (firstWeight - lastWeight) / weeks : 0.5;
  }, [filteredData]);

  // Preparar dados para o gráfico
  const weights = filteredData.map(d => d.weight);
  const labels = filteredData.map(d => {
    const day = d.date.getDate();
    const month = d.date.getMonth() + 1;
    return `${day}/${month}`;
  });

  const hasData = weights.length > 0;

  if (!hasData) {
    return (
      <ShotsyCard style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>Evolução de Peso</Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Ainda não há dados suficientes para montar o gráfico.
          </Text>
        </View>
      </ShotsyCard>
    );
  }

  // Handle data point tap
  const handleDataPointClick = (data: any) => {
    const index = data.index;
    if (index < weights.length) {
      setSelectedPoint({
        index,
        value: weights[index],
        date: filteredData[index].date
      });
    }
  };

  // Adicionar projeção até a meta
  const lastWeight = weights[weights.length - 1];
  const weeksToGoal = avgWeeklyLoss > 0 ? Math.ceil((lastWeight - targetWeight) / avgWeeklyLoss) : 0;

  // Adicionar pontos de projeção (máximo 12 semanas)
  const projectionWeights = [];
  for (let i = 1; i <= Math.min(weeksToGoal, 12); i++) {
    projectionWeights.push(Math.max(lastWeight - (avgWeeklyLoss * i), targetWeight));
  }

  // Prepare datasets with trend line and goal line
  const datasets: any[] = [
    {
      data: [...weights, ...projectionWeights],
      color: () => currentAccent,
      strokeWidth: 3,
    },
  ];

  // Add trend line dataset
  if (trendLine) {
    datasets.push({
      data: [...trendLine, ...Array(projectionWeights.length).fill(trendLine[trendLine.length - 1])],
      color: () => colors.textSecondary + '40',
      strokeWidth: 2,
      withDots: false,
    });
  }

  // Add goal line (horizontal line at target weight)
  const goalLineData = Array(weights.length + projectionWeights.length).fill(targetWeight);
  datasets.push({
    data: goalLineData,
    color: () => colors.success,
    strokeWidth: 2,
    withDots: false,
    strokeDasharray: [5, 5],
  });

  const chartData = {
    labels: [...labels, ...Array(projectionWeights.length).fill('')],
    datasets,
  };

  return (
    <ShotsyCard style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>Evolução de Peso</Text>

      {/* Selected Point Display */}
      {selectedPoint && (
        <TouchableOpacity
          style={[styles.selectedPointBanner, { backgroundColor: colors.background }]}
          onPress={() => setSelectedPoint(null)}
        >
          <Text style={[styles.selectedPointWeight, { color: currentAccent }]}>
            {selectedPoint.value.toFixed(1)} kg
          </Text>
          <Text style={[styles.selectedPointDate, { color: colors.textSecondary }]}>
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            }).format(selectedPoint.date)}
          </Text>
        </TouchableOpacity>
      )}

      <LineChart
        data={chartData}
        width={width - 64}
        height={220}
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
          propsForDots: {
            r: '6',
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
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLabels={true}
        withHorizontalLabels={true}
        segments={4}
        onDataPointClick={handleDataPointClick}
      />
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: currentAccent }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Peso atual
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.textSecondary, opacity: 0.25 }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Tendência
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>
            Meta ({targetWeight.toFixed(1)} kg)
          </Text>
        </View>
      </View>
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
  selectedPointBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedPointWeight: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedPointDate: {
    fontSize: 13,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
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

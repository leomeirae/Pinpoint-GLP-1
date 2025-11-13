import React, { useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { useTheme } from '@/lib/theme-context';

interface WeightDataPoint {
  date: Date;
  weight: number;
}

interface ProgressChartProps {
  data: WeightDataPoint[];
  startWeight: number;
  targetWeight: number;
  periodFilter: 'week' | 'month' | '90days' | 'all';
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  data,
  startWeight,
  targetWeight,
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

  // Calculate progress percentages
  const progressData = useMemo(() => {
    const totalToLose = startWeight - targetWeight;
    if (totalToLose <= 0) return [];

    return filteredData.map((d) => {
      const lost = startWeight - d.weight;
      const progress = Math.max(0, Math.min(100, (lost / totalToLose) * 100));
      return {
        date: d.date,
        progress,
      };
    });
  }, [filteredData, startWeight, targetWeight]);

  // Calculate projected completion date
  const projectedCompletion = useMemo(() => {
    if (progressData.length < 2) return null;

    const firstPoint = progressData[progressData.length - 1];
    const lastPoint = progressData[0];
    const progressGain = lastPoint.progress - firstPoint.progress;
    const timeDiff = lastPoint.date.getTime() - firstPoint.date.getTime();
    const days = timeDiff / (1000 * 60 * 60 * 24);

    if (progressGain <= 0) return null;

    const dailyProgress = progressGain / days;
    const remainingProgress = 100 - lastPoint.progress;
    const daysToCompletion = remainingProgress / dailyProgress;

    if (daysToCompletion <= 0 || !isFinite(daysToCompletion)) return null;

    const completionDate = new Date(
      lastPoint.date.getTime() + daysToCompletion * 24 * 60 * 60 * 1000
    );
    return completionDate;
  }, [progressData]);

  const hasData = progressData.length > 0;

  if (!hasData) {
    return (
      <ShotsyCard style={styles.card}>
        <Text style={[styles.title, { color: colors.text }]}>Progresso até a Meta</Text>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Adicione mais registros de peso para visualizar seu progresso.
          </Text>
        </View>
      </ShotsyCard>
    );
  }

  const progressValues = progressData.map((d) => d.progress);
  const labels = progressData.map((d) => {
    const day = d.date.getDate();
    const month = d.date.getMonth() + 1;
    return `${day}/${month}`;
  });

  const currentProgress = progressValues[progressValues.length - 1];

  // Create projection line
  const projectionValues = [];
  if (projectedCompletion && currentProgress < 100) {
    const lastDate = progressData[0].date;
    const weeksToGoal = Math.ceil(
      (projectedCompletion.getTime() - lastDate.getTime()) / (7 * 24 * 60 * 60 * 1000)
    );

    for (let i = 1; i <= Math.min(weeksToGoal, 12); i++) {
      const progress = Math.min(100, currentProgress + (100 - currentProgress) * (i / weeksToGoal));
      projectionValues.push(progress);
    }
  }

  const chartData = {
    labels: [...labels, ...Array(projectionValues.length).fill('')],
    datasets: [
      {
        data: [...progressValues, ...projectionValues],
        color: () => currentAccent,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ShotsyCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Progresso até a Meta</Text>
          <Text style={[styles.currentProgress, { color: currentAccent }]}>
            {currentProgress.toFixed(1)}% concluído
          </Text>
        </View>
      </View>

      {projectedCompletion && currentProgress < 100 && (
        <View style={[styles.projectionBanner, { backgroundColor: colors.background }]}>
          <Text style={[styles.projectionLabel, { color: colors.textSecondary }]}>
            Projeção de conclusão
          </Text>
          <Text style={[styles.projectionDate, { color: currentAccent }]}>
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).format(projectedCompletion)}
          </Text>
        </View>
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
          formatYLabel: (value) => `${value}%`,
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
        segments={4}
      />

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: currentAccent }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Progresso Atual</Text>
        </View>
        {projectionValues.length > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: currentAccent, opacity: 0.5 }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>Projeção</Text>
          </View>
        )}
      </View>
    </ShotsyCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    padding: 16,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  currentProgress: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
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
  header: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    marginTop: 12,
  },
  legendDot: {
    borderRadius: 5,
    height: 10,
    width: 10,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  legendText: {
    fontSize: 11,
  },
  projectionBanner: {
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  projectionDate: {
    fontSize: 16,
    fontWeight: '700',
  },
  projectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
});

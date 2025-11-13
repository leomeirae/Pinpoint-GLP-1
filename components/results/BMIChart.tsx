import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface BMIDataPoint {
  date: Date;
  bmi: number;
}

interface BMIChartProps {
  data: BMIDataPoint[];
  periodFilter: 'week' | 'month' | '90days' | 'all';
}

export const BMIChart: React.FC<BMIChartProps> = ({ data, periodFilter }) => {
  const colors = useShotsyColors();
  const { width } = useWindowDimensions();
  const [selectedPoint, setSelectedPoint] = useState<{
    index: number;
    value: number;
    date: Date;
  } | null>(null);

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

  const bmis = filteredData.map((d) => d.bmi);
  const labels = filteredData.map((d, index) => {
    return index % 3 === 0 ? `${d.date.getDate()}/${d.date.getMonth() + 1}` : '';
  });

  const hasData = bmis.length > 0;

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Abaixo do peso', color: colors.info };
    if (bmi < 25) return { text: 'Normal', color: colors.success };
    if (bmi < 30) return { text: 'Sobrepeso', color: colors.warning };
    return { text: 'Obesidade', color: colors.error };
  };

  const handleDataPointClick = (data: any) => {
    const index = data.index;
    if (index < bmis.length) {
      setSelectedPoint({
        index,
        value: bmis[index],
        date: filteredData[index].date,
      });
    }
  };

  if (!hasData) {
    return (
      <ShotsyCard style={styles.card}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Evolução de IMC</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
            Registre seus pesos para visualizar o gráfico de IMC.
          </Text>
        </View>
      </ShotsyCard>
    );
  }

  const currentBMI = bmis[bmis.length - 1];
  const category = getBMICategory(currentBMI);

  const chartData = {
    labels,
    datasets: [
      {
        data: bmis,
        color: () => category.color,
        strokeWidth: 3,
      },
    ],
  };

  return (
    <ShotsyCard style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Evolução de IMC</Text>
          <Text style={[styles.currentBMI, { color: category.color }]}>
            {currentBMI.toFixed(1)} - {category.text}
          </Text>
        </View>
      </View>

      {/* Selected Point Display */}
      {selectedPoint && (
        <TouchableOpacity
          style={[styles.selectedPointBanner, { backgroundColor: colors.background }]}
          onPress={() => setSelectedPoint(null)}
        >
          <Text
            style={[styles.selectedPointBMI, { color: getBMICategory(selectedPoint.value).color }]}
          >
            IMC: {selectedPoint.value.toFixed(1)}
          </Text>
          <Text style={[styles.selectedPointCategory, { color: colors.text }]}>
            {getBMICategory(selectedPoint.value).text}
          </Text>
          <Text style={[styles.selectedPointDate, { color: colors.textSecondary }]}>
            {new Intl.DateTimeFormat('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            }).format(selectedPoint.date)}
          </Text>
        </TouchableOpacity>
      )}

      <LineChart
        data={chartData}
        width={width - 64}
        height={200}
        chartConfig={{
          backgroundColor: colors.card,
          backgroundGradientFrom: colors.card,
          backgroundGradientTo: colors.card,
          decimalPlaces: 1,
          color: () => category.color,
          labelColor: () => colors.textSecondary,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: category.color,
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: colors.border,
            strokeWidth: 1,
          },
        }}
        bezier
        style={styles.chart}
        segments={4}
        onDataPointClick={handleDataPointClick}
      />
      <View style={styles.zones}>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.zoneText, { color: colors.textSecondary }]}>Normal (18.5-24.9)</Text>
        </View>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneDot, { backgroundColor: colors.warning }]} />
          <Text style={[styles.zoneText, { color: colors.textSecondary }]}>
            Sobrepeso (25-29.9)
          </Text>
        </View>
        <View style={styles.zoneItem}>
          <View style={[styles.zoneDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.zoneText, { color: colors.textSecondary }]}>Obesidade (30+)</Text>
        </View>
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
  currentBMI: {
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
  selectedPointBMI: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  selectedPointBanner: {
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
  },
  selectedPointCategory: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedPointDate: {
    fontSize: 13,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  zoneDot: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
  zoneItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  zoneText: {
    fontSize: 12,
  },
  zones: {
    gap: 8,
    marginTop: 12,
  },
});

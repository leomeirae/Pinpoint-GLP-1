/**
 * WeightChartV2 - Gráfico de Peso com Cores por Dosagem (Shotsy-style)
 *
 * Características Shotsy:
 * - Múltiplas linhas coloridas por dosagem
 * - Labels de dosagem no gráfico (2.5mg, 5mg, etc.)
 * - Gradiente de fundo sutil
 * - Grid lines discretas
 * - Seletores de período visual
 * - Pontos destacados
 */

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions, Pressable, ScrollView } from 'react-native';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryLegend,
  VictoryGroup,
} from 'victory';
import { useColors } from '@/hooks/useShotsyColors';
import { getDosageColor, getDosageLabel } from '@/lib/dosageColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';

interface WeightDataPoint {
  date: Date;
  weight: number;
  dosage?: number; // Dosagem atual naquela data
}

interface WeightChartV2Props {
  data: WeightDataPoint[];
  targetWeight?: number;
  initialWeight?: number;
}

type Period = '1month' | '3months' | '6months' | 'all';

interface PeriodOption {
  key: Period;
  label: string;
  months: number;
}

const PERIOD_OPTIONS: PeriodOption[] = [
  { key: '1month', label: '1 month', months: 1 },
  { key: '3months', label: '3 months', months: 3 },
  { key: '6months', label: '6 months', months: 6 },
  { key: 'all', label: 'All time', months: 999 },
];

export const WeightChartV2: React.FC<WeightChartV2Props> = ({
  data,
  targetWeight,
  initialWeight,
}) => {
  const colors = useColors();
  const { width } = useWindowDimensions();
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('3months');

  // Filter data by period
  const filteredData = useMemo(() => {
    if (data.length === 0) return [];

    const period = PERIOD_OPTIONS.find((p) => p.key === selectedPeriod)!;
    if (period.key === 'all') return data;

    const now = new Date();
    const cutoffDate = new Date(now.getTime() - period.months * 30 * 24 * 60 * 60 * 1000);

    return data.filter((d) => d.date >= cutoffDate);
  }, [data, selectedPeriod]);

  // Group data by dosage for multi-line chart
  const groupedByDosage = useMemo(() => {
    const groups: { [dosage: number]: Array<{ x: number; y: number; date: Date }> } = {};

    filteredData.forEach((point, index) => {
      const dosage = point.dosage || 0;
      if (!groups[dosage]) {
        groups[dosage] = [];
      }
      groups[dosage].push({
        x: index,
        y: point.weight,
        date: point.date,
      });
    });

    return Object.entries(groups).map(([dosage, points]) => ({
      dosage: Number(dosage),
      data: points,
      color: getDosageColor(Number(dosage)),
      label: getDosageLabel(Number(dosage)),
    }));
  }, [filteredData]);

  // Calculate statistics
  const stats = useMemo(() => {
    if (filteredData.length === 0) {
      return {
        currentWeight: 0,
        initialWeight: 0,
        minWeight: 0,
        maxWeight: 100,
        totalLost: 0,
        progressPercentage: 0,
      };
    }

    const current = filteredData[0]?.weight || 0;
    const initial = initialWeight || filteredData[filteredData.length - 1]?.weight || current;
    const weights = filteredData.map((d) => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const lost = initial - current;
    const target = targetWeight || initial - 10;
    const progress = Math.min(Math.max(((initial - current) / (initial - target)) * 100, 0), 100);

    return {
      currentWeight: current,
      initialWeight: initial,
      minWeight: min - 2, // Padding
      maxWeight: max + 2, // Padding
      totalLost: lost,
      progressPercentage: progress,
    };
  }, [filteredData, initialWeight, targetWeight]);

  // Empty state
  if (data.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          No weight data available
        </Text>
        <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
          Start tracking your weight to see progress
        </Text>
      </View>
    );
  }

  const chartWidth = width - 64;
  const chartHeight = 280;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.card }, ShotsyDesignTokens.shadows.card]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Weight Progress</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {stats.currentWeight.toFixed(1)}kg
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Lost</Text>
          <Text
            style={[
              styles.statValue,
              { color: stats.totalLost > 0 ? colors.success : colors.textSecondary },
            ]}
          >
            {stats.totalLost > 0 ? '-' : ''}
            {Math.abs(stats.totalLost).toFixed(1)}kg
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: colors.background }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Progress</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {stats.progressPercentage.toFixed(0)}%
          </Text>
        </View>
      </View>

      {/* Period Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.periodContainer}
      >
        {PERIOD_OPTIONS.map((period) => (
          <Pressable
            key={period.key}
            onPress={() => setSelectedPeriod(period.key)}
            style={[
              styles.periodButton,
              {
                backgroundColor: selectedPeriod === period.key ? colors.primary : 'transparent',
                borderColor: selectedPeriod === period.key ? colors.primary : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.periodText,
                {
                  color: selectedPeriod === period.key ? '#FFFFFF' : colors.textSecondary,
                  fontWeight: selectedPeriod === period.key ? '600' : '400',
                },
              ]}
            >
              {period.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <VictoryChart
          width={chartWidth}
          height={chartHeight}
          padding={{ top: 20, bottom: 50, left: 50, right: 20 }}
          domain={{ y: [stats.minWeight, stats.maxWeight] }}
        >
          {/* Grid lines */}
          <VictoryAxis
            dependentAxis
            style={{
              grid: { stroke: colors.border, strokeWidth: 1, strokeOpacity: 0.3 },
              axis: { stroke: 'transparent' },
              tickLabels: {
                fill: colors.textSecondary,
                fontSize: 10,
                fontWeight: '400',
              },
            }}
            tickFormat={(t) => `${t}kg`}
            tickCount={6}
          />

          <VictoryAxis
            style={{
              grid: { stroke: 'transparent' },
              axis: { stroke: colors.border, strokeWidth: 1 },
              tickLabels: {
                fill: colors.textSecondary,
                fontSize: 10,
                fontWeight: '400',
                angle: -45,
                textAnchor: 'end',
              },
            }}
            tickFormat={(x) => {
              const point = filteredData[x];
              if (!point) return '';
              const date = point.date;
              return `${date.getDate()}/${date.getMonth() + 1}`;
            }}
            tickCount={Math.min(8, filteredData.length)}
          />

          {/* Multiple lines by dosage */}
          {groupedByDosage.map((group) => (
            <VictoryGroup key={group.dosage}>
              <VictoryLine
                data={group.data}
                style={{
                  data: {
                    stroke: group.color,
                    strokeWidth: 2.5,
                  },
                }}
                interpolation="natural"
              />
              <VictoryScatter
                data={group.data}
                size={4}
                style={{
                  data: {
                    fill: group.color,
                  },
                }}
              />
            </VictoryGroup>
          ))}

          {/* Target line if provided */}
          {targetWeight && (
            <VictoryLine
              data={[
                { x: 0, y: targetWeight },
                { x: filteredData.length - 1, y: targetWeight },
              ]}
              style={{
                data: {
                  stroke: colors.success,
                  strokeWidth: 2,
                  strokeDasharray: '4,4',
                  strokeOpacity: 0.5,
                },
              }}
            />
          )}
        </VictoryChart>

        {/* Legend */}
        {groupedByDosage.length > 1 && (
          <View style={styles.legendContainer}>
            <Text style={[styles.legendTitle, { color: colors.textSecondary }]}>Dosages:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.legendItems}>
                {groupedByDosage.map((group) => (
                  <View key={group.dosage} style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: group.color }]} />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                      {group.dosage}mg
                    </Text>
                  </View>
                ))}
                {targetWeight && (
                  <View style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendColor,
                        styles.legendColorDashed,
                        { backgroundColor: colors.success },
                      ]}
                    />
                    <Text style={[styles.legendText, { color: colors.textSecondary }]}>Target</Text>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: 'center',
  },
  container: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    padding: ShotsyDesignTokens.spacing.lg,
  },
  emptyContainer: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    padding: ShotsyDesignTokens.spacing.xxl,
  },
  emptySubtext: {
    ...ShotsyDesignTokens.typography.caption,
  },
  emptyText: {
    ...ShotsyDesignTokens.typography.body,
    marginBottom: ShotsyDesignTokens.spacing.xs,
  },
  header: {
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  legendColor: {
    borderRadius: 2,
    height: 3,
    width: 16,
  },
  legendColorDashed: {
    height: 2,
    width: 20,
  },
  legendContainer: {
    marginTop: ShotsyDesignTokens.spacing.md,
    width: '100%',
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.xs,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.md,
  },
  legendText: {
    ...ShotsyDesignTokens.typography.tiny,
  },
  legendTitle: {
    ...ShotsyDesignTokens.typography.caption,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.xs,
  },
  periodButton: {
    borderRadius: ShotsyDesignTokens.borderRadius.full,
    borderWidth: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingVertical: ShotsyDesignTokens.spacing.sm,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  periodText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  statCard: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    flex: 1,
    padding: ShotsyDesignTokens.spacing.md,
  },
  statLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 4,
  },
  statValue: {
    ...ShotsyDesignTokens.typography.h4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  title: {
    ...ShotsyDesignTokens.typography.h3,
  },
});

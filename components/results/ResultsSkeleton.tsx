import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Skeleton } from '@/components/ui/shotsy-skeleton';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { useShotsyColors } from '@/hooks/useShotsyColors';

export function MetricCardSkeleton() {
  const colors = useShotsyColors();

  return (
    <View style={[styles.metricCard, { backgroundColor: colors.card }]}>
      <Skeleton width="60%" height={14} style={{ marginBottom: 8 }} />
      <Skeleton width="80%" height={28} style={{ marginBottom: 4 }} />
      <Skeleton width="40%" height={12} />
    </View>
  );
}

export function ChartSkeleton() {
  const colors = useShotsyColors();

  return (
    <ShotsyCard style={styles.chartCard}>
      <Skeleton width="50%" height={20} style={{ marginBottom: 16 }} />
      <Skeleton width="100%" height={220} borderRadius={16} style={{ marginBottom: 12 }} />
      <View style={styles.legendRow}>
        <Skeleton width={80} height={12} />
        <Skeleton width={80} height={12} />
        <Skeleton width={100} height={12} />
      </View>
    </ShotsyCard>
  );
}

export function DetailedStatsSkeleton() {
  const colors = useShotsyColors();

  return (
    <ShotsyCard style={styles.statsCard}>
      <Skeleton width="60%" height={20} style={{ marginBottom: 16 }} />
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={24} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={24} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={24} />
        </View>
        <View style={styles.statItem}>
          <Skeleton width="80%" height={14} style={{ marginBottom: 6 }} />
          <Skeleton width="60%" height={24} />
        </View>
      </View>
    </ShotsyCard>
  );
}

export function ResultsScreenSkeleton() {
  return (
    <View style={styles.container}>
      {/* Period Selector Skeleton */}
      <View style={styles.periodSelector}>
        <Skeleton width={80} height={40} borderRadius={24} />
        <Skeleton width={90} height={40} borderRadius={24} />
        <Skeleton width={90} height={40} borderRadius={24} />
        <Skeleton width={70} height={40} borderRadius={24} />
      </View>

      <View style={styles.content}>
        {/* Metrics Grid Skeleton */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </View>
          <View style={styles.metricRow}>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </View>
          <View style={styles.metricRow}>
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </View>
        </View>

        {/* Weight Chart Skeleton */}
        <ChartSkeleton />

        {/* BMI Chart Skeleton */}
        <ChartSkeleton />

        {/* Detailed Stats Skeleton */}
        <DetailedStatsSkeleton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 10,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
  },
  chartCard: {
    padding: 16,
    marginBottom: 16,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  statsCard: {
    padding: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
  },
});

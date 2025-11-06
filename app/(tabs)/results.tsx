import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { useWeights } from '@/hooks/useWeights';
import { useProfile } from '@/hooks/useProfile';
import { useApplications } from '@/hooks/useApplications';
import { WeightChart } from '@/components/results/WeightChart';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Results');

type TimeFilter = '1 month' | '3 months' | '6 months' | 'All time';

export default function ResultsScreen() {
  const colors = useColors();
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('All time');
  const [refreshing, setRefreshing] = useState(false);

  const { weights, loading: weightsLoading, refetch: refetchWeights } = useWeights();
  const { profile, loading: profileLoading, refetch: refetchProfile } = useProfile();
  const {
    applications,
    loading: applicationsLoading,
    refetch: refetchApplications,
  } = useApplications();

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchWeights(), refetchProfile(), refetchApplications()]);
    setRefreshing(false);
  };

  // Filter weights based on time filter
  const filteredWeights = useMemo(() => {
    const now = new Date();
    switch (timeFilter) {
      case '1 month':
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return weights.filter((w) => w.date >= oneMonthAgo);
      case '3 months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return weights.filter((w) => w.date >= threeMonthsAgo);
      case '6 months':
        const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
        return weights.filter((w) => w.date >= sixMonthsAgo);
      default:
        return weights;
    }
  }, [weights, timeFilter]);

  // Calculate statistics
  const startWeight = useMemo(() => {
    return weights.length > 0 ? weights[weights.length - 1].weight : 0;
  }, [weights]);

  const currentWeight = useMemo(() => {
    return filteredWeights.length > 0 ? filteredWeights[0].weight : 0;
  }, [filteredWeights]);

  const targetWeight = profile?.target_weight || 75;
  const height = profile?.height || 1.75;

  const weightChange = currentWeight - startWeight;
  const percentChange = startWeight > 0 ? (weightChange / startWeight) * 100 : 0;

  // Current BMI calculation
  const currentBMI = currentWeight > 0 && height > 0 ? currentWeight / (height * height) : 0;

  // Calculate weekly average loss
  const weeklyAvg = useMemo(() => {
    if (filteredWeights.length < 2) return 0;
    const firstWeight = filteredWeights[filteredWeights.length - 1].weight;
    const lastWeight = filteredWeights[0].weight;
    const timeDiff =
      filteredWeights[0].date.getTime() - filteredWeights[filteredWeights.length - 1].date.getTime();
    const weeks = timeDiff / (7 * 24 * 60 * 60 * 1000);
    return weeks > 0 ? Math.abs(firstWeight - lastWeight) / weeks : 0;
  }, [filteredWeights]);

  // Progress to goal
  const totalToLose = startWeight - targetWeight;
  const lost = startWeight - currentWeight;
  const progressPercent = totalToLose > 0 ? (lost / totalToLose) * 100 : 0;
  const remainingToGoal = currentWeight - targetWeight;

  // Prepare weight data for chart (with dosage info)
  const weightData = useMemo(() => {
    return filteredWeights.map((w) => {
      // Find application closest to this weight date
      const closestApp = applications
        .filter((app) => {
          const appDate = app.date || new Date(app.application_date);
          return appDate <= w.date;
        })
        .sort((a, b) => {
          const dateA = a.date || new Date(a.application_date);
          const dateB = b.date || new Date(b.application_date);
          return dateB.getTime() - dateA.getTime();
        })[0];

      return {
        date: w.date,
        weight: w.weight,
        dosage: closestApp?.dosage || 0,
      };
    });
  }, [filteredWeights, applications]);

  // Map period filter for WeightChart
  const periodFilterMap: Record<TimeFilter, 'week' | 'month' | '90days' | 'all'> = {
    '1 month': 'month',
    '3 months': '90days',
    '6 months': 'all',
    'All time': 'all',
  };

  const loading = weightsLoading || profileLoading || applicationsLoading;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={handleRefresh} />}
        style={styles.scrollView}
      >
        <View style={styles.content}>
          {/* Time filters - V0 Design */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          >
            {(['1 month', '3 months', '6 months', 'All time'] as TimeFilter[]).map((filter) => (
              <TouchableOpacity
                key={filter}
                onPress={() => setTimeFilter(filter)}
                style={[
                  styles.filterButton,
                  {
                    backgroundColor:
                      timeFilter === filter ? colors.backgroundSecondary : colors.card,
                    borderColor: timeFilter === filter ? 'transparent' : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: timeFilter === filter ? colors.text : colors.textSecondary,
                      fontWeight: timeFilter === filter ? '600' : '500',
                    },
                  ]}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Weight Change Section - V0 Design */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="scale" size={20} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Weight Change</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {timeFilter === 'All time' ? 'All time' : timeFilter}
              </Text>
            </View>

            {/* Stats Grid - V0 Design */}
            <View style={styles.statsGrid}>
              {/* Total change */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.statHeader}>
                  <Ionicons name="trending-down" size={12} color={colors.primary} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total change</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {weightChange >= 0 ? '+' : ''}
                  {weightChange.toFixed(1)}
                  <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg</Text>
                </Text>
              </View>

              {/* Current BMI */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.statHeader}>
                  <Ionicons name="trending-up" size={12} color={colors.primary} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Current BMI</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {currentBMI > 0 ? currentBMI.toFixed(1) : '—'}
                </Text>
              </View>

              {/* Weight */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.statHeader}>
                  <Ionicons name="pulse" size={12} color={colors.textMuted} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Weight</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {currentWeight > 0 ? (
                    <>
                      {currentWeight.toFixed(1)}
                      <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg</Text>
                    </>
                  ) : (
                    '—'
                  )}
                </Text>
              </View>
            </View>

            {/* Second Stats Grid - V0 Design */}
            <View style={styles.statsGrid}>
              {/* % Percent */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>% Percent</Text>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {percentChange >= 0 ? '+' : ''}
                  {percentChange.toFixed(0)}%
                </Text>
              </View>

              {/* Weekly avg */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.statHeader}>
                  <Ionicons name="trending-down" size={12} color={colors.primary} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Weekly avg</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {weeklyAvg > 0 ? (
                    <>
                      -{weeklyAvg.toFixed(1)}
                      <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg/wk</Text>
                    </>
                  ) : (
                    '—'
                  )}
                </Text>
              </View>

              {/* To goal */}
              <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
                <View style={styles.statHeader}>
                  <Ionicons name="pulse" size={12} color={colors.primary} />
                  <Text style={[styles.statLabel, { color: colors.textSecondary }]}>To goal</Text>
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {remainingToGoal > 0 ? (
                    <>
                      {remainingToGoal.toFixed(1)}
                      <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg</Text>
                      <Text style={[styles.statPercent, { color: colors.textMuted }]}>
                        {' '}
                        ({Math.max(0, progressPercent).toFixed(0)}%)
                      </Text>
                    </>
                  ) : (
                    '—'
                  )}
                </Text>
              </View>
            </View>

            {/* Weight Chart - V0 Design */}
            <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <WeightChart
                data={weightData.map((d) => ({ date: d.date, weight: d.weight }))}
                targetWeight={targetWeight}
                periodFilter={periodFilterMap[timeFilter]}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 24,
  },
  filtersContainer: {
    gap: 8,
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  statPercent: {
    fontSize: 12,
    fontWeight: '400',
  },
  chartCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 8,
  },
});

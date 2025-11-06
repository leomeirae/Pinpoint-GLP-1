import React, { useState, useMemo, useCallback } from 'react';
import { ScrollView, View, StyleSheet, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { EstimatedLevelsChart } from '@/components/dashboard/EstimatedLevelsChart';
import { NextShotWidget } from '@/components/dashboard/NextShotWidget';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { router } from 'expo-router';
import { useApplications } from '@/hooks/useApplications';
import { useWeights } from '@/hooks/useWeights';
import { useProfile } from '@/hooks/useProfile';
import { calculateNextShotDate, getCurrentEstimatedLevel, MedicationApplication } from '@/lib/pharmacokinetics';
import { createLogger } from '@/lib/logger';
import { Ionicons } from '@expo/vector-icons';

const logger = createLogger('Dashboard');

export default function DashboardScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real data from Supabase
  const {
    applications,
    loading: applicationsLoading,
    refetch: refetchApplications,
  } = useApplications();
  const { weights, loading: weightsLoading } = useWeights();
  const { profile, loading: profileLoading } = useProfile();

  const isLoading = applicationsLoading || weightsLoading || profileLoading;

  // Calculate real metrics from Supabase data
  const totalShots = applications.length;
  const lastShot = applications[0]; // Most recent (already sorted by date desc)
  const lastDose = lastShot?.dosage || null;
  const lastShotDate = lastShot?.date;

  // Get frequency from profile (default to weekly)
  const frequency = profile?.frequency || 'weekly';

  // Calculate next shot date using pharmacokinetics library
  const nextShotDate = useMemo(() => {
    if (applications.length === 0) return undefined;

    // Determine interval days based on frequency
    let intervalDays = 7; // Default weekly
    const freq = frequency.toLowerCase();

    if (freq.includes('biweekly') || freq.includes('bi-weekly')) {
      intervalDays = 14;
    } else if (freq.includes('daily') || freq.includes('day')) {
      intervalDays = 1;
    }

    // Convert applications to pharmacokinetics format
    const medicationApps: MedicationApplication[] = applications.map((app) => ({
      dose: app.dosage,
      date: new Date(app.date),
    }));

    // Use pharmacokinetics library to calculate next shot date
    const nextDate = calculateNextShotDate(medicationApps, intervalDays);
    return nextDate || undefined;
  }, [applications, frequency]);

  // Calculate estimated level
  const estimatedLevel = useMemo(() => {
    if (applications.length === 0) return null;

    const medicationApps: MedicationApplication[] = applications.map((app) => ({
      dose: app.dosage,
      date: new Date(app.date),
    }));

    return getCurrentEstimatedLevel(medicationApps);
  }, [applications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetchApplications();
    } catch (error) {
      logger.error('Error refreshing data:', error as Error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchApplications]);

  const handleAddShot = () => {
    router.push('/(tabs)/add-application');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - V0 Design */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resumo</Text>
        <TouchableOpacity onPress={handleAddShot} style={styles.addButton}>
          <Ionicons name="add" size={20} color={colors.primary} />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Injeção</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Injection History - V0 Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Histórico de Injeções</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/injections')}>
              <Text style={[styles.seeAllButton, { color: colors.primary }]}>
                Ver tudo <Text style={styles.seeAllArrow}>›</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Stats Grid - V0 Design */}
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>💉</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Injeções tomadas</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalShots}</Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>💊</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Última dose</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {lastDose ? (
                  <>
                    {lastDose}
                    <Text style={[styles.statUnit, { color: colors.textSecondary }]}>mg</Text>
                  </>
                ) : (
                  <Text style={[styles.statValueEmpty, { color: colors.textMuted }]}>—</Text>
                )}
              </Text>
            </View>

            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>📊</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nível Est.</Text>
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {estimatedLevel !== null ? (
                  <>
                    {estimatedLevel.toFixed(1)}
                    <Text style={[styles.statUnit, { color: colors.textSecondary }]}>mg</Text>
                  </>
                ) : (
                  <Text style={[styles.statValueEmpty, { color: colors.textMuted }]}>—</Text>
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Estimated Medication Levels - V0 Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Níveis Estimados de Medicação
              </Text>
              <Ionicons name="information-circle-outline" size={20} color={colors.textMuted} />
            </View>
          </View>

          {/* Chart - V0 Design */}
          <EstimatedLevelsChart />
        </View>

        {/* Next Injection - V0 Design */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próxima Injeção</Text>
          <NextShotWidget
            totalShots={totalShots}
            nextShotDate={nextShotDate}
            lastShotDate={lastShotDate}
            frequency={frequency}
          />
        </View>

        {/* Bottom spacing for safe area */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    marginBottom: 12,
  },
  seeAllButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  seeAllArrow: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statValueEmpty: {
    fontSize: 20,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  bottomSpacer: {
    height: 24,
  },
});

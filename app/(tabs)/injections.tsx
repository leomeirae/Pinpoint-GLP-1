import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotCard, Shot } from '@/components/shots/ShotCard';
import { useApplications } from '@/hooks/useApplications';
import { useProfile } from '@/hooks/useProfile';
import { calculateNextShotDate, getCurrentEstimatedLevel, MedicationApplication } from '@/lib/pharmacokinetics';
import { createLogger } from '@/lib/logger';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const logger = createLogger('Injections');

export default function ShotsScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch real data from Supabase
  const {
    applications,
    loading,
    deleteApplication,
    refetch: refetchApplications,
  } = useApplications();
  const { profile } = useProfile();

  // Map Application to Shot format
  const shots = useMemo(() => {
    return applications.map((app) => ({
      id: app.id,
      date: app.date || new Date(app.application_date),
      dosage: app.dosage,
      injectionSites: app.injection_sites || [],
      sideEffects: app.side_effects_list || [],
      notes: app.notes,
    }));
  }, [applications]);

  // Calculate statistics
  const totalShots = shots.length;
  const lastShot = shots.length > 0 ? shots[0] : null;
  const lastDose = lastShot?.dosage || 0;

  // Calculate estimated level
  const estimatedLevel = useMemo(() => {
    if (applications.length === 0) return 0;

    const medApplications: MedicationApplication[] = applications.map((app) => ({
      dose: app.dosage,
      date: app.date || new Date(app.application_date),
    }));

    return getCurrentEstimatedLevel(medApplications);
  }, [applications]);

  // Calculate next injection date
  const nextInjectionData = useMemo(() => {
    if (applications.length === 0) {
      return {
        daysUntil: null,
        percentage: 0,
        message: 'Bem-vindo!',
        subtitle: 'Adicione sua primeira injeção para começar.',
      };
    }

    const frequency = profile?.frequency || 'weekly';
    let intervalDays = 7; // Default weekly

    const freq = frequency.toLowerCase();
    if (freq.includes('biweekly') || freq.includes('bi-weekly')) {
      intervalDays = 14;
    } else if (freq.includes('daily') || freq.includes('day')) {
      intervalDays = 1;
    }

    const medApplications: MedicationApplication[] = applications.map((app) => ({
      dose: app.dosage,
      date: app.date || new Date(app.application_date),
    }));

    const nextDate = calculateNextShotDate(medApplications, intervalDays);
    if (!nextDate) {
      return {
        daysUntil: null,
        percentage: 0,
        message: 'Bem-vindo!',
        subtitle: 'Adicione sua primeira injeção para começar.',
      };
    }

    const now = new Date();
    const daysDiff = Math.ceil((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const daysUntil = Math.max(0, daysDiff);

    // Calculate percentage (0-100) based on days until next injection
    // If interval is 7 days, and we're 0 days away, we're at 0%
    // If we're 7 days away, we're at 100%
    const percentage = Math.min(100, Math.max(0, ((intervalDays - daysUntil) / intervalDays) * 100));

    return {
      daysUntil,
      percentage,
      message: daysUntil === 0 ? 'Hoje!' : daysUntil === 1 ? 'Amanhã' : `${daysUntil} dias`,
      subtitle: daysUntil === 0 ? 'Hora da sua injeção!' : `Próxima injeção em ${daysUntil} dia(s)`,
    };
  }, [applications, profile?.frequency]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetchApplications();
    setRefreshing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApplication(id);
    } catch (error) {
      logger.error('Error deleting application:', error as Error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Carregando injeções...
        </Text>
      </View>
    );
  }

    return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header - V0 Design */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Injeções</Text>
      </View>

        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        style={styles.scrollView}
        >
        <View style={styles.content}>
          {/* Title - V0 Design */}
          <Text style={[styles.title, { color: colors.text }]}>Histórico de Injeções</Text>

          {/* Stats Grid - V0 Design */}
          <View style={styles.statsGrid}>
            {/* Injeções tomadas */}
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>💉</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                  Injeções tomadas
                </Text>
              </View>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalShots}</Text>
            </View>

            {/* Última dose */}
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>💊</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Última dose</Text>
              </View>
              {lastDose > 0 ? (
                <Text style={[styles.statValue, { color: colors.text }]}>{lastDose}mg</Text>
              ) : (
                <Text style={[styles.statPlaceholder, { color: colors.textMuted }]}>—</Text>
              )}
            </View>

            {/* Nível Est. */}
            <View style={[styles.statCard, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>📊</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nível Est.</Text>
              </View>
              {estimatedLevel > 0 ? (
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {estimatedLevel.toFixed(2)}mg
                </Text>
              ) : (
                <Text style={[styles.statPlaceholder, { color: colors.textMuted }]}>—</Text>
              )}
            </View>
          </View>

          {/* Next Injection Section - V0 Design */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Próxima Injeção</Text>

          <View
            style={[
              styles.nextInjectionCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            {/* Circular Progress - V0 Design */}
            <View style={styles.progressContainer}>
              <Svg width="192" height="192" viewBox="0 0 200 200">
                <Defs>
                  <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#EF4444" />
                    <Stop offset="25%" stopColor="#F97316" />
                    <Stop offset="50%" stopColor="#EAB308" />
                    <Stop offset="75%" stopColor="#22C55E" />
                    <Stop offset="100%" stopColor="#06B6D4" />
                  </LinearGradient>
                </Defs>
                {/* Background circle */}
                <Circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="none"
                  stroke={colors.border}
                  strokeWidth="12"
                />
                {/* Progress circle */}
                {nextInjectionData.percentage > 0 && (
                  <Circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 80 * (nextInjectionData.percentage / 100)} ${2 * Math.PI * 80}`}
                    strokeLinecap="round"
                    transform={`rotate(-90 100 100)`}
                  />
                )}
              </Svg>
              {/* Center text */}
              <View style={styles.progressTextContainer}>
                <Text style={[styles.progressMessage, { color: colors.text }]}>
                  {nextInjectionData.message}
                </Text>
                <Text style={[styles.progressSubtitle, { color: colors.textSecondary }]}>
                  {nextInjectionData.subtitle}
                </Text>
              </View>
            </View>
          </View>

          {/* Add Shot Section - V0 Design */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Add Shot</Text>
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/(tabs)/add-application')}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Adicionar Injeção</Text>
          </TouchableOpacity>

          {/* Shots List */}
          {shots.length > 0 && (
            <View style={styles.listContainer}>
              {shots.map((shot) => (
                <ShotCard key={shot.id} shot={shot} onDelete={handleDelete} />
              ))}
            </View>
          )}
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
    fontSize: 30,
    fontWeight: '700',
  },
  statPlaceholder: {
    fontSize: 20,
    fontWeight: '400',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  nextInjectionCard: {
    borderRadius: 24,
    borderWidth: 2,
    padding: 32,
    marginBottom: 24,
  },
  progressContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 192,
    height: 192,
  },
  progressMessage: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  progressSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    gap: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

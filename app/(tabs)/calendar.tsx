import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useShotsyColors';
import { MonthCalendar } from '@/components/calendar/MonthCalendar';
import { useApplications } from '@/hooks/useApplications';
import { useWeights } from '@/hooks/useWeights';
import { useNutrition } from '@/hooks/useNutrition';
import { useSideEffects } from '@/hooks/useSideEffects';
import { getCurrentEstimatedLevel, MedicationApplication } from '@/lib/pharmacokinetics';
import { createLogger } from '@/lib/logger';

const logger = createLogger('Calendar');

// Event type to match calendar components
type CalendarEvent = {
  id: string;
  type: 'shot' | 'weight';
  date: Date;
  time: Date;
  dosage?: number;
  medication?: string;
  weight?: number;
  difference?: number;
};

export default function CalendarViewScreen() {
  const colors = useColors();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch data from Supabase
  const {
    applications,
    loading: loadingApplications,
    refetch: refetchApplications,
  } = useApplications();
  const {
    weights,
    loading: loadingWeights,
    refetch: refetchWeights,
  } = useWeights();
  const {
    nutrition,
    loading: loadingNutrition,
    getNutritionByDate,
    refetch: refetchNutrition,
  } = useNutrition();
  const {
    sideEffects,
    loading: loadingSideEffects,
    refetch: refetchSideEffects,
  } = useSideEffects();

  // Transform applications and weights into calendar events
  const events: CalendarEvent[] = useMemo(() => {
    const shotEvents: CalendarEvent[] = applications.map((app) => ({
      id: app.id,
      type: 'shot' as const,
      date: app.date || new Date(app.application_date),
      time: app.date || new Date(app.application_date),
      dosage: app.dosage,
      medication: 'Mounjaro',
    }));

    const weightEvents: CalendarEvent[] = weights.map((weight) => ({
        id: weight.id,
        type: 'weight' as const,
        date: weight.date,
        time: weight.date,
        weight: weight.weight,
    }));

    return [...shotEvents, ...weightEvents].sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [applications, weights]);

  // Get data for selected date
  const selectedDateData = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    const selectedDateOnly = new Date(selectedDate);
    selectedDateOnly.setHours(0, 0, 0, 0);

    // Get injection for selected date
    const injection = applications.find((app) => {
      const appDate = app.date || new Date(app.application_date);
      appDate.setHours(0, 0, 0, 0);
      return appDate.getTime() === selectedDateOnly.getTime();
    });

    // Get weight for selected date
    const weight = weights.find((w) => {
      const wDate = new Date(w.date);
      wDate.setHours(0, 0, 0, 0);
      return wDate.getTime() === selectedDateOnly.getTime();
    });

    // Get nutrition for selected date
    const nutritionData = nutrition.find((n) => {
      const nDate = new Date(n.date);
      nDate.setHours(0, 0, 0, 0);
      return nDate.getTime() === selectedDateOnly.getTime();
    });

    // Get side effects for selected date
    const daySideEffects = sideEffects.filter((se) => {
      const seDate = new Date(se.date);
      seDate.setHours(0, 0, 0, 0);
      return seDate.getTime() === selectedDateOnly.getTime();
    });

    // Calculate estimated level
    const medApplications: MedicationApplication[] = applications
      .filter((app) => {
        const appDate = app.date || new Date(app.application_date);
        return appDate <= selectedDate;
      })
      .map((app) => ({
        dose: app.dosage,
        date: app.date || new Date(app.application_date),
      }));
    const estimatedLevel = getCurrentEstimatedLevel(medApplications, selectedDate);

    return {
      injection,
      weight,
      nutrition: nutritionData,
      sideEffects: daySideEffects,
      estimatedLevel,
    };
  }, [selectedDate, applications, weights, nutrition, sideEffects]);

  // Generate days for horizontal scroll (current week)
  const weekDays = useMemo(() => {
    const today = new Date();
    const days: Date[] = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - 3); // Show 3 days before selected

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [selectedDate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchApplications(),
        refetchWeights(),
        refetchNutrition(),
        refetchSideEffects(),
      ]);
    } catch (error) {
      logger.error('Error refreshing data:', error as Error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const formatMonthYear = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatDayDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
    }).format(date);
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return today.getTime() === checkDate.getTime();
  };

  const isSelected = (date: Date): boolean => {
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    return selected.getTime() === checkDate.getTime();
  };

  const isLoading = loadingApplications || loadingWeights || loadingNutrition || loadingSideEffects;

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header - V0 Design */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Calendário</Text>
        <TouchableOpacity onPress={handleGoToToday}>
          <Text style={[styles.headerButton, { color: colors.primary }]}>Hoje</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Current Day View - V0 Design */}
        <View style={[styles.currentDayView, { backgroundColor: colors.card }]}>
          {/* Horizontal Day Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.daysScroll}
          >
            {weekDays.map((day, index) => {
              const dayIsSelected = isSelected(day);
              const dayIsToday = isToday(day);
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    {
                      backgroundColor: dayIsSelected ? colors.primary : colors.backgroundSecondary,
                    },
                  ]}
                  onPress={() => setSelectedDate(day)}
                >
                  <Text
                    style={[
                      styles.dayButtonNumber,
                      {
                        color: dayIsSelected ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {day.getDate()}
                  </Text>
                  {dayIsToday && (
                    <View style={[styles.todayIndicator, { backgroundColor: '#FCD34D' }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Date Title */}
          <Text style={[styles.dateTitle, { color: colors.text }]}>
            {isToday(selectedDate) ? 'Hoje' : ''}, {formatDayDate(selectedDate)}
          </Text>

          {/* Daily Stats Cards - V0 Design */}
          <View style={styles.statsGrid}>
            {/* Injeção Card */}
            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/add-application')}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>💉</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Injeção</Text>
              </View>
              {selectedDateData.injection ? (
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {selectedDateData.injection.dosage}mg
                  </Text>
                </View>
              ) : (
                <>
                  <View style={[styles.dashedLine, { borderColor: colors.border }]} />
                  <Text style={[styles.statPlaceholder, { color: colors.textSecondary }]}>
                    Toque para adicionar injeção
                  </Text>
                </>
              )}
          </TouchableOpacity>

            {/* Nível Est. Card */}
            <View
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.statHeader}>
                <Ionicons name="trending-up" size={16} color={colors.primary} />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nível Est.</Text>
              </View>
              {selectedDateData.estimatedLevel > 0 ? (
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {selectedDateData.estimatedLevel.toFixed(2)}mg
            </Text>
          </View>
              ) : (
                <>
                  <View style={[styles.dashedLine, { borderColor: colors.border }]} />
                  <Text style={[styles.statPlaceholder, { color: colors.textSecondary }]}>
                    Nenhum dado
                  </Text>
                </>
              )}
        </View>

            {/* Peso Card */}
            <TouchableOpacity
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => router.push('/(tabs)/add-application')}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statIcon}>⚖️</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Peso</Text>
              </View>
              {selectedDateData.weight ? (
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {selectedDateData.weight.weight.toFixed(1)}
                    <Text style={[styles.statUnit, { color: colors.textSecondary }]}>kg</Text>
                  </Text>
                </View>
              ) : (
                <>
                  <View style={[styles.dashedLine, { borderColor: colors.border }]} />
                  <Text style={[styles.statPlaceholder, { color: colors.textSecondary }]}>
                    Toque para adicionar peso
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Calorias Card */}
            <View
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.statHeader}>
                <Ionicons name="flame" size={16} color="#F97316" />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Calorias</Text>
              </View>
              {selectedDateData.nutrition?.calories ? (
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {selectedDateData.nutrition.calories}
                  </Text>
                </View>
              ) : (
                <View style={[styles.dashedLine, { borderColor: colors.border }]} />
              )}
            </View>

            {/* Proteína Card */}
            <View
              style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            >
              <View style={styles.statHeader}>
                <Ionicons name="restaurant" size={16} color="#EF4444" />
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Proteína</Text>
              </View>
              {selectedDateData.nutrition?.protein ? (
                <View style={styles.statContent}>
                  <Text style={[styles.statValue, { color: colors.text }]}>
                    {selectedDateData.nutrition.protein}g
                  </Text>
                </View>
              ) : (
                <View style={[styles.dashedLine, { borderColor: colors.border }]} />
              )}
            </View>
          </View>

          {/* Side Effects Card - V0 Design */}
          <TouchableOpacity
            style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/add-side-effect')}
          >
            <View style={styles.sectionHeader}>
              <Ionicons name="water" size={16} color="#10B981" />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Efeitos colaterais</Text>
            </View>
            {selectedDateData.sideEffects.length > 0 ? (
              <Text style={[styles.sectionContent, { color: colors.text }]}>
                {selectedDateData.sideEffects.length} efeito(s) registrado(s)
              </Text>
            ) : (
              <Text style={[styles.sectionPlaceholder, { color: colors.textSecondary }]}>
                Toque para adicionar efeitos colaterais
              </Text>
            )}
          </TouchableOpacity>

          {/* Daily Notes Card - V0 Design */}
          <TouchableOpacity
            style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => router.push('/(tabs)/add-application')}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>📝</Text>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Notas do dia</Text>
            </View>
            {selectedDateData.nutrition?.notes ? (
              <Text style={[styles.sectionContent, { color: colors.text }]} numberOfLines={2}>
                {selectedDateData.nutrition.notes}
              </Text>
            ) : (
              <Text style={[styles.sectionPlaceholder, { color: colors.textSecondary }]}>
                Toque para adicionar notas
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Calendar Month View - V0 Design */}
        <View style={[styles.monthView, { backgroundColor: colors.card }]}>
          <Text style={[styles.monthTitle, { color: colors.text }]}>
            {formatMonthYear(currentDate)}
          </Text>

        {/* Loading State */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Carregando eventos...
            </Text>
          </View>
        ) : (
            <MonthCalendar
              currentDate={currentDate}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              events={events}
            />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  currentDayView: {
    padding: 16,
    marginBottom: 16,
    width: '100%',
  },
  daysScroll: {
    paddingVertical: 8,
    gap: 8,
  },
  dayButton: {
    width: 56,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dayButtonNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  todayIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 4,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    width: '47%',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    minHeight: 100,
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
  statContent: {
    flex: 1,
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  statUnit: {
    fontSize: 14,
    fontWeight: '400',
  },
  dashedLine: {
    height: 32,
    borderBottomWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 8,
  },
  statPlaceholder: {
    fontSize: 12,
  },
  sectionCard: {
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  sectionIcon: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionContent: {
    fontSize: 14,
  },
  sectionPlaceholder: {
    fontSize: 14,
  },
  monthView: {
    padding: 16,
    paddingBottom: 24,
    width: '100%',
  },
  monthTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});

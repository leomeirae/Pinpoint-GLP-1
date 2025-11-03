import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { WeightIcon } from '@/components/ui/icons';

interface ShotEvent {
  id: string;
  type: 'shot';
  time: Date;
  dosage: number;
  medication: string;
}

interface WeightEvent {
  id: string;
  type: 'weight';
  time: Date;
  weight: number;
  difference?: number;
}

type CalendarEvent = ShotEvent | WeightEvent;

interface DayEventsListProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

export const DayEventsList: React.FC<DayEventsListProps> = ({
  selectedDate,
  events,
}) => {
  const colors = useShotsyColors();
  const router = useRouter();

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Filtrar eventos para a data selecionada e ordenar por horário (mais recente primeiro)
  const dayEvents = events
    .filter(event => {
      const eventDate = new Date(event.time);
      eventDate.setHours(0, 0, 0, 0);
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      return eventDate.getTime() === selected.getTime();
    })
    .sort((a, b) => b.time.getTime() - a.time.getTime());

  const handleEventPress = (event: CalendarEvent) => {
    if (event.type === 'shot') {
      // Navegar para tela de edição de injeção
      router.push({
        pathname: '/(tabs)/add-application',
        params: { editId: event.id },
      });
    } else {
      // Navegar para tela de edição de peso
      router.push({
        pathname: '/(tabs)/add-application',
        params: { editWeightId: event.id },
      });
    }
  };

  const handleAddShot = () => {
    router.push('/(tabs)/add-application');
  };

  const handleAddWeight = () => {
    router.push({
      pathname: '/(tabs)/add-application',
      params: { addWeight: 'true' },
    });
  };

  const renderShotEvent = (event: ShotEvent) => (
    <TouchableOpacity
      key={event.id}
      onPress={() => handleEventPress(event)}
      activeOpacity={0.7}
    >
      <ShotsyCard style={styles.eventCard}>
        <View style={styles.eventHeader}>
          <View style={styles.eventIconContainer}>
            <Text style={styles.eventIcon}>💉</Text>
          </View>
          <View style={styles.eventContent}>
            <View style={styles.eventTitleRow}>
              <Text style={[styles.eventTitle, { color: colors.text }]}>
                Injeção
              </Text>
              <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                {formatTime(event.time)}
              </Text>
            </View>
            <Text style={[styles.medicationName, { color: colors.textSecondary }]}>
              {event.medication}
            </Text>
            <View
              style={[
                styles.dosageBadge,
                { backgroundColor: colors.primary + '20' },
              ]}
            >
              <Text style={[styles.dosageText, { color: colors.primary }]}>
                {event.dosage} mg
              </Text>
            </View>
          </View>
        </View>
      </ShotsyCard>
    </TouchableOpacity>
  );

  const renderWeightEvent = (event: WeightEvent) => {
    const difference =
      typeof event.difference === 'number' ? event.difference : undefined;
    const showDifference = difference !== undefined && difference !== 0;
    const isPositive = difference !== undefined && difference > 0;

    return (
      <TouchableOpacity
        key={event.id}
        onPress={() => handleEventPress(event)}
        activeOpacity={0.7}
      >
        <ShotsyCard style={styles.eventCard}>
          <View style={styles.eventHeader}>
            <View style={styles.eventIconContainer}>
            <WeightIcon size="md" color={colors.primary} />
          </View>
            <View style={styles.eventContent}>
              <View style={styles.eventTitleRow}>
                <Text style={[styles.eventTitle, { color: colors.text }]}>
                  Peso
                </Text>
                <Text style={[styles.eventTime, { color: colors.textSecondary }]}>
                  {formatTime(event.time)}
                </Text>
              </View>
              <View style={styles.weightRow}>
                <Text style={[styles.weightValue, { color: colors.text }]}>
                  {event.weight} kg
                </Text>
                {showDifference && difference !== undefined && (
                  <View
                    style={[
                      styles.differenceBadge,
                      {
                        backgroundColor: isPositive
                          ? '#EF444420'
                          : '#10B98120',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.differenceText,
                        { color: isPositive ? '#EF4444' : '#10B981' },
                      ]}
                    >
                      {isPositive ? '+' : ''}
                      {difference.toFixed(1)} kg
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </ShotsyCard>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
        Nenhum evento neste dia
      </Text>
      <View style={styles.emptyStateActions}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddShot}
        >
          <Text style={styles.addButtonText}>+ Adicionar Injeção</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.addButton,
            {
              backgroundColor: 'transparent',
              borderWidth: 1.5,
              borderColor: colors.primary,
            },
          ]}
          onPress={handleAddWeight}
        >
          <Text style={[styles.addButtonText, { color: colors.primary }]}>
            + Adicionar Peso
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.dateTitle, { color: colors.text }]}>
        {formatDate(selectedDate)}
      </Text>

      {dayEvents.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView
          style={styles.eventsList}
          showsVerticalScrollIndicator={false}
        >
          {dayEvents.map(event =>
            event.type === 'shot'
              ? renderShotEvent(event as ShotEvent)
              : renderWeightEvent(event as WeightEvent)
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  eventsList: {
    flex: 1,
  },
  eventCard: {
    padding: 16,
    marginBottom: 12,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  eventIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventContent: {
    flex: 1,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  eventTime: {
    fontSize: 14,
    fontWeight: '600',
  },
  medicationName: {
    fontSize: 14,
    marginBottom: 8,
  },
  dosageBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dosageText: {
    fontSize: 12,
    fontWeight: '700',
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  weightValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  differenceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  differenceText: {
    fontSize: 12,
    fontWeight: '700',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 24,
  },
  emptyStateActions: {
    width: '100%',
    gap: 12,
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

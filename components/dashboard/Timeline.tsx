import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useColors } from '@/constants/colors';
import { TimelineEvent } from '@/lib/types';

interface TimelineProps {
  events: TimelineEvent[];
  maxVisible?: number;
  onEditApplication?: (eventId: string) => void;
  onDeleteApplication?: (eventId: string) => void;
  onEditWeight?: (eventId: string) => void;
  onDeleteWeight?: (eventId: string) => void;
}

export function Timeline({
  events,
  maxVisible,
  onEditApplication,
  onDeleteApplication,
  onEditWeight,
  onDeleteWeight,
}: TimelineProps) {
  const colors = useColors();

  const handleDelete = (event: TimelineEvent) => {
    const message =
      event.type === 'application'
        ? `Tem certeza que deseja excluir esta aplicação?`
        : `Tem certeza que deseja excluir este registro de peso?`;

    Alert.alert('Confirmar Exclusão', message, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          if (event.type === 'application') {
            onDeleteApplication?.(event.id);
          } else {
            onDeleteWeight?.(event.id);
          }
        },
      },
    ]);
  };

  if (events.length === 0) {
    const styles = getStyles(colors);

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📅 Nenhum evento registrado ainda</Text>
        <Text style={styles.emptySubtext}>Comece registrando sua primeira aplicação ou peso!</Text>
      </View>
    );
  }

  const displayEvents = maxVisible ? events.slice(0, maxVisible) : events;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Linha do Tempo</Text>

      <View style={styles.timelineContainer}>
        {displayEvents.map((event, index) => (
          <View key={event.id} style={styles.eventWrapper}>
            {/* Linha conectora */}
            {index < displayEvents.length - 1 && <View style={styles.connector} />}

            {/* Evento */}
            <View style={styles.eventCard}>
              {/* Ícone e data */}
              <View style={styles.eventHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    event.type === 'application' ? styles.iconApplication : styles.iconWeight,
                  ]}
                >
                  <Text style={styles.iconText}>{event.type === 'application' ? '💉' : '⚖️'}</Text>
                </View>

                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>
                  {event.time && <Text style={styles.timeText}>{event.time.substring(0, 5)}</Text>}
                </View>
              </View>

              {/* Conteúdo */}
              {event.type === 'application' && (
                <View style={styles.eventContent}>
                  <View style={styles.contentHeader}>
                    <View style={styles.contentInfo}>
                      <Text style={styles.eventTitle}>Aplicação: {event.medicationName}</Text>
                      <Text style={styles.eventDetail}>Dosagem: {event.dosage}mg</Text>
                      {event.applicationNotes && (
                        <Text style={styles.eventNotes}>"{event.applicationNotes}"</Text>
                      )}
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => onEditApplication?.(event.id)}
                        style={styles.actionButton}
                      >
                        <Text style={styles.actionIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(event)}
                        style={[styles.actionButton, styles.actionButtonSecond]}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {event.type === 'weight' && (
                <View style={styles.eventContent}>
                  <View style={styles.contentHeader}>
                    <View style={styles.contentInfo}>
                      <Text style={styles.eventTitle}>Peso: {event.weight}kg</Text>
                      {event.weightDiff && (
                        <Text
                          style={[
                            styles.weightDiff,
                            event.weightDiff > 0 ? styles.weightUp : styles.weightDown,
                          ]}
                        >
                          {event.weightDiff > 0 ? '↑' : '↓'} {Math.abs(event.weightDiff).toFixed(1)}
                          kg
                        </Text>
                      )}
                      {event.weightNotes && (
                        <Text style={styles.eventNotes}>"{event.weightNotes}"</Text>
                      )}
                    </View>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => onEditWeight?.(event.id)}
                        style={styles.actionButton}
                      >
                        <Text style={styles.actionIcon}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(event)}
                        style={[styles.actionButton, styles.actionButtonSecond]}
                      >
                        <Text style={styles.actionIcon}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    actionButton: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: 6,
    },
    actionButtonSecond: {
      marginLeft: 8,
    },
    actionIcon: {
      fontSize: 16,
    },
    actions: {
      flexDirection: 'row',
      // gap: 4, // Not supported in React Native StyleSheet
      alignSelf: 'flex-start',
    },
    connector: {
      backgroundColor: colors.border,
      height: '100%',
      left: 19,
      position: 'absolute',
      top: 40,
      width: 2,
    },
    container: {
      paddingVertical: 16,
    },
    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    contentInfo: {
      flex: 1,
      // gap: 4, // Not supported in React Native StyleSheet
    },
    dateContainer: {
      flex: 1,
    },
    dateText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: '600',
    },
    emptyContainer: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 32,
    },
    emptySubtext: {
      color: colors.textMuted,
      fontSize: 14,
      textAlign: 'center',
    },
    emptyText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 8,
    },
    eventCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginLeft: 48,
      padding: 16,
    },
    eventContent: {
      // gap: 4, // Not supported in React Native StyleSheet
    },
    eventDetail: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    eventHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 12,
    },
    eventNotes: {
      color: colors.textMuted,
      fontSize: 12,
      fontStyle: 'italic',
      marginTop: 4,
    },
    eventTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    eventWrapper: {
      marginBottom: 16,
      position: 'relative',
    },
    iconApplication: {
      backgroundColor: colors.primary,
    },
    iconCircle: {
      alignItems: 'center',
      borderColor: colors.background,
      borderRadius: 20,
      borderWidth: 3,
      height: 40,
      justifyContent: 'center',
      marginLeft: -64,
      marginRight: 16,
      width: 40,
    },
    iconText: {
      fontSize: 20,
    },
    iconWeight: {
      backgroundColor: colors.success,
    },
    timeText: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    timelineContainer: {
      paddingLeft: 8,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    weightDiff: {
      fontSize: 14,
      fontWeight: '600',
      marginBottom: 4,
    },
    weightDown: {
      color: colors.success,
    },
    weightUp: {
      color: colors.error,
    },
  });

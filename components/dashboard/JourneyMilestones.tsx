import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { MedicationApplication } from '@/lib/types';

interface JourneyMilestonesProps {
  applications: MedicationApplication[];
  currentWeight: number;
  initialWeight: number;
}

export function JourneyMilestones({
  applications,
  currentWeight,
  initialWeight,
}: JourneyMilestonesProps) {
  const colors = useColors();
  if (applications.length === 0) {
    return null;
  }

  const totalApplications = applications.length;
  const firstApplication = applications[applications.length - 1];
  const lastApplication = applications[0];

  const daysSinceStart = firstApplication
    ? Math.ceil(
        (Date.now() - new Date(firstApplication.application_date).getTime()) / (1000 * 60 * 60 * 24)
      )
    : 0;

  const weekNumber = Math.floor(daysSinceStart / 7) + 1;
  const weightLost = initialWeight - currentWeight;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Marcos da Jornada</Text>

      <View style={styles.milestonesGrid}>
        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneEmoji}>💉</Text>
          <Text style={styles.milestoneValue}>{totalApplications}</Text>
          <Text style={styles.milestoneLabel}>Aplicações</Text>
        </View>

        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneEmoji}>📅</Text>
          <Text style={styles.milestoneValue}>Semana {weekNumber}</Text>
          <Text style={styles.milestoneLabel}>da jornada</Text>
        </View>

        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneEmoji}>📉</Text>
          <Text style={styles.milestoneValue}>{weightLost.toFixed(1)}kg</Text>
          <Text style={styles.milestoneLabel}>perdidos</Text>
        </View>
      </View>

      {lastApplication && (
        <View style={styles.lastApplicationCard}>
          <Text style={styles.lastAppTitle}>Última Aplicação</Text>
          <Text style={styles.lastAppDate}>
            {new Date(lastApplication.application_date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
          <Text style={styles.lastAppDosage}>Dosagem: {lastApplication.dosage}mg</Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 16,
    },
    lastAppDate: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
    },
    lastAppDosage: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    lastAppTitle: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    lastApplicationCard: {
      backgroundColor: colors.primary + '20',
      borderLeftColor: colors.primary,
      borderLeftWidth: 4,
      borderRadius: 12,
      padding: 16,
    },
    milestoneCard: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 12,
      flex: 1,
      marginHorizontal: 6,
      padding: 16,
    },
    milestoneEmoji: {
      fontSize: 32,
      marginBottom: 8,
    },
    milestoneLabel: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: 'center',
    },
    milestoneValue: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 4,
    },
    milestonesGrid: {
      flexDirection: 'row',
      // gap: 12, // Not supported in React Native StyleSheet
      marginBottom: 16,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 16,
    },
  });

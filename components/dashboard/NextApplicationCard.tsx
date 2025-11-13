import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';

interface NextApplicationCardProps {
  daysUntil: number;
  medicationName: string;
  dosage: number;
}

export function NextApplicationCard({
  daysUntil,
  medicationName,
  dosage,
}: NextApplicationCardProps) {
  const colors = useColors();
  const router = useRouter();

  const isToday = daysUntil === 0;
  const isOverdue = daysUntil < 0;

  const styles = getStyles(colors);

  return (
    <View
      style={[
        styles.container,
        isToday && styles.containerToday,
        isOverdue && styles.containerOverdue,
      ]}
    >
      <Text style={styles.label}>
        {isOverdue ? 'ATRASADA!' : isToday ? 'HOJE!' : 'PRÓXIMA APLICAÇÃO'}
      </Text>

      <View style={styles.countdown}>
        {!isToday && !isOverdue && (
          <>
            <Text style={styles.countdownNumber}>{daysUntil}</Text>
            <Text style={styles.countdownLabel}>dia{daysUntil > 1 ? 's' : ''}</Text>
          </>
        )}
        {isToday && <Text style={styles.todayEmoji}>💉</Text>}
        {isOverdue && <Text style={styles.overdueEmoji}>⚠️</Text>}
      </View>

      <Text style={styles.medication}>
        {medicationName} {dosage}mg
      </Text>

      {(isToday || isOverdue) && (
        <View style={styles.action}>
          <Button
            label="Registrar Aplicação"
            onPress={() => router.push('/(tabs)/add-application')}
            variant="primary"
          />
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    action: {
      width: '100%',
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.primary + '20',
      borderColor: colors.primary,
      borderRadius: 20,
      borderWidth: 3,
      padding: 24,
    },
    containerOverdue: {
      backgroundColor: colors.error + '20',
      borderColor: colors.error,
    },
    containerToday: {
      backgroundColor: colors.warning + '20',
      borderColor: colors.warning,
    },
    countdown: {
      alignItems: 'center',
      marginBottom: 16,
    },
    countdownLabel: {
      color: colors.textSecondary,
      fontSize: 18,
    },
    countdownNumber: {
      color: colors.text,
      fontSize: 64,
      fontWeight: 'bold',
    },
    label: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: 'bold',
      letterSpacing: 2,
      marginBottom: 16,
    },
    medication: {
      color: colors.text,
      fontSize: 20,
      fontWeight: '600',
      marginBottom: 16,
    },
    overdueEmoji: {
      fontSize: 80,
    },
    todayEmoji: {
      fontSize: 80,
    },
  });

import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';

interface NextApplicationCardProps {
  daysUntil: number;
  medicationName: string;
  dosage: number;
}

export function NextApplicationCard({ daysUntil, medicationName, dosage }: NextApplicationCardProps) {
  const colors = useColors();
  const router = useRouter();

  const isToday = daysUntil === 0;
  const isOverdue = daysUntil < 0;

  const styles = getStyles(colors);

  return (
    <View style={[
      styles.container,
      isToday && styles.containerToday,
      isOverdue && styles.containerOverdue,
    ]}>
      <Text style={styles.label}>
        {isOverdue ? 'ATRASADA!' : isToday ? 'HOJE!' : 'PRÓXIMA APLICAÇÃO'}
      </Text>
      
      <View style={styles.countdown}>
        {!isToday && !isOverdue && (
          <>
            <Text style={styles.countdownNumber}>{daysUntil}</Text>
            <Text style={styles.countdownLabel}>
              dia{daysUntil > 1 ? 's' : ''}
            </Text>
          </>
        )}
        {isToday && (
          <Text style={styles.todayEmoji}>💉</Text>
        )}
        {isOverdue && (
          <Text style={styles.overdueEmoji}>⚠️</Text>
        )}
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

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.primary + '20',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  containerToday: {
    backgroundColor: colors.warning + '20',
    borderColor: colors.warning,
  },
  containerOverdue: {
    backgroundColor: colors.error + '20',
    borderColor: colors.error,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary,
    letterSpacing: 2,
    marginBottom: 16,
  },
  countdown: {
    alignItems: 'center',
    marginBottom: 16,
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: colors.text,
  },
  countdownLabel: {
    fontSize: 18,
    color: colors.textSecondary,
  },
  todayEmoji: {
    fontSize: 80,
  },
  overdueEmoji: {
    fontSize: 80,
  },
  medication: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  action: {
    width: '100%',
  },
});






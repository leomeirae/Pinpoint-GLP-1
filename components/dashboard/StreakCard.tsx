import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
  type: 'weight' | 'application';
}

export function StreakCard({ currentStreak, longestStreak, type }: StreakCardProps) {
  const colors = useColors();
  const emoji = type === 'weight' ? '⚖️' : '💉';
  const label = type === 'weight' ? 'Pesagens' : 'Aplicações';

  const styles = getStyles(colors);

  return (
    <View style={[styles.container, currentStreak === 0 && styles.containerInactive]}>
      <Text style={styles.emoji}>{emoji}</Text>

      <View style={styles.content}>
        <View style={styles.streakRow}>
          <Text style={styles.fireEmoji}>🔥</Text>
          <Text style={styles.currentStreak}>{currentStreak}</Text>
          <Text style={styles.streakLabel}>dias</Text>
        </View>

        <Text style={styles.type}>{label} Consecutivas</Text>

        {longestStreak > currentStreak && (
          <Text style={styles.record}>Recorde: {longestStreak} dias</Text>
        )}
      </View>

      {currentStreak === 0 && (
        <View style={styles.brokenBadge}>
          <Text style={styles.brokenText}>Quebrado</Text>
        </View>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    brokenBadge: {
      backgroundColor: colors.error,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 6,
    },
    brokenText: {
      color: colors.text,
      fontSize: 12,
      fontWeight: 'bold',
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.primary + '40',
      borderRadius: 16,
      borderWidth: 2,
      flexDirection: 'row',
      padding: 20,
    },
    containerInactive: {
      borderColor: colors.border,
      opacity: 0.6,
    },
    content: {
      flex: 1,
    },
    currentStreak: {
      color: colors.text,
      fontSize: 28,
      fontWeight: 'bold',
      marginRight: 4,
    },
    emoji: {
      fontSize: 40,
      marginRight: 16,
    },
    fireEmoji: {
      fontSize: 20,
      marginRight: 4,
    },
    record: {
      color: colors.textMuted,
      fontSize: 12,
    },
    streakLabel: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    streakRow: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 4,
    },
    type: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
  });

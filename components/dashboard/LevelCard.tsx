import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';

interface LevelCardProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
}

export function LevelCard({ level, currentXP, xpToNextLevel }: LevelCardProps) {
  const colors = useColors();
  const xpForCurrentLevel = (level - 1) * 100;
  const progressPercent = ((currentXP - xpForCurrentLevel) / 100) * 100;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>⭐</Text>
        <View style={styles.levelInfo}>
          <Text style={styles.levelLabel}>Nível</Text>
          <Text style={styles.levelNumber}>{level}</Text>
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.progressText}>{xpToNextLevel} XP para o próximo nível</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
    },
    emoji: {
      fontSize: 40,
      marginRight: 16,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      marginBottom: 16,
    },
    levelInfo: {
      flex: 1,
    },
    levelLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    levelNumber: {
      color: colors.primary,
      fontSize: 32,
      fontWeight: 'bold',
    },
    progressBar: {
      backgroundColor: colors.border,
      borderRadius: 6,
      height: 12,
      overflow: 'hidden',
    },
    progressContainer: {
      gap: 8,
    },
    progressFill: {
      backgroundColor: colors.primary,
      borderRadius: 6,
      height: '100%',
    },
    progressText: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: 'center',
    },
  });

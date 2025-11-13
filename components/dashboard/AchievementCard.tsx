import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { Achievement } from '@/lib/types';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>{achievement.icon}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{achievement.title}</Text>
        <Text style={styles.description}>{achievement.description}</Text>
        <Text style={styles.date}>
          {new Date(achievement.earned_at).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    card: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderColor: colors.primary + '20',
      borderRadius: 12,
      borderWidth: 2,
      flexDirection: 'row',
      marginBottom: 12,
      padding: 16, // 20% opacity
    },
    content: {
      flex: 1,
    },
    date: {
      color: colors.textMuted,
      fontSize: 12,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    icon: {
      fontSize: 40,
      marginRight: 16,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
  });

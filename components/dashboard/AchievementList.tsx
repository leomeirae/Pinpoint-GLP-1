import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useColors } from '@/constants/colors';
import { Achievement } from '@/lib/types';
import { AchievementCard } from './AchievementCard';

interface AchievementListProps {
  achievements: Achievement[];
  loading?: boolean;
  maxVisible?: number;
}

export function AchievementList({ achievements, loading, maxVisible }: AchievementListProps) {
  const colors = useColors();
  if (loading) {
    const styles = getStyles(colors);

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (achievements.length === 0) {
    const styles = getStyles(colors);

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🏆</Text>
        <Text style={styles.emptyText}>Nenhuma conquista ainda</Text>
        <Text style={styles.emptySubtext}>
          Continue registrando seu progresso para desbloquear conquistas!
        </Text>
      </View>
    );
  }

  const displayAchievements = maxVisible ? achievements.slice(0, maxVisible) : achievements;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🏆 Suas Conquistas</Text>
        <Text style={styles.count}>{achievements.length}</Text>
      </View>

      <FlatList
        data={displayAchievements}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AchievementCard achievement={item} />}
        scrollEnabled={false}
      />

      {maxVisible && achievements.length > maxVisible && (
        <Text style={styles.moreText}>+{achievements.length - maxVisible} conquistas</Text>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    count: {
      backgroundColor: colors.card,
      borderRadius: 12,
      color: colors.primary,
      fontSize: 16,
      fontWeight: 'bold',
      paddingHorizontal: 12,
      paddingVertical: 4,
    },
    emptyContainer: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      padding: 32,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 12,
    },
    emptySubtext: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
    emptyText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    loadingContainer: {
      alignItems: 'center',
      padding: 32,
    },
    moreText: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

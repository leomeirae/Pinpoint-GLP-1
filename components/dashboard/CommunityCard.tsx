import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';

interface CommunityCardProps {
  yourWeightLost: number;
  avgWeightLost: number;
  yourPercentile: number;
  message: string;
  emoji: string;
  usersInSample: number;
}

export function CommunityCard({
  yourWeightLost,
  avgWeightLost,
  yourPercentile,
  message,
  emoji,
  usersInSample,
}: CommunityCardProps) {
  const colors = useColors();
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>

      <Text style={styles.message}>{message}</Text>

      <View style={styles.comparisonRow}>
        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Você</Text>
          <Text style={styles.comparisonValue}>{yourWeightLost.toFixed(1)}kg</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.comparisonItem}>
          <Text style={styles.comparisonLabel}>Média</Text>
          <Text style={styles.comparisonValue}>{avgWeightLost.toFixed(1)}kg</Text>
        </View>
      </View>

      <View style={styles.percentileBar}>
        <View style={[styles.percentileFill, { width: `${yourPercentile}%` }]} />
      </View>
      <Text style={styles.percentileText}>
        Top {100 - yourPercentile}% dos {usersInSample} usuários
      </Text>

      <Text style={styles.disclaimer}>* Dados anônimos e agregados da comunidade</Text>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    comparisonItem: {
      alignItems: 'center',
      flex: 1,
    },
    comparisonLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    comparisonRow: {
      flexDirection: 'row',
      marginBottom: 16,
      width: '100%',
    },
    comparisonValue: {
      color: colors.primary,
      fontSize: 24,
      fontWeight: 'bold',
    },
    container: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
    },
    disclaimer: {
      color: colors.textMuted,
      fontSize: 10,
      fontStyle: 'italic',
      textAlign: 'center',
    },
    divider: {
      backgroundColor: colors.border,
      marginHorizontal: 16,
      width: 1,
    },
    emoji: {
      fontSize: 48,
      marginBottom: 12,
    },
    message: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 20,
      textAlign: 'center',
    },
    percentileBar: {
      backgroundColor: colors.border,
      borderRadius: 4,
      height: 8,
      marginBottom: 8,
      overflow: 'hidden',
      width: '100%',
    },
    percentileFill: {
      backgroundColor: colors.success,
      borderRadius: 4,
      height: '100%',
    },
    percentileText: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 12,
    },
  });

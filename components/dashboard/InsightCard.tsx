import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { Insight } from '@/hooks/useInsights';

interface InsightCardProps {
  insight: Insight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const colors = useColors();
  const bgColor = {
    positive: colors.success + '20',
    warning: colors.warning + '20',
    neutral: colors.primary + '20',
    tip: colors.info + '20',
  }[insight.type];

  const borderColor = {
    positive: colors.success,
    warning: colors.warning,
    neutral: colors.primary,
    tip: colors.info,
  }[insight.type];

  const styles = getStyles(colors);

  return (
    <View style={[styles.container, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      <Text style={styles.emoji}>{insight.emoji}</Text>
      <View style={styles.content}>
        <Text style={styles.title}>{insight.title}</Text>
        <Text style={styles.description}>{insight.description}</Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      borderLeftWidth: 4,
      borderRadius: 12,
      flexDirection: 'row',
      marginBottom: 12,
      padding: 16,
    },
    content: {
      flex: 1,
    },
    description: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    emoji: {
      fontSize: 32,
      marginRight: 12,
    },
    title: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 4,
    },
  });

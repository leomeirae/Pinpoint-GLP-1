import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from '@/components/ui/icons';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  accentColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  accentColor,
}) => {
  const colors = useShotsyColors();

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend === 'down') return <ArrowDownIcon size="md" color={getTrendColor()} />;
    if (trend === 'up') return <ArrowUpIcon size="md" color={getTrendColor()} />;
    return <MinusIcon size="md" color={getTrendColor()} />;
  };

  const getTrendColor = () => {
    if (!trend) return colors.text;
    return trend === 'down' ? colors.success : trend === 'up' ? colors.error : colors.textSecondary;
  };

  return (
    <ShotsyCard style={styles.card}>
      <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
      <View style={styles.valueContainer}>
        {trend && (
          <View style={styles.trendIcon}>
            {getTrendIcon()}
          </View>
        )}
        <Text
          style={[
            styles.value,
            { color: accentColor || colors.primary },
          ]}
        >
          {value}
        </Text>
      </View>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </ShotsyCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trendIcon: {
    // No need for fontSize here, as AppIcon handles its own size
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 4,
  },
});
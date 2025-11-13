import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { CurrencyCircleDollar, TrendUp, Calendar, Question } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { formatCurrency } from '@/lib/finance';

interface FinancialSummaryCardProps {
  totalSpent: number; // in cents
  weeklySpent: number; // in cents
  costPerKg: number | null; // in cents, null if not available/opted-out
  nextPurchaseDate: Date | null;
  onCostPerKgInfo?: () => void; // Show info modal about R$/kg metric
}

export function FinancialSummaryCard({
  totalSpent,
  weeklySpent,
  costPerKg,
  nextPurchaseDate,
  onCostPerKgInfo,
}: FinancialSummaryCardProps) {
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Resumo Financeiro</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acompanhe seus gastos com o tratamento
        </Text>
      </View>

      {/* Metrics Grid */}
      <View style={styles.metricsGrid}>
        {/* Total Spent */}
        <View style={styles.metricItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
            <CurrencyCircleDollar size={20} color={colors.primary} weight="bold" />
          </View>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Total gasto</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {formatCurrency(totalSpent)}
          </Text>
        </View>

        {/* Weekly Spent */}
        <View style={styles.metricItem}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: (colors.accentGreen || '#22c55e') + '15' },
            ]}
          >
            <TrendUp size={20} color={colors.accentGreen || '#22c55e'} weight="bold" />
          </View>
          <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>Por semana</Text>
          <Text style={[styles.metricValue, { color: colors.text }]}>
            {formatCurrency(weeklySpent)}
          </Text>
        </View>

        {/* Cost per kg (only if opted in and data available) */}
        {costPerKg !== null && (
          <View style={styles.metricItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (colors.accentPurple || '#8B5CF6') + '15' },
              ]}
            >
              <TrendUp size={20} color={colors.accentPurple || '#8B5CF6'} weight="bold" />
            </View>
            <View style={styles.metricLabelRow}>
              <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>R$/kg</Text>
              {onCostPerKgInfo && (
                <TouchableOpacity onPress={onCostPerKgInfo} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Question size={14} color={colors.textMuted} weight="bold" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatCurrency(costPerKg)}/kg
            </Text>
          </View>
        )}

        {/* Next Purchase */}
        {nextPurchaseDate && (
          <View style={styles.metricItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: (colors.accentOrange || '#f97316') + '15' },
              ]}
            >
              <Calendar size={20} color={colors.accentOrange || '#f97316'} weight="bold" />
            </View>
            <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
              Próxima compra
            </Text>
            <Text style={[styles.metricValue, { color: colors.text }]}>
              {formatNextPurchaseDate(nextPurchaseDate)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function formatNextPurchaseDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Já passou';
  } else if (diffDays === 0) {
    return 'Hoje';
  } else if (diffDays === 1) {
    return 'Amanhã';
  } else if (diffDays <= 7) {
    return `Em ${diffDays} dias`;
  } else {
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  header: {
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  title: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.md,
  },
  metricItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  metricLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 2,
  },
  metricValue: {
    ...ShotsyDesignTokens.typography.h4,
    fontWeight: '600',
  },
});

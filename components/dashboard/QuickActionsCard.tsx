import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Syringe, Scale, CurrencyCircleDollar, Pause, Martini } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';

const logger = createLogger('QuickActionsCard');

interface QuickAction {
  id: string;
  label: string;
  icon: typeof Syringe;
  color: string;
  route: string;
  available?: boolean; // For future features (C4, C5)
}

export function QuickActionsCard() {
  const colors = useColors();

  const actions: QuickAction[] = [
    {
      id: 'add-dose',
      label: 'Registrar Dose',
      icon: Syringe,
      color: colors.primary,
      route: '/(tabs)/add-application',
      available: true,
    },
    {
      id: 'add-weight',
      label: 'Registrar Peso',
      icon: Scale,
      color: colors.accentGreen || '#22c55e',
      route: '/(tabs)/add-weight',
      available: true,
    },
    {
      id: 'add-purchase',
      label: 'Adicionar Compra',
      icon: CurrencyCircleDollar,
      color: colors.accentPurple || '#8B5CF6',
      route: '/(tabs)/finance/add-purchase',
      available: true, // C4 - Financeiro MVP
    },
    {
      id: 'pause-treatment',
      label: 'Pausar Tratamento',
      icon: Pause,
      color: colors.accentOrange || '#f97316',
      route: '/(tabs)/treatment/pause',
      available: true, // C5 - Pausas e Álcool
    },
    {
      id: 'log-alcohol',
      label: 'Marcar Álcool',
      icon: Martini,
      color: colors.accentRed || '#ef4444',
      route: '/(tabs)/habits/alcohol',
      available: true, // C5 - Pausas e Álcool
    },
  ];

  const handleActionPress = async (action: QuickAction) => {
    if (!action.available) {
      logger.debug('Action not yet available', { action: action.id });
      return;
    }

    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      logger.info('Quick action pressed', { action: action.id, route: action.route });
      router.push(action.route as any);
    } catch (error) {
      logger.error('Error navigating from quick action', error as Error);
    }
  };

  // Filter to only show available actions for now
  const availableActions = actions.filter((a) => a.available);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Ações Rápidas</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Registre rapidamente suas atividades
        </Text>
      </View>

      {/* Actions Grid */}
      <View style={styles.grid}>
        {availableActions.map((action) => {
          const Icon = action.icon;
          return (
            <Pressable
              key={action.id}
              style={({ pressed }) => [
                styles.actionButton,
                {
                  backgroundColor: colors.background,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handleActionPress(action)}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: action.color + '15' },
                ]}
              >
                <Icon size={24} color={action.color} weight="bold" />
              </View>
              <Text
                style={[styles.actionLabel, { color: colors.text }]}
                numberOfLines={2}
              >
                {action.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  header: {
    marginBottom: ShotsyDesignTokens.spacing.md,
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.md,
  },
  actionButton: {
    flex: 1,
    minWidth: 100,
    maxWidth: '48%',
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    padding: ShotsyDesignTokens.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  actionLabel: {
    ...ShotsyDesignTokens.typography.caption,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 16,
  },
});

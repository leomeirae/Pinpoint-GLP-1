import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Plus, Receipt } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { usePurchases } from '@/hooks/usePurchases';
import { useWeights } from '@/hooks/useWeights';
import { useProfile } from '@/hooks/useProfile';
import { getPurchaseSummary } from '@/lib/finance';
import { FinancialSummaryCard } from '@/components/finance/FinancialSummaryCard';
import { PurchaseListItem } from '@/components/finance/PurchaseListItem';
import { FadeInView, ScalePress } from '@/components/animations';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';

const logger = createLogger('FinanceScreen');

export default function FinanceScreen() {
  const colors = useColors();
  const [refreshing, setRefreshing] = useState(false);

  const { purchases, loading, refetch, deletePurchase } = usePurchases();
  const { weights } = useWeights();
  const { profile } = useProfile();

  // Get weight data
  const startWeight = profile?.start_weight || null;
  const sortedWeights = [...weights].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const currentWeight = sortedWeights.length > 0 ? sortedWeights[0].weight : null;

  // Get finance opt-in status (default false)
  const financeOptIn = profile?.finance_opt_in || false;

  // Calculate summary
  const summary = getPurchaseSummary(purchases, startWeight, currentWeight, financeOptIn);

  const handleAddPurchase = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/(tabs)/finance/add-purchase');
  };

  const handleEditPurchase = (purchase: any) => {
    router.push({
      pathname: '/(tabs)/finance/edit-purchase',
      params: { purchaseId: purchase.id },
    });
  };

  const handleDeletePurchase = async (purchaseId: string) => {
    try {
      await deletePurchase(purchaseId);
      logger.info('Purchase deleted', { purchaseId });
    } catch (error) {
      logger.error('Failed to delete purchase', error as Error);
      Alert.alert('Erro', 'Não foi possível excluir a compra. Tente novamente.');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      logger.error('Failed to refresh purchases', error as Error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCostPerKgInfo = () => {
    Alert.alert(
      'Custo por kg perdido',
      'Este é um indicador econômico que mostra quanto você gastou por kg perdido.\n\n' +
        'Importante: Este valor não reflete a eficácia do tratamento. Cada pessoa responde de forma diferente ao medicamento.\n\n' +
        'Use esta métrica apenas para acompanhar seus gastos de forma contextualizada.',
      [{ text: 'Entendi', style: 'default' }]
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Custos</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Custos</Text>
        <ScalePress onPress={handleAddPurchase} style={styles.addButton} hapticType="medium">
          <Plus size={20} color={colors.primary} weight="bold" />
          <Text style={[styles.addButtonText, { color: colors.primary }]}>Adicionar</Text>
        </ScalePress>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {purchases.length === 0 ? (
          // Empty state
          <FadeInView duration={800} delay={100} style={styles.emptyState}>
            <View
              style={[styles.emptyIconContainer, { backgroundColor: colors.primary + '15' }]}
            >
              <Receipt size={48} color={colors.primary} weight="thin" />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Nenhuma compra registrada
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Adicione suas compras de medicamentos para acompanhar os gastos do seu tratamento
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: colors.primary }]}
              onPress={handleAddPurchase}
            >
              <Plus size={20} color="#FFFFFF" weight="bold" />
              <Text style={styles.emptyButtonText}>Adicionar primeira compra</Text>
            </TouchableOpacity>
          </FadeInView>
        ) : (
          <>
            {/* Summary Card */}
            <FadeInView duration={800} delay={100}>
              <FinancialSummaryCard
                totalSpent={summary.totalSpent}
                weeklySpent={summary.weeklySpent}
                costPerKg={summary.costPerKg}
                nextPurchaseDate={summary.nextPurchaseDate}
                onCostPerKgInfo={handleCostPerKgInfo}
              />
            </FadeInView>

            {/* Purchases List */}
            <View style={styles.listSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Histórico de compras
              </Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                {summary.purchaseCount} {summary.purchaseCount === 1 ? 'compra' : 'compras'} •{' '}
                {summary.totalPens} {summary.totalPens === 1 ? 'caneta' : 'canetas'}
              </Text>

              {purchases.map((purchase, index) => (
                <FadeInView key={purchase.id} duration={600} delay={200 + index * 50}>
                  <PurchaseListItem
                    purchase={purchase}
                    onEdit={handleEditPurchase}
                    onDelete={handleDeletePurchase}
                  />
                </FadeInView>
              ))}
            </View>
          </>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: 60,
    paddingBottom: ShotsyDesignTokens.spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: ShotsyDesignTokens.spacing.sm,
    paddingVertical: 4,
  },
  addButtonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ShotsyDesignTokens.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...ShotsyDesignTokens.typography.body,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingVertical: ShotsyDesignTokens.spacing.xxl * 2,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  emptyTitle: {
    ...ShotsyDesignTokens.typography.h2,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  emptySubtitle: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingVertical: ShotsyDesignTokens.spacing.md,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  emptyButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  listSection: {
    marginTop: ShotsyDesignTokens.spacing.md,
  },
  sectionTitle: {
    ...ShotsyDesignTokens.typography.h3,
    marginBottom: 4,
  },
  sectionSubtitle: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  bottomSpacer: {
    height: ShotsyDesignTokens.spacing.xxl * 2,
  },
});

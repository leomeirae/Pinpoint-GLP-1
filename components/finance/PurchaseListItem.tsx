import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { PencilSimple, Trash, MapPin } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { formatCurrency } from '@/lib/finance';
import { Purchase } from '@/hooks/usePurchases';
import * as Haptics from 'expo-haptics';

interface PurchaseListItemProps {
  purchase: Purchase;
  onEdit: (purchase: Purchase) => void;
  onDelete: (purchaseId: string) => void;
}

export function PurchaseListItem({ purchase, onEdit, onDelete }: PurchaseListItemProps) {
  const colors = useColors();

  const handleEdit = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onEdit(purchase);
  };

  const handleDelete = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert(
      'Excluir compra',
      'Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onDelete(purchase.id);
          },
        },
      ]
    );
  };

  // Format date as DD/MM/YYYY
  const purchaseDate = purchase.date || new Date(purchase.purchase_date);
  const formattedDate = `${String(purchaseDate.getDate()).padStart(2, '0')}/${String(
    purchaseDate.getMonth() + 1
  ).padStart(2, '0')}/${purchaseDate.getFullYear()}`;

  // Calculate price per pen
  const pricePerPen = Math.round(purchase.total_price_cents / purchase.quantity);

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header with medication and date */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.medication, { color: colors.text }]}>
            {purchase.medication}
            {purchase.brand && (
              <Text style={[styles.brand, { color: colors.textSecondary }]}>
                {' '}
                ({purchase.brand})
              </Text>
            )}
          </Text>
          <Text style={[styles.dosage, { color: colors.textSecondary }]}>
            {purchase.dosage}mg • {purchase.quantity}x canetas
          </Text>
        </View>
        <Text style={[styles.date, { color: colors.textMuted }]}>{formattedDate}</Text>
      </View>

      {/* Price info */}
      <View style={styles.priceSection}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Total</Text>
          <Text style={[styles.totalPrice, { color: colors.primary }]}>
            {formatCurrency(purchase.total_price_cents)}
          </Text>
        </View>
        <View>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Por caneta</Text>
          <Text style={[styles.pricePerPen, { color: colors.text }]}>
            {formatCurrency(pricePerPen)}
          </Text>
        </View>
      </View>

      {/* Location (if available) */}
      {purchase.purchase_location && (
        <View style={styles.locationRow}>
          <MapPin size={14} color={colors.textMuted} weight="regular" />
          <Text style={[styles.location, { color: colors.textMuted }]}>
            {purchase.purchase_location}
          </Text>
        </View>
      )}

      {/* Notes (if available) */}
      {purchase.notes && (
        <Text style={[styles.notes, { color: colors.textSecondary }]} numberOfLines={2}>
          {purchase.notes}
        </Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.background }]}
          onPress={handleEdit}
          accessibilityRole="button"
          accessibilityLabel="Editar compra"
        >
          <PencilSimple size={18} color={colors.text} weight="regular" />
          <Text style={[styles.actionText, { color: colors.text }]}>Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: (colors.accentRed || '#ef4444') + '15' },
          ]}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Excluir compra"
        >
          <Trash size={18} color={colors.accentRed || '#ef4444'} weight="regular" />
          <Text style={[styles.actionText, { color: colors.accentRed || '#ef4444' }]}>
            Excluir
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  headerLeft: {
    flex: 1,
    marginRight: ShotsyDesignTokens.spacing.md,
  },
  medication: {
    ...ShotsyDesignTokens.typography.h4,
    fontWeight: '600',
    marginBottom: 2,
  },
  brand: {
    ...ShotsyDesignTokens.typography.caption,
    fontWeight: '400',
  },
  dosage: {
    ...ShotsyDesignTokens.typography.caption,
  },
  date: {
    ...ShotsyDesignTokens.typography.caption,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  priceLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 2,
  },
  totalPrice: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '700',
  },
  pricePerPen: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '600',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  location: {
    ...ShotsyDesignTokens.typography.caption,
  },
  notes: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
    marginTop: ShotsyDesignTokens.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: ShotsyDesignTokens.spacing.sm,
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
  },
  actionText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
});

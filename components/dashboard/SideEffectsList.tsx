import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useColors } from '@/constants/colors';
import { SideEffect } from '@/lib/types';

interface SideEffectsListProps {
  sideEffects: SideEffect[];
  maxVisible?: number;
  onEdit?: (sideEffect: SideEffect) => void;
  onDelete?: (sideEffectId: string) => void;
}

const SEVERITY_COLORS = {
  1: '#10b981',
  2: '#84cc16',
  3: '#f59e0b',
  4: '#f97316',
  5: '#ef4444',
};

const SEVERITY_LABELS = {
  1: 'Muito Leve',
  2: 'Leve',
  3: 'Moderado',
  4: 'Forte',
  5: 'Muito Forte',
};

export function SideEffectsList({
  sideEffects,
  maxVisible,
  onEdit,
  onDelete,
}: SideEffectsListProps) {
  const colors = useColors();
  const handleDelete = (sideEffect: SideEffect) => {
    Alert.alert(
      'Excluir Efeito Colateral',
      `Tem certeza que deseja excluir "${sideEffect.type}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete?.(sideEffect.id),
        },
      ]
    );
  };

  if (sideEffects.length === 0) {
    const styles = getStyles(colors);

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyText}>Nenhum efeito colateral registrado</Text>
        <Text style={styles.emptySubtext}>Ótimo! Continue registrando caso sinta algo.</Text>
      </View>
    );
  }

  const displayEffects = maxVisible ? sideEffects.slice(0, maxVisible) : sideEffects;

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚠️ Efeitos Colaterais</Text>
        <Text style={styles.count}>{sideEffects.length}</Text>
      </View>

      <FlatList
        data={displayEffects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const severityColor = SEVERITY_COLORS[item.severity];
          const severityLabel = SEVERITY_LABELS[item.severity];

          const styles = getStyles(colors);

          return (
            <View style={styles.effectCard}>
              <View style={styles.cardHeader}>
                <View style={styles.cardContent}>
                  <View style={styles.effectHeader}>
                    <View style={styles.effectTitleRow}>
                      <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                      <Text style={styles.effectType}>{item.type}</Text>
                    </View>
                    <View style={[styles.severityBadge, { backgroundColor: severityColor + '20' }]}>
                      <Text style={[styles.severityText, { color: severityColor }]}>
                        {severityLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.effectDate}>
                    {new Date(item.date).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </Text>

                  {item.notes && <Text style={styles.effectNotes}>{item.notes}</Text>}
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => onEdit?.(item)} style={styles.actionButton}>
                    <Text style={styles.actionIcon}>✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                    <Text style={styles.actionIcon}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        }}
        scrollEnabled={false}
      />

      {maxVisible && sideEffects.length > maxVisible && (
        <Text style={styles.moreText}>+{sideEffects.length - maxVisible} efeitos registrados</Text>
      )}
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    actionButton: {
      backgroundColor: colors.background,
      borderRadius: 6,
      padding: 6,
    },
    actionIcon: {
      fontSize: 16,
    },
    actions: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      gap: 4,
    },
    cardContent: {
      flex: 1,
    },
    cardHeader: {
      flexDirection: 'row',
      gap: 12,
      justifyContent: 'space-between',
    },
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
    effectCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      padding: 16,
    },
    effectDate: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 8,
    },
    effectHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    effectNotes: {
      color: colors.textSecondary,
      fontSize: 14,
      fontStyle: 'italic',
    },
    effectTitleRow: {
      alignItems: 'center',
      flexDirection: 'row',
      flex: 1,
    },
    effectType: {
      color: colors.text,
      fontSize: 16,
      fontWeight: 'bold',
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
    moreText: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: 8,
      textAlign: 'center',
    },
    severityBadge: {
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    severityDot: {
      borderRadius: 6,
      height: 12,
      marginRight: 8,
      width: 12,
    },
    severityText: {
      fontSize: 11,
      fontWeight: '600',
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

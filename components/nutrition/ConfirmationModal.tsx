import { Modal, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { Button } from '@/components/ui/button';
import { X, Check, Pencil } from 'phosphor-react-native';
import { NutritionAnalysis } from '@/lib/gemini';

interface ConfirmationModalProps {
  visible: boolean;
  analysis: NutritionAnalysis | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmationModal({
  visible,
  analysis,
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmationModalProps) {
  const colors = useShotsyColors();
  const styles = getStyles(colors);

  if (!analysis) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Confirmar Registro</Text>
            <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
              <X size={24} color={colors.textSecondary} weight="bold" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📝 Resumo da IA</Text>
              <Text style={styles.summaryText}>{analysis.rawResponse}</Text>
            </View>

            {(analysis.calories || analysis.protein || analysis.carbs || analysis.fats) && (
              <View style={styles.macrosSection}>
                <Text style={styles.sectionTitle}>📊 Macros detectados</Text>
                <View style={styles.macrosGrid}>
                  {analysis.calories && (
                    <View style={styles.macroCard}>
                      <Text style={styles.macroValue}>{analysis.calories}</Text>
                      <Text style={styles.macroLabel}>kcal</Text>
                    </View>
                  )}
                  {analysis.protein && (
                    <View style={styles.macroCard}>
                      <Text style={styles.macroValue}>{analysis.protein}g</Text>
                      <Text style={styles.macroLabel}>proteína</Text>
                    </View>
                  )}
                  {analysis.carbs && (
                    <View style={styles.macroCard}>
                      <Text style={styles.macroValue}>{analysis.carbs}g</Text>
                      <Text style={styles.macroLabel}>carboidratos</Text>
                    </View>
                  )}
                  {analysis.fats && (
                    <View style={styles.macroCard}>
                      <Text style={styles.macroValue}>{analysis.fats}g</Text>
                      <Text style={styles.macroLabel}>gorduras</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                ℹ️ As informações acima são estimativas baseadas na descrição fornecida.
                Você pode editá-las depois no histórico.
              </Text>
            </View>
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onCancel}
              disabled={loading}
            >
              <X size={20} color={colors.textSecondary} weight="bold" />
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={onConfirm}
              disabled={loading}
            >
              <Check size={20} color="#fff" weight="bold" />
              <Text style={styles.confirmButtonText}>
                {loading ? 'Salvando...' : 'Confirmar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.text,
  },
  macrosSection: {
    marginBottom: 24,
  },
  macrosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  macroCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    minWidth: '30%',
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  confirmButton: {
    backgroundColor: colors.primary,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});


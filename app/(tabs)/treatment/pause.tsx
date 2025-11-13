import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Pause, Play, Clock } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useTreatmentPauses } from '@/hooks/useTreatmentPauses';
import { useProfile } from '@/hooks/useProfile';
import { pauseReminders, resumeReminders } from '@/lib/notifications';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';
import { FadeInView } from '@/components/animations';

const logger = createLogger('TreatmentPauseScreen');

const PAUSE_REASONS = [
  'Férias',
  'Viagem',
  'Efeitos colaterais',
  'Falta de medicamento',
  'Orientação médica',
  'Outro',
];

export default function TreatmentPauseScreen() {
  const colors = useColors();
  const { profile } = useProfile();
  const { pauses, loading, activePause, isCurrentlyPaused, startPause, endPause, refetch } =
    useTreatmentPauses();

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isPausing, setIsPausing] = useState(false);

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handlePauseTreatment = () => {
    setShowPauseModal(true);
    setSelectedReason('');
    setNotes('');
  };

  const handleConfirmPause = async () => {
    if (!selectedReason) {
      Alert.alert('Motivo obrigatório', 'Selecione o motivo da pausa');
      return;
    }

    setIsPausing(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      await startPause(today, selectedReason, notes);

      // Pause notifications
      await pauseReminders();

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logger.info('Treatment paused successfully');

      setShowPauseModal(false);
      Alert.alert(
        'Tratamento pausado',
        'Seus lembretes de medicação foram desligados. Você pode retomar a qualquer momento.'
      );
    } catch (error) {
      logger.error('Failed to pause treatment', error as Error);
      Alert.alert('Erro', 'Não foi possível pausar o tratamento. Tente novamente.');
    } finally {
      setIsPausing(false);
    }
  };

  const handleResumeTreatment = async () => {
    if (!activePause) return;

    Alert.alert(
      'Retomar tratamento',
      'Deseja retomar o tratamento? Seus lembretes de medicação serão religados.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Retomar',
          style: 'default',
          onPress: async () => {
            try {
              const today = new Date().toISOString().split('T')[0];
              await endPause(activePause.id, today);

              // Resume notifications
              const preferredDay = profile?.preferred_day || 0;
              const preferredTime = profile?.preferred_time || '09:00';
              await resumeReminders(preferredDay, preferredTime);

              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              logger.info('Treatment resumed successfully');

              Alert.alert(
                'Tratamento retomado',
                'Seus lembretes de medicação foram religados.'
              );
            } catch (error) {
              logger.error('Failed to resume treatment', error as Error);
              Alert.alert('Erro', 'Não foi possível retomar o tratamento. Tente novamente.');
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} weight="regular" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Pausas</Text>
          <View style={styles.headerSpacer} />
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
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} weight="regular" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Pausas</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Card */}
        <FadeInView duration={800} delay={100}>
          <View
            style={[
              styles.statusCard,
              {
                backgroundColor: isCurrentlyPaused
                  ? (colors.accentOrange || '#f97316') + '15'
                  : colors.card,
              },
            ]}
          >
            <View style={styles.statusHeader}>
              {isCurrentlyPaused ? (
                <Pause
                  size={32}
                  color={colors.accentOrange || '#f97316'}
                  weight="bold"
                />
              ) : (
                <Play size={32} color={colors.accentGreen || '#22c55e'} weight="fill" />
              )}
              <View style={styles.statusTextContainer}>
                <Text
                  style={[
                    styles.statusTitle,
                    {
                      color: isCurrentlyPaused
                        ? colors.accentOrange || '#f97316'
                        : colors.accentGreen || '#22c55e',
                    },
                  ]}
                >
                  {isCurrentlyPaused ? 'Tratamento Pausado' : 'Tratamento Ativo'}
                </Text>
                {isCurrentlyPaused && activePause && (
                  <Text style={[styles.statusSubtitle, { color: colors.textSecondary }]}>
                    Pausado há {activePause.durationDays}{' '}
                    {activePause.durationDays === 1 ? 'dia' : 'dias'}
                  </Text>
                )}
              </View>
            </View>

            {isCurrentlyPaused && activePause && (
              <View style={styles.pauseDetails}>
                <Text style={[styles.pauseDetailLabel, { color: colors.textSecondary }]}>
                  Início da pausa
                </Text>
                <Text style={[styles.pauseDetailValue, { color: colors.text }]}>
                  {formatDate(activePause.start_date)}
                </Text>

                {activePause.reason && (
                  <>
                    <Text
                      style={[
                        styles.pauseDetailLabel,
                        { color: colors.textSecondary, marginTop: ShotsyDesignTokens.spacing.md },
                      ]}
                    >
                      Motivo
                    </Text>
                    <Text style={[styles.pauseDetailValue, { color: colors.text }]}>
                      {activePause.reason}
                    </Text>
                  </>
                )}

                {activePause.notes && (
                  <>
                    <Text
                      style={[
                        styles.pauseDetailLabel,
                        { color: colors.textSecondary, marginTop: ShotsyDesignTokens.spacing.md },
                      ]}
                    >
                      Observações
                    </Text>
                    <Text style={[styles.pauseDetailValue, { color: colors.text }]}>
                      {activePause.notes}
                    </Text>
                  </>
                )}
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.actionButton,
                {
                  backgroundColor: isCurrentlyPaused
                    ? colors.accentGreen || '#22c55e'
                    : colors.accentOrange || '#f97316',
                },
              ]}
              onPress={isCurrentlyPaused ? handleResumeTreatment : handlePauseTreatment}
            >
              {isCurrentlyPaused ? (
                <>
                  <Play size={20} color="#FFFFFF" weight="fill" />
                  <Text style={styles.actionButtonText}>Retomar Tratamento</Text>
                </>
              ) : (
                <>
                  <Pause size={20} color="#FFFFFF" weight="bold" />
                  <Text style={styles.actionButtonText}>Pausar Tratamento</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Timeline of Previous Pauses */}
        {pauses.filter((p) => !p.isActive).length > 0 && (
          <View style={styles.timelineSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Histórico de pausas
            </Text>

            {pauses
              .filter((p) => !p.isActive)
              .map((pause, index) => (
                <FadeInView key={pause.id} duration={600} delay={200 + index * 50}>
                  <View style={[styles.timelineItem, { backgroundColor: colors.card }]}>
                    <View style={styles.timelineItemHeader}>
                      <Clock size={20} color={colors.textMuted} weight="regular" />
                      <Text style={[styles.timelineItemDate, { color: colors.text }]}>
                        {formatDate(pause.start_date)} até {formatDate(pause.end_date!)}
                      </Text>
                    </View>

                    <Text style={[styles.timelineItemDuration, { color: colors.textSecondary }]}>
                      Duração: {pause.durationDays}{' '}
                      {pause.durationDays === 1 ? 'dia' : 'dias'}
                    </Text>

                    {pause.reason && (
                      <Text style={[styles.timelineItemReason, { color: colors.textSecondary }]}>
                        {pause.reason}
                      </Text>
                    )}
                  </View>
                </FadeInView>
              ))}
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Pause Modal */}
      <Modal
        visible={showPauseModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPauseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Pausar Tratamento</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Seus lembretes de medicação serão desligados durante a pausa
            </Text>

            <Text style={[styles.fieldLabel, { color: colors.text }]}>Motivo</Text>
            <View style={styles.reasonGrid}>
              {PAUSE_REASONS.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonOption,
                    {
                      backgroundColor:
                        selectedReason === reason ? colors.primary + '15' : colors.background,
                      borderColor: selectedReason === reason ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      { color: selectedReason === reason ? colors.primary : colors.text },
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.fieldLabel, { color: colors.text, marginTop: ShotsyDesignTokens.spacing.lg }]}>
              Observações (opcional)
            </Text>
            <TextInput
              style={[
                styles.notesInput,
                { backgroundColor: colors.background, color: colors.text, borderColor: colors.border },
              ]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Adicione observações sobre a pausa"
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.background }]}
                onPress={() => setShowPauseModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.accentOrange || '#f97316',
                    opacity: isPausing ? 0.6 : 1,
                  },
                ]}
                onPress={handleConfirmPause}
                disabled={isPausing}
              >
                <Text style={[styles.modalButtonText, { color: '#FFFFFF' }]}>
                  {isPausing ? 'Pausando...' : 'Confirmar Pausa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  backButton: {
    padding: ShotsyDesignTokens.spacing.sm,
    marginLeft: -ShotsyDesignTokens.spacing.sm,
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
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
  statusCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.xl,
    ...ShotsyDesignTokens.shadows.card,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.md,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '700',
    marginBottom: 2,
  },
  statusSubtitle: {
    ...ShotsyDesignTokens.typography.caption,
  },
  pauseDetails: {
    marginBottom: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.md,
  },
  pauseDetailLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 4,
  },
  pauseDetailValue: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '500',
  },
  actionButton: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...ShotsyDesignTokens.shadows.card,
  },
  actionButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  timelineSection: {
    marginTop: ShotsyDesignTokens.spacing.md,
  },
  sectionTitle: {
    ...ShotsyDesignTokens.typography.h3,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  timelineItem: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.md,
    marginBottom: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  timelineItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: 4,
  },
  timelineItemDate: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '600',
  },
  timelineItemDuration: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 2,
  },
  timelineItemReason: {
    ...ShotsyDesignTokens.typography.caption,
  },
  bottomSpacer: {
    height: ShotsyDesignTokens.spacing.xxl * 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: ShotsyDesignTokens.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    padding: ShotsyDesignTokens.spacing.xl,
    ...ShotsyDesignTokens.shadows.modal,
  },
  modalTitle: {
    ...ShotsyDesignTokens.typography.h2,
    fontWeight: '700',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  modalSubtitle: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  fieldLabel: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  reasonOption: {
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    paddingVertical: ShotsyDesignTokens.spacing.sm,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 2,
  },
  reasonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 80,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    padding: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.body,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  modalActions: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  modalButton: {
    flex: 1,
    height: 48,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
});

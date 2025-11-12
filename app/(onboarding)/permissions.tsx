import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { BellRinging, ArrowLeft } from 'phosphor-react-native';
import * as Notifications from 'expo-notifications';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';
import { scheduleWeeklyMedicationReminder } from '@/lib/notifications';
import { createLogger } from '@/lib/logger';

const logger = createLogger('PermissionsScreen');

export default function PermissionsScreen() {
  const colors = useColors();
  const { data, markStepCompleted } = useOnboardingContext();

  const [permissionStatus, setPermissionStatus] = useState<'idle' | 'granted' | 'denied'>('idle');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleEnableNotifications = async () => {
    setIsRequesting(true);
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus === 'granted') {
        setPermissionStatus('granted');
        logger.info('Notification permissions granted');

        // C2: Schedule weekly medication reminder if user selected day and time
        if (data.preferredDay !== null && data.preferredTime) {
          const identifier = await scheduleWeeklyMedicationReminder(
            data.preferredDay,
            data.preferredTime
          );

          if (identifier) {
            logger.info('Weekly medication reminder scheduled', {
              day: data.preferredDay,
              time: data.preferredTime,
              identifier,
            });
          }
        }
      } else {
        setPermissionStatus('denied');
        logger.warn('Notification permissions denied');
      }
    } catch (error) {
      logger.error('Failed to request notification permissions', error as Error);
      setPermissionStatus('denied');
    } finally {
      setIsRequesting(false);
    }
  };

  const handleSkip = () => {
    logger.info('User skipped notification permissions');
    handleContinue();
  };

  const handleContinue = () => {
    markStepCompleted('permissions');
    router.push('/(onboarding)/feature-hook');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ArrowLeft size={24} color={colors.text} weight="regular" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <BellRinging size={48} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Ative as notificações
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Receba lembretes no horário que você escolheu para nunca esquecer suas aplicações
        </Text>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <BenefitItem
            text="Lembretes no horário escolhido"
            color={colors.textSecondary}
          />
          <BenefitItem
            text="Notificações de aplicações pendentes"
            color={colors.textSecondary}
          />
          <BenefitItem
            text="Alertas de progresso de peso"
            color={colors.textSecondary}
          />
        </View>

        {/* Permission Status */}
        {permissionStatus === 'granted' && (
          <View style={[styles.statusCard, { backgroundColor: colors.primary + '15' }]}>
            <Text style={[styles.statusText, { color: colors.primary }]}>
              Notificações ativadas com sucesso
            </Text>
          </View>
        )}

        {permissionStatus === 'denied' && (
          <View style={[styles.statusCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Você pode ativar notificações mais tarde nas configurações do app
            </Text>
          </View>
        )}

        {/* Info Note */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Você pode ajustar suas preferências de notificações a qualquer momento nas configurações
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>5 de 5</Text>
        </View>

        {/* Action Buttons */}
        {permissionStatus === 'idle' && (
          <>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleEnableNotifications}
              disabled={isRequesting}
              accessibilityRole="button"
              accessibilityLabel="Ativar notificações"
            >
              <Text style={styles.buttonText}>
                {isRequesting ? 'Aguarde...' : 'Ativar notificações'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Pular esta etapa"
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Pular por enquanto
              </Text>
            </TouchableOpacity>
          </>
        )}

        {permissionStatus !== 'idle' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={handleContinue}
            accessibilityRole="button"
            accessibilityLabel="Continuar"
          >
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

function BenefitItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.benefitItem}>
      <View style={[styles.bullet, { backgroundColor: color + '40' }]} />
      <Text style={[styles.benefitText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
    paddingBottom: ShotsyDesignTokens.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    lineHeight: 22,
  },
  benefitsContainer: {
    gap: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  benefitText: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
  },
  statusCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  statusText: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  infoText: {
    ...ShotsyDesignTokens.typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingTop: ShotsyDesignTokens.spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  progressDots: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  progressText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  button: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  buttonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  skipButton: {
    marginTop: ShotsyDesignTokens.spacing.md,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '600',
  },
});

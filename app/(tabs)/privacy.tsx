import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, ShieldCheck, Info } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { getAnalyticsOptIn, setAnalyticsOptIn } from '@/lib/analytics';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';

const logger = createLogger('PrivacyScreen');

export default function PrivacyScreen() {
  const colors = useColors();
  const [analyticsOptIn, setAnalyticsOptInState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load analytics opt-in status on mount
  useEffect(() => {
    loadAnalyticsOptIn();
  }, []);

  const loadAnalyticsOptIn = async () => {
    try {
      const optIn = await getAnalyticsOptIn();
      setAnalyticsOptInState(optIn);
      logger.info('Analytics opt-in loaded', { optIn });
    } catch (error) {
      logger.error('Failed to load analytics opt-in', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleAnalytics = async (value: boolean) => {
    if (isSaving) return;

    setIsSaving(true);
    try {
      // Haptic feedback
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Update state immediately for responsive UI
      setAnalyticsOptInState(value);

      // Save to storage and Supabase
      await setAnalyticsOptIn(value);

      logger.info('Analytics opt-in updated', { value });

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      logger.error('Failed to update analytics opt-in', error as Error);

      // Revert state on error
      setAnalyticsOptInState(!value);

      // Error haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://pinpointglp1.app/privacy');
  };

  const handleBack = () => {
    router.back();
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacidade</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <ShieldCheck size={48} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Seus dados, suas escolhas</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Você tem controle total sobre como seus dados são usados
        </Text>

        {/* Analytics Section */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Compartilhamento de Dados de Uso
            </Text>
            <Switch
              value={analyticsOptIn}
              onValueChange={handleToggleAnalytics}
              disabled={isLoading || isSaving}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
              ios_backgroundColor={colors.border}
            />
          </View>

          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Compartilhar dados anônimos de uso nos ajuda a melhorar o aplicativo e criar recursos
            mais úteis para você.
          </Text>

          <View style={[styles.infoBox, { backgroundColor: colors.background }]}>
            <Info size={16} color={colors.textMuted} weight="bold" />
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
              Seus dados de saúde nunca são compartilhados. Apenas eventos de uso do app (telas
              visitadas, botões clicados) são coletados de forma anônima.
            </Text>
          </View>
        </View>

        {/* What We Collect */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            O que coletamos quando você aceita
          </Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Telas visitadas e tempo de uso
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Interações com recursos (botões, navegação)
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.textSecondary }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Erros e crashes para melhorar a estabilidade
              </Text>
            </View>
          </View>
        </View>

        {/* What We Never Collect */}
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>O que nunca coletamos</Text>

          <View style={styles.bulletList}>
            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.accentRed }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Dados de peso ou medições corporais
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.accentRed }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Informações sobre medicamentos ou doses
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.accentRed }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Notas pessoais ou efeitos colaterais
              </Text>
            </View>

            <View style={styles.bulletItem}>
              <View style={[styles.bullet, { backgroundColor: colors.accentRed }]} />
              <Text style={[styles.bulletText, { color: colors.textSecondary }]}>
                Fotos, vídeos ou documentos
              </Text>
            </View>
          </View>
        </View>

        {/* Privacy Policy Link */}
        <TouchableOpacity
          style={[styles.linkButton, { backgroundColor: colors.card }]}
          onPress={handlePrivacyPolicy}
          accessibilityRole="button"
          accessibilityLabel="Ler política de privacidade completa"
        >
          <Text style={[styles.linkButtonText, { color: colors.primary }]}>
            Ler Política de Privacidade Completa
          </Text>
        </TouchableOpacity>

        {/* LGPD Compliance Note */}
        <View style={[styles.complianceNote, { backgroundColor: colors.card }]}>
          <Text style={[styles.complianceText, { color: colors.textMuted }]}>
            Este app está em conformidade com a LGPD (Lei Geral de Proteção de Dados) e GDPR
            (General Data Protection Regulation).
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  bullet: {
    borderRadius: 3,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  bulletItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.md,
  },
  bulletList: {
    gap: ShotsyDesignTokens.spacing.md,
  },
  bulletText: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
    lineHeight: 22,
  },
  complianceNote: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  complianceText: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
    textAlign: 'center',
  },
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: ShotsyDesignTokens.spacing.md,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
  },
  headerSpacer: {
    width: 44,
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    height: 96,
    justifyContent: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
    width: 96,
  },
  infoBox: {
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
    padding: ShotsyDesignTokens.spacing.md,
  },
  infoText: {
    ...ShotsyDesignTokens.typography.caption,
    flex: 1,
    lineHeight: 18,
  },
  linkButton: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  linkButtonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  sectionDescription: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  sectionTitle: {
    ...ShotsyDesignTokens.typography.label,
    flex: 1,
    fontWeight: '600',
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    textAlign: 'center',
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
});

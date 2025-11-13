import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { ShieldCheck, ArrowLeft } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';

export default function ComplianceScreen() {
  const colors = useColors();
  const { updateData, markStepCompleted, data } = useOnboardingContext();
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [analyticsOptIn, setAnalyticsOptIn] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleContinue = () => {
    if (!acceptedDisclaimer) {
      return; // Cannot proceed without accepting disclaimer
    }

    const now = new Date().toISOString();
    markStepCompleted('compliance');
    updateData({
      currentStep: 2,
      consentVersion: '1.0.0',
      consentAcceptedAt: now,
      analyticsOptIn: analyticsOptIn, // User's choice, defaults to false
    });
    router.push('/(onboarding)/medication-dose');
  };

  const canContinue = acceptedDisclaimer;

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
          <ShieldCheck size={48} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Termos e Consentimento</Text>

        {/* Disclaimer clínico */}
        <View style={[styles.disclaimerCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.disclaimerTitle, { color: colors.text }]}>Aviso Importante</Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Este aplicativo é uma ferramenta de acompanhamento pessoal e não substitui orientação
            médica profissional.
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Sempre consulte seu médico antes de iniciar, modificar ou interromper qualquer
            tratamento com medicamentos GLP-1.
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Este app não fornece diagnósticos, prescrições ou recomendações médicas.
          </Text>
        </View>

        {/* Checkbox: Aceitar disclaimer (obrigatório) */}
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAcceptedDisclaimer(!acceptedDisclaimer)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedDisclaimer }}
          accessibilityLabel="Li e aceito os termos"
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: acceptedDisclaimer ? colors.primary : colors.border,
                backgroundColor: acceptedDisclaimer ? colors.primary : 'transparent',
              },
            ]}
          >
            {acceptedDisclaimer && (
              <View style={[styles.checkmark, { backgroundColor: '#FFFFFF' }]} />
            )}
          </View>
          <Text style={[styles.checkboxLabel, { color: colors.text }]}>
            Li e aceito os termos acima
          </Text>
        </TouchableOpacity>

        {/* LGPD: Analytics opt-in (opcional) */}
        <View style={[styles.privacyCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.privacyTitle, { color: colors.text }]}>Privacidade e Dados</Text>
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Podemos coletar dados anônimos de uso para melhorar o aplicativo. Nenhum dado pessoal ou
            de saúde será compartilhado.
          </Text>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAnalyticsOptIn(!analyticsOptIn)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: analyticsOptIn }}
            accessibilityLabel="Compartilhar dados anônimos de uso"
          >
            <View
              style={[
                styles.checkbox,
                {
                  borderColor: analyticsOptIn ? colors.primary : colors.border,
                  backgroundColor: analyticsOptIn ? colors.primary : 'transparent',
                },
              ]}
            >
              {analyticsOptIn && (
                <View style={[styles.checkmark, { backgroundColor: '#FFFFFF' }]} />
              )}
            </View>
            <Text style={[styles.checkboxLabel, { color: colors.text }]}>
              Concordo em compartilhar dados anônimos de uso
            </Text>
          </TouchableOpacity>
        </View>

        {/* Link para política de privacidade */}
        <TouchableOpacity style={styles.linkContainer}>
          <Text style={[styles.linkText, { color: colors.primary }]}>
            Ver Política de Privacidade
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>2 de 5</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: canContinue ? colors.primary : colors.border,
            },
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text style={[styles.buttonText, { color: canContinue ? '#FFFFFF' : colors.textMuted }]}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
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
  button: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    height: 56,
    justifyContent: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  buttonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  checkbox: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkboxContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.md,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  checkboxLabel: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
  },
  checkmark: {
    borderRadius: 3,
    height: 12,
    width: 12,
  },
  container: {
    flex: 1,
  },
  disclaimerCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  disclaimerText: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  disclaimerTitle: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    width: 24,
  },
  footer: {
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingTop: ShotsyDesignTokens.spacing.md,
  },
  header: {
    paddingBottom: ShotsyDesignTokens.spacing.sm,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
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
  linkContainer: {
    alignItems: 'center',
    paddingVertical: ShotsyDesignTokens.spacing.sm,
  },
  linkText: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  privacyCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    marginBottom: ShotsyDesignTokens.spacing.md,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  privacyText: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  privacyTitle: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
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
  progressText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  scrollContent: {
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    textAlign: 'center',
  },
});

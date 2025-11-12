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
        <Text style={[styles.title, { color: colors.text }]}>
          Termos e Consentimento
        </Text>

        {/* Disclaimer clínico */}
        <View style={[styles.disclaimerCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.disclaimerTitle, { color: colors.text }]}>
            Aviso Importante
          </Text>
          <Text style={[styles.disclaimerText, { color: colors.textSecondary }]}>
            Este aplicativo é uma ferramenta de acompanhamento pessoal e não substitui
            orientação médica profissional.
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
          <Text style={[styles.privacyTitle, { color: colors.text }]}>
            Privacidade e Dados
          </Text>
          <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
            Podemos coletar dados anônimos de uso para melhorar o aplicativo.
            Nenhum dado pessoal ou de saúde será compartilhado.
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
          <Text
            style={[
              styles.buttonText,
              { color: canContinue ? '#FFFFFF' : colors.textMuted },
            ]}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    marginBottom: ShotsyDesignTokens.spacing.xxl,
  },
  disclaimerCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  disclaimerTitle: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  disclaimerText: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.md,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  checkboxLabel: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
  },
  privacyCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  privacyTitle: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  privacyText: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.md,
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
    fontWeight: '600',
  },
});

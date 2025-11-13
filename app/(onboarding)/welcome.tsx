import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Syringe } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';

export default function WelcomeScreen() {
  const colors = useColors();
  const { updateData, markStepCompleted } = useOnboardingContext();

  const handleContinue = () => {
    markStepCompleted('welcome');
    updateData({ currentStep: 1 });
    router.push('/(onboarding)/compliance');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Syringe size={64} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          Bem-vindo ao Pinpoint GLP-1
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acompanhe seu tratamento com medicamentos GLP-1 de forma simples e organizada
        </Text>

        {/* Value propositions */}
        <View style={styles.features}>
          <FeatureItem
            text="Registre aplicações e doses semanais"
            color={colors.textSecondary}
          />
          <FeatureItem
            text="Acompanhe progresso de peso ao longo do tempo"
            color={colors.textSecondary}
          />
          <FeatureItem
            text="Receba lembretes personalizados"
            color={colors.textSecondary}
          />
          <FeatureItem
            text="Controle financeiro de compras e custos"
            color={colors.textSecondary}
          />
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>1 de 5</Text>
        </View>

        {/* CTA Button */}
        <View
          style={[styles.button, { backgroundColor: colors.primary }]}
          onTouchEnd={handleContinue}
          accessibilityRole="button"
          accessibilityLabel="Começar configuração"
        >
          <Text style={styles.buttonText}>Começar</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ text, color }: { text: string; color: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={[styles.bullet, { backgroundColor: color + '40' }]} />
      <Text style={[styles.featureText, { color }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingTop: ShotsyDesignTokens.spacing.xxxl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: ShotsyDesignTokens.borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  title: {
    ...ShotsyDesignTokens.typography.h1,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    lineHeight: 24,
  },
  features: {
    gap: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  featureText: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
  },
  progressContainer: {
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.xl,
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
});

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
        <Text style={[styles.title, { color: colors.text }]}>Bem-vindo ao Pinpoint GLP-1</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Acompanhe seu tratamento com medicamentos GLP-1 de forma simples e organizada
        </Text>

        {/* Value propositions */}
        <View style={styles.features}>
          <FeatureItem text="Registre aplicações e doses semanais" color={colors.textSecondary} />
          <FeatureItem
            text="Acompanhe progresso de peso ao longo do tempo"
            color={colors.textSecondary}
          />
          <FeatureItem text="Receba lembretes personalizados" color={colors.textSecondary} />
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
  bullet: {
    borderRadius: 4,
    height: 8,
    width: 8,
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
    color: '#FFFFFF',
    fontWeight: '600',
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingTop: ShotsyDesignTokens.spacing.xxxl,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    width: 24,
  },
  featureItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.md,
  },
  featureText: {
    ...ShotsyDesignTokens.typography.body,
    flex: 1,
  },
  features: {
    gap: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.xxl,
    height: 120,
    justifyContent: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xl,
    width: 120,
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
  progressText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 24,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    textAlign: 'center',
  },
  title: {
    ...ShotsyDesignTokens.typography.h1,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
});

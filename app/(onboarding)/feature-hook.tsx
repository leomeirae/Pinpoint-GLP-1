import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import {
  Syringe,
  ChartLineUp,
  Calendar,
  CurrencyCircleDollar,
  ArrowRight,
} from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';
import { useOnboarding } from '@/hooks/useOnboarding';
import { setAnalyticsOptIn } from '@/lib/analytics';
import { createLogger } from '@/lib/logger';

const logger = createLogger('FeatureHookScreen');
const { width } = Dimensions.get('window');
const CARD_WIDTH = width - ShotsyDesignTokens.spacing.xl * 2;

interface Feature {
  icon: typeof Syringe;
  title: string;
  description: string;
  color: string;
}

const FEATURES: Feature[] = [
  {
    icon: Syringe,
    title: 'Registre suas aplicações',
    description:
      'Acompanhe cada aplicação do seu medicamento GLP-1 com detalhes sobre dose, local e horário',
    color: '#4F46E5',
  },
  {
    icon: ChartLineUp,
    title: 'Monitore seu progresso',
    description:
      'Visualize gráficos de evolução de peso e acompanhe seus resultados ao longo do tempo',
    color: '#10B981',
  },
  {
    icon: Calendar,
    title: 'Calendário inteligente',
    description:
      'Veja todas as suas aplicações e medições organizadas em um calendário visual e intuitivo',
    color: '#F59E0B',
  },
  {
    icon: CurrencyCircleDollar,
    title: 'Controle financeiro',
    description:
      'Gerencie compras de medicamentos, acompanhe custos e calcule o custo por dose aplicada',
    color: '#8B5CF6',
  },
];

export default function FeatureHookScreen() {
  const colors = useColors();
  const { data, saveToStorage } = useOnboardingContext();
  const { saveOnboardingData } = useOnboarding();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = () => {
    if (currentIndex < FEATURES.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinish = async () => {
    if (isSaving) return; // Prevent double-tap

    setIsSaving(true);
    try {
      // Save onboarding data to AsyncStorage
      await saveToStorage();

      // Save analytics opt-in to analytics library (C6)
      await setAnalyticsOptIn(data.analyticsOptIn);
      logger.info('Analytics opt-in saved', { analyticsOptIn: data.analyticsOptIn });

      // Save onboarding data to Supabase
      logger.info('Saving onboarding data to Supabase', { data });
      await saveOnboardingData({
        // Medication data
        medication: data.medication || undefined,
        initial_dose: data.dosage || undefined,
        frequency: data.frequency,

        // Compliance data (C1)
        consent_version: data.consentVersion,
        consent_accepted_at: data.consentAcceptedAt || undefined,
        analytics_opt_in: data.analyticsOptIn,

        // Schedule preferences (C1)
        preferred_day: data.preferredDay !== null ? data.preferredDay : undefined,
        preferred_time: data.preferredTime || undefined,
        reminder_window_start: data.reminderWindowStart || undefined,
        reminder_window_end: data.reminderWindowEnd || undefined,
      });

      logger.info('Onboarding completed successfully');

      // Navigate to main app (tabs)
      router.replace('/(tabs)/dashboard');
    } catch (error) {
      logger.error('Failed to save onboarding data', error as Error);
      // TODO: Show error message to user
      // For now, still navigate to dashboard (graceful degradation)
      router.replace('/(tabs)/dashboard');
    } finally {
      setIsSaving(false);
    }
  };

  const isLastFeature = currentIndex === FEATURES.length - 1;
  const currentFeature = FEATURES[currentIndex];
  const FeatureIcon = currentFeature.icon;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* Feature Card */}
        <View style={styles.featureContainer}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: currentFeature.color + '15' },
            ]}
          >
            <FeatureIcon size={64} color={currentFeature.color} weight="thin" />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            {currentFeature.title}
          </Text>

          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {currentFeature.description}
          </Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.pagination}>
          {FEATURES.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    index === currentIndex ? colors.primary : colors.border,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
              onPress={() => setCurrentIndex(index)}
              accessibilityRole="button"
              accessibilityLabel={`Ir para recurso ${index + 1}`}
              accessibilityState={{ selected: index === currentIndex }}
            />
          ))}
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={isLastFeature ? handleFinish : handleNext}
          disabled={isSaving}
          accessibilityRole="button"
          accessibilityLabel={isLastFeature ? 'Começar a usar' : 'Próximo'}
          accessibilityState={{ disabled: isSaving }}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Salvando...' : isLastFeature ? 'Começar a usar' : 'Próximo'}
          </Text>
          {!isLastFeature && !isSaving && (
            <ArrowRight size={20} color="#FFFFFF" weight="bold" />
          )}
        </TouchableOpacity>

        {/* Skip Button */}
        {!isLastFeature && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleFinish}
            accessibilityRole="button"
            accessibilityLabel="Pular apresentação"
          >
            <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
              Pular
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
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
  featureContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: ShotsyDesignTokens.spacing.xxxl,
  },
  iconContainer: {
    width: 128,
    height: 128,
    borderRadius: ShotsyDesignTokens.borderRadius.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xxl,
  },
  title: {
    ...ShotsyDesignTokens.typography.h1,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  description: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  button: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
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

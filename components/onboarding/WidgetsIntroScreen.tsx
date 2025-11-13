import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import {
  AppIcon,
  DeviceMobileIcon,
  ClockIcon,
  ResultsIcon,
  CaloriesIcon,
} from '@/components/ui/icons';

interface WidgetsIntroScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function WidgetsIntroScreen({ onNext, onBack }: WidgetsIntroScreenProps) {
  const colors = useColors();

  return (
    <OnboardingScreenBase
      title="Acompanhe com widgets personalizáveis"
      subtitle="Adicione widgets à sua tela inicial para ver suas informações importantes de relance"
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.content}>
        <AppIcon name="deviceMobile" size={80} color={colors.text} />

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <ClockIcon size="xl" color={colors.text} />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Próxima aplicação</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Veja quando é sua próxima dose sem abrir o app
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <ResultsIcon size="xl" color={colors.text} />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Progresso de peso</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Acompanhe sua evolução diretamente da home screen
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <CaloriesIcon size="xl" color={colors.text} />
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Sequência de dias</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Mantenha sua motivação sempre visível
              </Text>
            </View>
          </View>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  emoji: {
    // fontSize: 80, // Removed as AppIcon handles its own size
    textAlign: 'center',
    marginBottom: 32,
  },
  feature: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  featureEmoji: {
    // fontSize: 32, // Removed as AppIcon handles its own size
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
});

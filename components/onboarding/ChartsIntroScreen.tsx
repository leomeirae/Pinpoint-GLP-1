import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface ChartsIntroScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function ChartsIntroScreen({ onNext, onBack }: ChartsIntroScreenProps) {
  const colors = useShotsyColors();

  return (
    <OnboardingScreenBase
      title="Entenda seu progresso com gráficos bonitos"
      subtitle="Visualize seus dados de forma clara e obtenha insights baseados em estudos clínicos"
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>📈</Text>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>⚖️</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Gráfico de peso
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Acompanhe sua evolução ao longo do tempo com gráficos detalhados
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>💉</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Níveis de medicamento
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Veja estimativas dos níveis do medicamento no seu corpo
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Insights personalizados
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Receba dicas e análises baseadas no seu histórico
              </Text>
            </View>
          </View>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureEmoji: {
    fontSize: 32,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
});

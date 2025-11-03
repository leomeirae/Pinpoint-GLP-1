import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface FluctuationsEducationScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function FluctuationsEducationScreen({ onNext, onBack }: FluctuationsEducationScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();

  return (
    <OnboardingScreenBase
      title="É normal ter flutuações"
      subtitle="Seu peso pode variar de um dia para o outro, e está tudo bem"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Entendi"
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>📊</Text>

        <ShotsyCard variant="elevated" style={styles.graphCard}>
          <Text style={[styles.graphTitle, { color: colors.text }]}>
            Flutuações típicas de peso
          </Text>
          <View style={styles.graphPlaceholder}>
            <View style={[styles.graphLine, { backgroundColor: currentAccent }]} />
          </View>
          <Text style={[styles.graphCaption, { color: colors.textMuted }]}>
            Variações de até 2kg são completamente normais
          </Text>
        </ShotsyCard>

        <ShotsyCard style={styles.factorsCard}>
          <Text style={[styles.factorsTitle, { color: colors.text }]}>
            Fatores que afetam o peso diário:
          </Text>
          <View style={styles.factorsList}>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>💧</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Retenção de líquidos
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🍽️</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Última refeição
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>😴</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Qualidade do sono
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🏃</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Exercícios recentes
              </Text>
            </View>
            <View style={styles.factor}>
              <Text style={styles.factorEmoji}>🧂</Text>
              <Text style={[styles.factorText, { color: colors.textSecondary }]}>
                Consumo de sódio
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard style={[styles.tipCard, { borderLeftColor: currentAccent }]}>
          <Text style={styles.tipEmoji}>💡</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Foque na tendência geral, não nos números diários. O que importa é a
            direção que você está seguindo ao longo das semanas.
          </Text>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  graphCard: {
    padding: 20,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  graphPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  graphLine: {
    width: '100%',
    height: 60,
    borderRadius: 8,
    opacity: 0.3,
  },
  graphCaption: {
    fontSize: 13,
    textAlign: 'center',
  },
  factorsCard: {
    padding: 20,
  },
  factorsTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 16,
  },
  factorsList: {
    gap: 12,
  },
  factor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  factorEmoji: {
    fontSize: 24,
  },
  factorText: {
    fontSize: 15,
    flex: 1,
  },
  tipCard: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    borderLeftWidth: 4,
  },
  tipEmoji: {
    fontSize: 24,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});

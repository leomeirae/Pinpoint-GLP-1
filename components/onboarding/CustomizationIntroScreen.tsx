import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface CustomizationIntroScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function CustomizationIntroScreen({ onNext, onBack }: CustomizationIntroScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();

  return (
    <OnboardingScreenBase
      title="Personalize tudo"
      subtitle="Deixe o app com a sua cara escolhendo temas e cores de destaque"
      onNext={onNext}
      onBack={onBack}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>🎨</Text>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🌈</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Temas personalizados
              </Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Escolha entre diversos temas: Pôr do Sol, Oceano, Floresta e muito mais
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.card}>
          <View style={styles.feature}>
            <Text style={styles.featureEmoji}>🎯</Text>
            <View style={styles.featureText}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>Cores de destaque</Text>
              <Text style={[styles.featureDescription, { color: colors.textSecondary }]}>
                Personalize a cor principal dos botões e elementos interativos
              </Text>
            </View>
          </View>
        </ShotsyCard>

        <View style={styles.colorPreview}>
          <Text style={[styles.colorPreviewLabel, { color: colors.textSecondary }]}>
            Exemplo de cor de destaque:
          </Text>
          <View style={styles.colorRow}>
            <View style={[styles.colorSwatch, { backgroundColor: currentAccent }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#3B82F6' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#10B981' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#F59E0B' }]} />
            <View style={[styles.colorSwatch, { backgroundColor: '#EF4444' }]} />
          </View>
        </View>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  colorPreview: {
    alignItems: 'center',
    marginTop: 24,
  },
  colorPreviewLabel: {
    fontSize: 14,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colorSwatch: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  content: {
    flex: 1,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
    textAlign: 'center',
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
});

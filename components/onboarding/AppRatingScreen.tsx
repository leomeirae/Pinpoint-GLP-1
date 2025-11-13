import React from 'react';
import { View, Text, StyleSheet, Linking, Platform } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AppRatingScreen');

interface AppRatingScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function AppRatingScreen({ onNext, onBack }: AppRatingScreenProps) {
  const colors = useColors();

  const handleRateNow = async () => {
    const appStoreUrl = Platform.select({
      ios: 'https://apps.apple.com/app/id1234567890', // Substituir com ID real
      android: 'https://play.google.com/store/apps/details?id=com.shotsy.app',
    });

    if (appStoreUrl) {
      try {
        await Linking.openURL(appStoreUrl);
      } catch (error) {
        logger.error('Erro ao abrir App Store:', error as Error);
      }
    }

    onNext();
  };

  return (
    <OnboardingScreenBase
      title="Está gostando do Shotsy?"
      subtitle="Sua avaliação nos ajuda a melhorar e alcançar mais pessoas"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Talvez mais tarde"
      showBackButton={false}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>⭐</Text>

        <ShotsyCard variant="elevated" style={styles.messageCard}>
          <Text style={[styles.messageTitle, { color: colors.text }]}>
            Sua opinião é muito importante!
          </Text>
          <Text style={[styles.messageText, { color: colors.textSecondary }]}>
            Se você está gostando do Shotsy, considere deixar uma avaliação na App Store. Isso nos
            ajuda tremendamente a continuar desenvolvendo e melhorando o app.
          </Text>
        </ShotsyCard>

        <View style={styles.starsContainer}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.star}>⭐</Text>
        </View>

        <ShotsyButton title="Avaliar agora" onPress={handleRateNow} variant="primary" />

        <ShotsyCard style={styles.benefitsCard}>
          <Text style={[styles.benefitsTitle, { color: colors.text }]}>Por que avaliar ajuda?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>📱</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Mais pessoas descobrem o Shotsy
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>💪</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Motivamos nossa pequena equipe
              </Text>
            </View>
            <View style={styles.benefit}>
              <Text style={styles.benefitEmoji}>✨</Text>
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                Melhoramos continuamente o app
              </Text>
            </View>
          </View>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  benefit: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  benefitEmoji: {
    fontSize: 24,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  benefitsCard: {
    marginTop: 8,
    padding: 20,
  },
  benefitsList: {
    gap: 12,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  content: {
    gap: 24,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  messageCard: {
    alignItems: 'center',
    padding: 24,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: 'center',
  },
  messageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  star: {
    fontSize: 32,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
});

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface MotivationalMessageScreenProps {
  onNext: () => void;
  onBack: () => void;
  weightToLose?: number;
  weightUnit?: 'kg' | 'lb';
}

export function MotivationalMessageScreen({
  onNext,
  onBack,
  weightToLose = 10,
  weightUnit = 'kg',
}: MotivationalMessageScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();

  const getMotivationalMessage = () => {
    if (weightToLose <= 5) {
      return 'Você está tão perto da sua meta! Cada pequeno passo conta.';
    } else if (weightToLose <= 15) {
      return 'Você tem um objetivo alcançável à sua frente. Vamos fazer isso acontecer juntos!';
    } else {
      return 'Sua jornada pode parecer longa, mas você não está sozinho. Vamos celebrar cada conquista!';
    }
  };

  return (
    <OnboardingScreenBase
      title="Você consegue!"
      subtitle="Estamos aqui para apoiar você em cada passo"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Vamos lá!"
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>💪</Text>

        <ShotsyCard variant="elevated" style={styles.messageCard}>
          <Text style={[styles.goalText, { color: colors.textSecondary }]}>Sua meta é perder</Text>
          <Text style={[styles.goalNumber, { color: currentAccent }]}>
            {weightToLose.toFixed(1)} {weightUnit}
          </Text>
        </ShotsyCard>

        <ShotsyCard style={styles.motivationCard}>
          <Text style={[styles.motivationText, { color: colors.text }]}>
            {getMotivationalMessage()}
          </Text>
        </ShotsyCard>

        <ShotsyCard style={styles.tipsCard}>
          <Text style={[styles.tipsTitle, { color: colors.text }]}>Dicas para o sucesso:</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: currentAccent }]}>✓</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Registre suas aplicações regularmente
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: currentAccent }]}>✓</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Acompanhe seu peso semanalmente
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: currentAccent }]}>✓</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Celebre cada pequena vitória
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={[styles.tipBullet, { color: currentAccent }]}>✓</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Seja paciente e consistente
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
    gap: 20,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
    marginVertical: 8,
  },
  messageCard: {
    padding: 24,
    alignItems: 'center',
  },
  goalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  goalNumber: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  motivationCard: {
    padding: 20,
  },
  motivationText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontWeight: '500',
  },
  tipsCard: {
    padding: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  tipBullet: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tipText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
});

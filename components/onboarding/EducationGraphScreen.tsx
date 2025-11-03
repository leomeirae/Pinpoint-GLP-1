import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface EducationGraphScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export function EducationGraphScreen({ onNext, onBack }: EducationGraphScreenProps) {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();

  return (
    <OnboardingScreenBase
      title="Entenda seus níveis estimados"
      subtitle="Veja como o medicamento age no seu corpo ao longo do tempo"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Entendi"
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.graphCard}>
          <View style={styles.graphPlaceholder}>
            <View style={styles.yAxis}>
              <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Alto</Text>
              <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Médio</Text>
              <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Baixo</Text>
            </View>
            <View style={styles.graphArea}>
              <View style={[styles.curve, { backgroundColor: currentAccent }]} />
              <View style={styles.xAxis}>
                <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Dia 1</Text>
                <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Dia 4</Text>
                <Text style={[styles.axisLabel, { color: colors.textMuted }]}>Dia 7</Text>
              </View>
            </View>
          </View>
        </ShotsyCard>

        <ShotsyCard style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>
            Como funciona?
          </Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Após cada aplicação, o nível do medicamento aumenta gradualmente e depois diminui ao longo dos dias. O gráfico acima mostra uma estimativa desses níveis.
          </Text>
        </ShotsyCard>

        <ShotsyCard style={[styles.warningCard, { backgroundColor: colors.card }]}>
          <Text style={styles.warningEmoji}>💡</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Essas estimativas são baseadas em dados clínicos e podem variar de pessoa para pessoa. Sempre siga as orientações do seu médico.
          </Text>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  graphCard: {
    padding: 20,
  },
  graphPlaceholder: {
    flexDirection: 'row',
    height: 200,
  },
  yAxis: {
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 4,
  },
  axisLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  graphArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  curve: {
    flex: 1,
    borderRadius: 8,
    opacity: 0.2,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  infoCard: {
    padding: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  warningCard: {
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  warningEmoji: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
});

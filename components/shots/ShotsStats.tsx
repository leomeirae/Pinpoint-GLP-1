import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface ShotsStatsProps {
  totalShots: number;
  currentDose: number;
  daysUntilNext: number;
}

export const ShotsStats: React.FC<ShotsStatsProps> = ({
  totalShots,
  currentDose,
  daysUntilNext,
}) => {
  const colors = useShotsyColors();

  return (
    <View style={styles.container}>
      <ShotsyCard style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>{totalShots}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total de Injeções</Text>
      </ShotsyCard>

      <ShotsyCard style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>{currentDose}mg</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dose Atual</Text>
      </ShotsyCard>

      <ShotsyCard style={styles.statCard}>
        <Text style={[styles.statValue, { color: colors.primary }]}>
          {daysUntilNext === 0 ? 'Hoje' : `${daysUntilNext}d`}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Próxima em</Text>
      </ShotsyCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 16,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
});

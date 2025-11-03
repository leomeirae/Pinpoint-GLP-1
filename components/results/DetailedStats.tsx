import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface StatItemProps {
  label: string;
  value: string;
  subtitle?: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value, subtitle }) => {
  const colors = useShotsyColors();

  return (
    <View style={[styles.statItem, { borderBottomColor: `${colors.border}33` }]}>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

interface DetailedStatsProps {
  avgWeeklyLoss: number;
  maxWeeklyLoss: number;
  maxWeeklyLossDate: Date;
  minWeeklyLoss: number;
  minWeeklyLossDate: Date;
  weeksInTreatment: number;
  totalShots: number;
  currentDose: number;
  nextTitration: string;
}

export const DetailedStats: React.FC<DetailedStatsProps> = ({
  avgWeeklyLoss,
  maxWeeklyLoss,
  maxWeeklyLossDate,
  minWeeklyLoss,
  minWeeklyLossDate,
  weeksInTreatment,
  totalShots,
  currentDose,
  nextTitration,
}) => {
  const colors = useShotsyColors();

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(date);
  };

  return (
    <ShotsyCard style={styles.card}>
      <Text style={[styles.title, { color: colors.text }]}>Estatísticas Detalhadas</Text>

      <View style={styles.grid}>
        <StatItem
          label="Média de Perda Semanal"
          value={`-${avgWeeklyLoss.toFixed(1)} kg/sem`}
        />
        <StatItem
          label="Maior Perda Semanal"
          value={`-${maxWeeklyLoss.toFixed(1)} kg`}
          subtitle={formatDate(maxWeeklyLossDate)}
        />
        <StatItem
          label="Menor Perda Semanal"
          value={`-${minWeeklyLoss.toFixed(1)} kg`}
          subtitle={formatDate(minWeeklyLossDate)}
        />
        <StatItem
          label="Semanas no Tratamento"
          value={`${weeksInTreatment} semanas`}
        />
        <StatItem
          label="Total de Injeções"
          value={`${totalShots} injeções`}
        />
        <StatItem
          label="Dose Atual"
          value={`${currentDose} mg`}
        />
      </View>

      <View style={[styles.nextTitration, { backgroundColor: colors.background }]}>
        <Text style={[styles.nextTitrationLabel, { color: colors.textSecondary }]}>
          Próxima Titulação
        </Text>
        <Text style={[styles.nextTitrationValue, { color: colors.primary }]}>
          {nextTitration}
        </Text>
      </View>
    </ShotsyCard>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  grid: {
    gap: 16,
  },
  statItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    // borderBottomColor will be applied inline using colors.border with opacity
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  statSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  nextTitration: {
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
  },
  nextTitrationLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  nextTitrationValue: {
    fontSize: 16,
    fontWeight: '700',
  },
});

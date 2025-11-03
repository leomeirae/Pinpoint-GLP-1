import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { router } from 'expo-router';
import { ArrowRightIcon } from '@/components/ui/icons';

export interface Metrics {
  totalChange: number;
  currentBMI: number;
  currentWeight: number;
  percentProgress: number;
  weeklyAverage: number;
  toGoal: number;
}

interface ResultsPreviewProps {
  metrics: Metrics;
}

export function ResultsPreview({ metrics }: ResultsPreviewProps) {
  const colors = useShotsyColors();

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return 'Abaixo do peso';
    if (bmi < 25) return 'Normal';
    if (bmi < 30) return 'Sobrepeso';
    return 'Obesidade';
  };

  const handleViewResults = () => {
    router.push('/(tabs)/results');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Resultados</Text>
        <TouchableOpacity onPress={handleViewResults} style={styles.linkButton}>
          <Text style={[styles.link, { color: colors.primary }]}>Ver gráfico</Text>
          <ArrowRightIcon size="sm" color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Metrics Grid */}
      <View style={styles.grid}>
        {/* Row 1 */}
        <View style={styles.row}>
          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              MUDANÇA TOTAL
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {metrics.totalChange >= 0 ? '+' : ''}{metrics.totalChange.toFixed(1)} kg
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {Math.abs((metrics.totalChange / (metrics.currentWeight - metrics.totalChange)) * 100).toFixed(1)}%
            </Text>
          </ShotsyCard>

          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              IMC ATUAL
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {metrics.currentBMI.toFixed(1)}
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {getBMICategory(metrics.currentBMI)}
            </Text>
          </ShotsyCard>

          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              PESO ATUAL
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {metrics.currentWeight.toFixed(1)} kg
            </Text>
          </ShotsyCard>
        </View>

        {/* Row 2 */}
        <View style={styles.row}>
          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              PROGRESSO
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {Math.max(0, metrics.percentProgress).toFixed(0)}%
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              até a meta
            </Text>
          </ShotsyCard>

          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              MÉDIA SEMANAL
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {metrics.weeklyAverage > 0 ? '-' : ''}{Math.abs(metrics.weeklyAverage).toFixed(1)} kg
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              por semana
            </Text>
          </ShotsyCard>

          <ShotsyCard style={styles.card}>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              PARA A META
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {Math.max(0, metrics.toGoal).toFixed(1)} kg
            </Text>
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              restantes
            </Text>
          </ShotsyCard>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  grid: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 12,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 11,
    textAlign: 'center',
  },
});
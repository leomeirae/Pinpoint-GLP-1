import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import { router } from 'expo-router';

interface ShotHistoryData {
  totalShots: number;
  lastDose: number | null;
  estimatedLevel: number | null;
}

interface ShotHistoryCardsProps {
  data: ShotHistoryData;
}

export function ShotHistoryCards({ data }: ShotHistoryCardsProps) {
  const colors = useShotsyColors();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Histórico de Injeções</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/shots')}>
          <Text style={[styles.link, { color: colors.primary }]}>Ver tudo ›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cards}>
        <ShotsyCard style={styles.card}>
          <Text style={[styles.cardIcon, { color: colors.textSecondary }]}>💉</Text>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Injeções tomadas</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>{data.totalShots}</Text>
        </ShotsyCard>

        <ShotsyCard style={styles.card}>
          <Text style={[styles.cardIcon, { color: colors.textSecondary }]}>💊</Text>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Última dose</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>
            {data.lastDose ? `${data.lastDose}mg` : '--'}
          </Text>
        </ShotsyCard>

        <ShotsyCard style={styles.card}>
          <Text style={[styles.cardIcon, { color: colors.textSecondary }]}>📈</Text>
          <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>Nível Est.</Text>
          <Text style={[styles.cardValue, { color: colors.text }]}>
            {data.estimatedLevel ? `${data.estimatedLevel}mg` : '--'}
          </Text>
        </ShotsyCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    flex: 1,
    padding: 12,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 11,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  cards: {
    flexDirection: 'row',
    gap: 12,
  },
  container: {
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});

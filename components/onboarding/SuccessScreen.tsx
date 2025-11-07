import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { Ionicons } from '@expo/vector-icons';

interface SuccessScreenProps {
  onNext: () => void;
}

export function SuccessScreen({ onNext }: SuccessScreenProps) {
  const colors = useColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resumo</Text>
        <TouchableOpacity>
          <Text style={[styles.addButton, { color: colors.primary }]}>+ Injeção</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Histórico de Injeções</Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>💉</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Injeções tomadas</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>0</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>💊</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Última dose</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textMuted }]}>—</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: colors.background }]}>
            <View style={styles.statHeader}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Nível Est.</Text>
            </View>
            <Text style={[styles.statValue, { color: colors.textMuted }]}>—</Text>
          </View>
        </View>

        {/* Success Modal */}
        <View style={[styles.successModal, { backgroundColor: colors.background }]}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🎉</Text>
          </View>

          <Text style={[styles.successTitle, { color: colors.text }]}>Você consegue!</Text>

          <Text style={[styles.successText, { color: colors.textSecondary }]}>
            Parabéns por assumir o controle da sua saúde com medicamentos GLP-1! O Pinpoint GLP-1 foi projetado para
            facilitar o entendimento e o acompanhamento do seu progresso semanal.
          </Text>

          <Text style={[styles.successSubtext, { color: colors.text }]}>
            Adicione sua primeira injeção para começar.
          </Text>

          <ShotsyButton title="Entendi!" onPress={onNext} style={styles.button} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={[styles.bottomNav, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📋</Text>
          <Text style={[styles.navLabel, { color: colors.primary }]}>Resumo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💉</Text>
          <Text style={[styles.navLabel, { color: colors.textMuted }]}>Injeções</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📊</Text>
          <Text style={[styles.navLabel, { color: colors.textMuted }]}>Resultados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>📅</Text>
          <Text style={[styles.navLabel, { color: colors.textMuted }]}>Calendário</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={[styles.navLabel, { color: colors.textMuted }]}>Ajustes</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  addButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statIcon: {
    fontSize: 16,
  },
  statLabel: {
    fontSize: 12,
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  successModal: {
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 72,
  },
  successTitle: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
  },
  successSubtext: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    marginTop: 0,
  },
  bottomNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navIcon: {
    fontSize: 24,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
});


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
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Injeções tomadas
              </Text>
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
            Parabéns por assumir o controle da sua saúde com medicamentos GLP-1! O Pinpoint GLP-1
            foi projetado para facilitar o entendimento e o acompanhamento do seu progresso semanal.
          </Text>

          <Text style={[styles.successSubtext, { color: colors.text }]}>
            Adicione sua primeira injeção para começar.
          </Text>

          <ShotsyButton title="Entendi!" onPress={onNext} style={styles.button} />
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View
        style={[
          styles.bottomNav,
          { backgroundColor: colors.background, borderTopColor: colors.border },
        ]}
      >
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
  addButton: {
    fontSize: 18,
    fontWeight: '600',
  },
  bottomNav: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  button: {
    marginTop: 0,
  },
  container: {
    flex: 1,
  },
  emoji: {
    fontSize: 72,
  },
  emojiContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  navIcon: {
    fontSize: 24,
  },
  navItem: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 16,
    flex: 1,
    padding: 16,
  },
  statHeader: {
    alignItems: 'center',
    flexDirection: 'row',
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
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  successModal: {
    borderRadius: 24,
    elevation: 4,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  successSubtext: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 32,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 32,
    textAlign: 'center',
  },
  successTitle: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
});

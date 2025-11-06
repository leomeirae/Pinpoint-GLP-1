import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useShotsyColors';
import { useApplications } from '@/hooks/useApplications';

// Map injection site IDs to display names
const INJECTION_SITE_NAMES: Record<string, string> = {
  'stomach_upper_left': 'Estômago - Sup. Esquerdo',
  'stomach_upper_middle': 'Estômago - Sup. Meio',
  'stomach_lower_left': 'Estômago - Inf. Esquerdo',
  'stomach_lower_middle': 'Estômago - Inf. Meio',
  'stomach_upper_right': 'Estômago - Sup. Direito',
  'stomach_lower_right': 'Estômago - Inf. Direito',
  'thigh_left': 'Coxa Esquerda',
  'thigh_right': 'Coxa Direita',
  'arm_left': 'Braço Esquerdo',
  'arm_right': 'Braço Direito',
  'buttock_left': 'Glúteo Esquerdo',
  'buttock_right': 'Glúteo Direito',
  'hip_left': 'Quadril Esquerdo',
  'hip_right': 'Quadril Direito',
  'unknown': 'Desconhecido',
};

export function InjectionSitesPage() {
  const colors = useColors();
  const { applications } = useApplications();

  // Get all injection sites from applications history
  const injectionSites = useMemo(() => {
    const sites: string[] = [];
    
    // Collect all injection sites from all applications
    applications.forEach((app) => {
      if (app.injection_sites && app.injection_sites.length > 0) {
        sites.push(...app.injection_sites);
      }
    });

    // Map site IDs to display names and return unique list
    return sites.map((siteId) => INJECTION_SITE_NAMES[siteId] || siteId);
  }, [applications]);

  return (
    <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
      {/* Header - V0 Design */}
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
          <Text style={[styles.backButtonText, { color: colors.primary }]}>Fechar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={[styles.editButton, { color: colors.primary }]}>Editar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Title - V0 Design */}
        <Text style={[styles.title, { color: colors.text }]}>Locais de Injeção</Text>

        {/* Active Rotation Section - V0 Design */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>ROTAÇÃO ATIVA</Text>
          <View style={[styles.sitesList, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {injectionSites.length > 0 ? (
              injectionSites.map((site, index) => (
                <View
                  key={index}
                  style={[
                    styles.siteItem,
                    index < injectionSites.length - 1 && { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.siteName, { color: colors.text }]}>{site}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  Nenhum local de injeção registrado ainda
                </Text>
                <Text style={[styles.emptySubtext, { color: colors.textMuted }]}>
                  Adicione injeções para ver os locais aqui
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  sitesList: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  siteItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  siteName: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});


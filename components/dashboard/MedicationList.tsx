import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useColors } from '@/constants/colors';
import { Medication } from '@/lib/types';
import { useRouter } from 'expo-router';

interface MedicationListProps {
  medications: Medication[];
  onEdit?: (medication: Medication) => void;
  onDelete?: (medicationId: string) => void;
}

const MEDICATION_NAMES: Record<string, string> = {
  mounjaro: 'Mounjaro',
  ozempic: 'Ozempic',
  saxenda: 'Saxenda',
  wegovy: 'Wegovy',
  zepbound: 'Zepbound',
};

export function MedicationList({ medications, onEdit, onDelete }: MedicationListProps) {
  const colors = useColors();
  const router = useRouter();

  const handleDelete = (medication: Medication) => {
    Alert.alert(
      'Excluir Medicação',
      `Tem certeza que deseja excluir ${MEDICATION_NAMES[medication.type] || medication.type}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDelete?.(medication.id),
        },
      ]
    );
  };

  if (medications.length === 0) {
    const styles = getStyles(colors);

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💊</Text>
        <Text style={styles.emptyText}>Nenhuma medicação cadastrada</Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => router.push('/(tabs)/add-medication')}
        >
          <Text style={styles.emptyButtonText}>Clique para cadastrar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicações Ativas</Text>
      <FlatList
        data={medications.filter((m) => m.active)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>
                  {MEDICATION_NAMES[item.type] || item.type}
                </Text>
                <Text style={styles.medicationDosage}>{item.dosage}mg</Text>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => onEdit?.(item)} style={styles.actionButton}>
                  <Text style={styles.actionIcon}>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={styles.actionButton}>
                  <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.medicationFrequency}>
              Frequência: {item.frequency === 'weekly' ? 'Semanal' : 'Diária'}
            </Text>
            <Text style={styles.medicationStart}>
              Início: {new Date(item.start_date).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    actionButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      marginLeft: 8,
      padding: 8,
    },
    actionIcon: {
      fontSize: 18,
    },
    actions: {
      flexDirection: 'row',
      // gap: 8, // Not supported in React Native StyleSheet
    },
    container: {
      marginBottom: 16,
    },
    emptyButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingHorizontal: 24,
      paddingVertical: 12,
    },
    emptyButtonText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    emptyContainer: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      padding: 32,
    },
    emptyIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    emptyText: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 16,
    },
    medicationCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 12,
      padding: 16,
    },
    medicationDosage: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    medicationFrequency: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 4,
    },
    medicationHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    medicationInfo: {
      alignItems: 'center',
      flexDirection: 'row',
      // gap: 12, // Not supported in React Native StyleSheet
    },
    medicationName: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginRight: 12,
    },
    medicationStart: {
      color: colors.textMuted,
      fontSize: 12,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
  });

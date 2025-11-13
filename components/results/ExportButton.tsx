import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert, Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShareIcon, FileTextIcon, TableIcon } from '@/components/ui/icons';
import { useTheme } from '@/lib/theme-context';
import { createLogger } from '@/lib/logger';

const logger = createLogger('ExportButton');

interface WeightDataPoint {
  date: Date;
  weight: number;
}

interface ApplicationDataPoint {
  date: Date;
  dosage: number;
  location: string;
}

interface ExportButtonProps {
  weights: WeightDataPoint[];
  applications: ApplicationDataPoint[];
  profile: {
    height?: number;
    target_weight?: number;
    start_weight?: number;
    current_dose?: number;
  };
}

export const ExportButton: React.FC<ExportButtonProps> = ({ weights, applications, profile }) => {
  const colors = useShotsyColors();
  const { currentAccent } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [exporting, setExporting] = useState(false);

  const generateCSV = () => {
    // Create CSV header
    let csv = 'Data,Peso (kg),IMC,Dose (mg),Local da Aplicação\n';

    // Sort weights by date
    const sortedWeights = [...weights].sort((a, b) => a.date.getTime() - b.date.getTime());

    // Create a map of applications by date
    const applicationsByDate = new Map<string, ApplicationDataPoint>();
    applications.forEach((app) => {
      const dateKey = app.date.toISOString().split('T')[0];
      applicationsByDate.set(dateKey, app);
    });

    // Add data rows
    sortedWeights.forEach((weight) => {
      const dateKey = weight.date.toISOString().split('T')[0];
      const dateFormatted = new Intl.DateTimeFormat('pt-BR').format(weight.date);
      const bmi =
        profile.height && profile.height > 0
          ? (weight.weight / (profile.height * profile.height)).toFixed(1)
          : '';

      const app = applicationsByDate.get(dateKey);
      const dosage = app ? app.dosage.toString() : '';
      const location = app ? app.location : '';

      csv += `${dateFormatted},${weight.weight},${bmi},${dosage},${location}\n`;
    });

    return csv;
  };

  const generatePDFReport = () => {
    const currentWeight = weights.length > 0 ? weights[0].weight : 0;
    const startWeight =
      profile.start_weight || (weights.length > 0 ? weights[weights.length - 1].weight : 0);
    const targetWeight = profile.target_weight || 75;
    const weightChange = currentWeight - startWeight;
    const progressPercent =
      startWeight > 0 ? ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100 : 0;

    const currentBMI =
      profile.height && currentWeight > 0
        ? (currentWeight / (profile.height * profile.height)).toFixed(1)
        : 'N/A';

    const weeks =
      weights.length >= 2
        ? Math.ceil(
            Math.abs(weights[0].date.getTime() - weights[weights.length - 1].date.getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          )
        : 0;

    const avgWeeklyLoss = weeks > 0 ? Math.abs(weightChange) / weeks : 0;

    // Generate text report
    let report = `========================================\n`;
    report += `    RELATÓRIO DE PROGRESSO\n`;
    report += `    Pinpoint GLP-1\n`;
    report += `========================================\n\n`;
    report += `Data do Relatório: ${new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date())}\n\n`;

    report += `RESUMO DO TRATAMENTO\n`;
    report += `----------------------------------------\n`;
    report += `Peso Inicial: ${startWeight.toFixed(1)} kg\n`;
    report += `Peso Atual: ${currentWeight.toFixed(1)} kg\n`;
    report += `Peso Meta: ${targetWeight.toFixed(1)} kg\n`;
    report += `Mudança Total: ${weightChange.toFixed(1)} kg\n`;
    report += `Progresso: ${Math.max(0, progressPercent).toFixed(1)}%\n`;
    report += `IMC Atual: ${currentBMI}\n`;
    report += `Dose Atual: ${profile.current_dose || 'N/A'} mg\n\n`;

    report += `ESTATÍSTICAS\n`;
    report += `----------------------------------------\n`;
    report += `Semanas em Tratamento: ${weeks}\n`;
    report += `Total de Injeções: ${applications.length}\n`;
    report += `Média Semanal: ${avgWeeklyLoss > 0 ? '-' : ''}${avgWeeklyLoss.toFixed(1)} kg/semana\n`;
    report += `Para a Meta: ${Math.max(0, currentWeight - targetWeight).toFixed(1)} kg\n\n`;

    report += `HISTÓRICO DE PESO (Últimos 10 registros)\n`;
    report += `----------------------------------------\n`;
    const recentWeights = weights.slice(0, 10);
    recentWeights.forEach((w) => {
      const dateFormatted = new Intl.DateTimeFormat('pt-BR').format(w.date);
      report += `${dateFormatted}: ${w.weight.toFixed(1)} kg\n`;
    });

    report += `\n========================================\n`;
    report += `Gerado pelo Pinpoint GLP-1\n`;
    report += `========================================\n`;

    return report;
  };

  const exportCSV = async () => {
    try {
      setExporting(true);
      const csv = generateCSV();
      const fileName = `mounjaro_data_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Exportar Dados CSV',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Exportação Concluída', `Arquivo salvo em: ${fileUri}`, [{ text: 'OK' }]);
      }
    } catch (error) {
      logger.error('Error exporting CSV:', error as Error);
      Alert.alert('Erro', 'Não foi possível exportar os dados. Tente novamente.');
    } finally {
      setExporting(false);
      setModalVisible(false);
    }
  };

  const exportPDF = async () => {
    try {
      setExporting(true);
      const report = generatePDFReport();
      const fileName = `mounjaro_report_${new Date().toISOString().split('T')[0]}.txt`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, report, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/plain',
          dialogTitle: 'Exportar Relatório',
        });
      } else {
        Alert.alert('Exportação Concluída', `Relatório salvo em: ${fileUri}`, [{ text: 'OK' }]);
      }
    } catch (error) {
      logger.error('Error exporting report:', error as Error);
      Alert.alert('Erro', 'Não foi possível gerar o relatório. Tente novamente.');
    } finally {
      setExporting(false);
      setModalVisible(false);
    }
  };

  if (weights.length === 0) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={[styles.exportButton, { backgroundColor: currentAccent }]}
        onPress={() => setModalVisible(true)}
        disabled={exporting}
      >
        <ShareIcon size="sm" color={colors.isDark ? colors.text : '#FFFFFF'} />
        <Text style={[styles.exportButtonText, { color: colors.isDark ? colors.text : '#FFFFFF' }]}>
          Exportar
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Exportar Dados</Text>
            <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
              Escolha o formato de exportação
            </Text>

            <TouchableOpacity
              style={[styles.optionButton, { borderColor: colors.border }]}
              onPress={exportCSV}
              disabled={exporting}
            >
              <TableIcon size="lg" color={colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Exportar CSV</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Dados tabulados para análise em planilhas
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, { borderColor: colors.border }]}
              onPress={exportPDF}
              disabled={exporting}
            >
              <FileTextIcon size="lg" color={colors.primary} />
              <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>Exportar Relatório</Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  Relatório completo do seu progresso
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.background }]}
              onPress={() => setModalVisible(false)}
              disabled={exporting}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    borderRadius: 12,
    marginTop: 8,
    padding: 14,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  exportButton: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  exportButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalContent: {
    borderRadius: 20,
    elevation: 8,
    maxWidth: 400,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    width: '100%',
  },
  modalOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  optionButton: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
    padding: 16,
  },
  optionDescription: {
    fontSize: 13,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
});

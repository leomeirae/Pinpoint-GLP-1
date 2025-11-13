import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Pills, ArrowLeft, Check } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';

// Remote config structure - hardcoded for now, ready for remote config
interface MedicationOption {
  id: string;
  name: string;
  genericName: string;
  doses: number[];
}

const MEDICATIONS: MedicationOption[] = [
  {
    id: 'mounjaro',
    name: 'Mounjaro',
    genericName: 'tirzepatida',
    doses: [2.5, 5, 7.5, 10, 12.5, 15],
  },
  {
    id: 'ozempic',
    name: 'Ozempic',
    genericName: 'semaglutida',
    doses: [0.25, 0.5, 1, 2],
  },
  {
    id: 'wegovy',
    name: 'Wegovy',
    genericName: 'semaglutida',
    doses: [0.25, 0.5, 1, 1.7, 2.4],
  },
  {
    id: 'retatrutida',
    name: 'Retatrutida',
    genericName: 'retatrutida',
    doses: [0.5, 1, 2, 4, 8, 12],
  },
  {
    id: 'saxenda',
    name: 'Saxenda',
    genericName: 'liraglutida',
    doses: [0.6, 1.2, 1.8, 2.4, 3],
  },
];

export default function MedicationDoseScreen() {
  const colors = useColors();
  const { updateData, markStepCompleted } = useOnboardingContext();

  const [step, setStep] = useState<'medication' | 'dose'>('medication');
  const [selectedMedication, setSelectedMedication] = useState<MedicationOption | null>(null);
  const [selectedDose, setSelectedDose] = useState<number | null>(null);

  const handleBack = () => {
    if (step === 'dose' && selectedMedication) {
      // Go back to medication selection
      setStep('medication');
      setSelectedDose(null);
    } else {
      // Go back to previous screen
      router.back();
    }
  };

  const handleMedicationSelect = (medication: MedicationOption) => {
    setSelectedMedication(medication);
    setSelectedDose(null); // Reset dose when changing medication
    setStep('dose');
  };

  const handleDoseSelect = (dose: number) => {
    setSelectedDose(dose);
  };

  const handleContinue = () => {
    if (!selectedMedication || selectedDose === null) {
      return; // Cannot proceed without both selections
    }

    markStepCompleted('medication-dose');
    updateData({
      currentStep: 3,
      medication: selectedMedication.name,
      dosage: selectedDose,
      frequency: 'weekly', // Only weekly for GLP-1
    });
    router.push('/(onboarding)/schedule');
  };

  const canContinue = selectedMedication !== null && selectedDose !== null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={step === 'dose' ? 'Voltar para seleção de medicamento' : 'Voltar'}
        >
          <ArrowLeft size={24} color={colors.text} weight="regular" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Pills size={48} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {step === 'medication' ? 'Qual medicamento você usa?' : 'Qual é a sua dose?'}
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === 'medication'
            ? 'Selecione o medicamento prescrito pelo seu médico'
            : `Selecione a dose de ${selectedMedication?.name}`}
        </Text>

        {/* Step 1: Medication Selection */}
        {step === 'medication' && (
          <View style={styles.gridContainer}>
            {MEDICATIONS.map((medication) => (
              <TouchableOpacity
                key={medication.id}
                style={[
                  styles.medicationCard,
                  {
                    backgroundColor: colors.card,
                    borderColor:
                      selectedMedication?.id === medication.id
                        ? colors.primary
                        : 'transparent',
                  },
                ]}
                onPress={() => handleMedicationSelect(medication)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${medication.name}`}
                accessibilityState={{ selected: selectedMedication?.id === medication.id }}
              >
                <View style={styles.medicationContent}>
                  <Text style={[styles.medicationName, { color: colors.text }]}>
                    {medication.name}
                  </Text>
                  <Text style={[styles.medicationGeneric, { color: colors.textSecondary }]}>
                    {medication.genericName}
                  </Text>
                </View>
                {selectedMedication?.id === medication.id && (
                  <View
                    style={[styles.checkIcon, { backgroundColor: colors.primary }]}
                    accessibilityLabel="Selecionado"
                  >
                    <Check size={16} color="#FFFFFF" weight="bold" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Dose Selection */}
        {step === 'dose' && selectedMedication && (
          <View style={styles.doseContainer}>
            <View style={styles.doseGrid}>
              {selectedMedication.doses.map((dose) => (
                <TouchableOpacity
                  key={dose}
                  style={[
                    styles.doseCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: selectedDose === dose ? colors.primary : colors.border,
                      borderWidth: selectedDose === dose ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleDoseSelect(dose)}
                  accessibilityRole="button"
                  accessibilityLabel={`Selecionar dose de ${dose} mg`}
                  accessibilityState={{ selected: selectedDose === dose }}
                >
                  <Text
                    style={[
                      styles.doseValue,
                      { color: selectedDose === dose ? colors.primary : colors.text },
                    ]}
                  >
                    {dose}
                  </Text>
                  <Text style={[styles.doseUnit, { color: colors.textSecondary }]}>mg</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Frequency info */}
            <View style={[styles.frequencyCard, { backgroundColor: colors.card }]}>
              <Text style={[styles.frequencyLabel, { color: colors.textSecondary }]}>
                Frequência
              </Text>
              <Text style={[styles.frequencyValue, { color: colors.text }]}>
                Semanal
              </Text>
              <Text style={[styles.frequencyNote, { color: colors.textMuted }]}>
                Medicamentos GLP-1 são aplicados semanalmente
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>3 de 5</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: canContinue ? colors.primary : colors.border,
            },
          ]}
          onPress={handleContinue}
          disabled={!canContinue}
          accessibilityRole="button"
          accessibilityLabel="Continuar"
          accessibilityState={{ disabled: !canContinue }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: canContinue ? '#FFFFFF' : colors.textMuted },
            ]}
          >
            Continuar
          </Text>
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
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
    paddingBottom: ShotsyDesignTokens.spacing.sm,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    lineHeight: 22,
  },
  gridContainer: {
    gap: ShotsyDesignTokens.spacing.md,
  },
  medicationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: ShotsyDesignTokens.spacing.lg,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    borderWidth: 2,
    ...ShotsyDesignTokens.shadows.card,
  },
  medicationContent: {
    flex: 1,
  },
  medicationName: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicationGeneric: {
    ...ShotsyDesignTokens.typography.caption,
  },
  checkIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doseContainer: {
    gap: ShotsyDesignTokens.spacing.lg,
  },
  doseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.md,
    justifyContent: 'center',
  },
  doseCard: {
    width: 100,
    height: 100,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  doseValue: {
    ...ShotsyDesignTokens.typography.h2,
    fontWeight: '700',
    marginBottom: 4,
  },
  doseUnit: {
    ...ShotsyDesignTokens.typography.caption,
    fontWeight: '600',
  },
  frequencyCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  frequencyLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: 4,
  },
  frequencyValue: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  frequencyNote: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingTop: ShotsyDesignTokens.spacing.md,
  },
  progressContainer: {
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  progressDots: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
  },
  progressText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  button: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  buttonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
});

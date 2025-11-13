import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Pill, ArrowLeft, Check } from 'phosphor-react-native';
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
          <Pill size={48} color={colors.primary} weight="thin" />
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
                      selectedMedication?.id === medication.id ? colors.primary : 'transparent',
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
              <Text style={[styles.frequencyValue, { color: colors.text }]}>Semanal</Text>
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
          <Text style={[styles.buttonText, { color: canContinue ? '#FFFFFF' : colors.textMuted }]}>
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  button: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    height: 56,
    justifyContent: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  buttonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  checkIcon: {
    alignItems: 'center',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  container: {
    flex: 1,
  },
  doseCard: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    height: 100,
    justifyContent: 'center',
    width: 100,
    ...ShotsyDesignTokens.shadows.card,
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
  doseUnit: {
    ...ShotsyDesignTokens.typography.caption,
    fontWeight: '600',
  },
  doseValue: {
    ...ShotsyDesignTokens.typography.h2,
    fontWeight: '700',
    marginBottom: 4,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotActive: {
    width: 24,
  },
  footer: {
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingTop: ShotsyDesignTokens.spacing.md,
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
  frequencyNote: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
  },
  frequencyValue: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  gridContainer: {
    gap: ShotsyDesignTokens.spacing.md,
  },
  header: {
    paddingBottom: ShotsyDesignTokens.spacing.sm,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.xl,
    height: 96,
    justifyContent: 'center',
    marginBottom: ShotsyDesignTokens.spacing.lg,
    width: 96,
  },
  medicationCard: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    borderWidth: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  medicationContent: {
    flex: 1,
  },
  medicationGeneric: {
    ...ShotsyDesignTokens.typography.caption,
  },
  medicationName: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: 4,
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
  progressText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  scrollContent: {
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    textAlign: 'center',
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Clock, ArrowLeft } from 'phosphor-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useOnboardingContext } from '@/hooks/OnboardingContext';

const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda', short: 'Seg' },
  { id: 2, name: 'Terça', short: 'Ter' },
  { id: 3, name: 'Quarta', short: 'Qua' },
  { id: 4, name: 'Quinta', short: 'Qui' },
  { id: 5, name: 'Sexta', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
];

export default function ScheduleScreen() {
  const colors = useColors();
  const { updateData, markStepCompleted } = useOnboardingContext();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleDaySelect = (dayId: number) => {
    setSelectedDay(dayId);
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedTime(date);
    }
  };

  const handleTimePress = () => {
    setShowTimePicker(true);
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleContinue = () => {
    if (selectedDay === null || !selectedTime) {
      return; // Cannot proceed without both selections
    }

    markStepCompleted('schedule');
    updateData({
      currentStep: 4,
      preferredDay: selectedDay,
      preferredTime: formatTime(selectedTime),
    });
    router.push('/(onboarding)/permissions');
  };

  const canContinue = selectedDay !== null && selectedTime !== null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
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
          <Clock size={48} color={colors.primary} weight="thin" />
        </View>

        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>Quando você prefere aplicar?</Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Escolha o dia da semana e horário de sua preferência para receber lembretes
        </Text>

        {/* Day Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Dia da semana</Text>
          <View style={styles.daysGrid}>
            {DAYS_OF_WEEK.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayCard,
                  {
                    backgroundColor: selectedDay === day.id ? colors.primary : colors.card,
                    borderColor: selectedDay === day.id ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleDaySelect(day.id)}
                accessibilityRole="button"
                accessibilityLabel={`Selecionar ${day.name}`}
                accessibilityState={{ selected: selectedDay === day.id }}
              >
                <Text
                  style={[
                    styles.dayShort,
                    { color: selectedDay === day.id ? '#FFFFFF' : colors.text },
                  ]}
                >
                  {day.short}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Horário preferido
          </Text>
          <TouchableOpacity
            style={[
              styles.timeButton,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={handleTimePress}
            accessibilityRole="button"
            accessibilityLabel={
              selectedTime
                ? `Horário selecionado: ${formatTime(selectedTime)}`
                : 'Selecionar horário'
            }
          >
            <Clock size={24} color={colors.textSecondary} weight="thin" />
            <Text
              style={[styles.timeText, { color: selectedTime ? colors.text : colors.textMuted }]}
            >
              {selectedTime ? formatTime(selectedTime) : 'Selecionar horário'}
            </Text>
          </TouchableOpacity>

          {/* Time Picker */}
          {showTimePicker && (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              is24Hour={true}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleTimeChange}
              textColor={colors.text}
            />
          )}

          {/* iOS: Done button */}
          {showTimePicker && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={[styles.doneButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowTimePicker(false)}
              accessibilityRole="button"
              accessibilityLabel="Confirmar horário"
            >
              <Text style={styles.doneButtonText}>Confirmar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Info card */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Você poderá ajustar seu horário preferido a qualquer momento nas configurações
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressDots}>
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            <View style={[styles.dot, { backgroundColor: colors.border }]} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>4 de 5</Text>
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
  container: {
    flex: 1,
  },
  dayCard: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    borderWidth: 1,
    flex: 1,
    height: 56,
    justifyContent: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  dayShort: {
    ...ShotsyDesignTokens.typography.label,
    fontSize: 13,
    fontWeight: '600',
  },
  daysGrid: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.xs,
    justifyContent: 'space-between',
  },
  doneButton: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    height: 48,
    justifyContent: 'center',
    marginTop: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  doneButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
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
  infoCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  infoText: {
    ...ShotsyDesignTokens.typography.caption,
    lineHeight: 18,
    textAlign: 'center',
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
  section: {
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  sectionLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.xxl,
    textAlign: 'center',
  },
  timeButton: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.md,
    height: 64,
    justifyContent: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  timeText: {
    ...ShotsyDesignTokens.typography.label,
    fontSize: 18,
    fontWeight: '600',
  },
  title: {
    ...ShotsyDesignTokens.typography.h2,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
});

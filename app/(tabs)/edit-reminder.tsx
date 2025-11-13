import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Clock } from 'phosphor-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import {
  scheduleWeeklyMedicationReminder,
  updateWeeklyMedicationReminder,
  getScheduledMedicationReminder,
} from '@/lib/notifications';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/clerk-expo';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';

const logger = createLogger('EditReminderScreen');

const DAYS_OF_WEEK = [
  { id: 0, name: 'Domingo', short: 'Dom' },
  { id: 1, name: 'Segunda', short: 'Seg' },
  { id: 2, name: 'Terça', short: 'Ter' },
  { id: 3, name: 'Quarta', short: 'Qua' },
  { id: 4, name: 'Quinta', short: 'Qui' },
  { id: 5, name: 'Sexta', short: 'Sex' },
  { id: 6, name: 'Sábado', short: 'Sáb' },
];

export default function EditReminderScreen() {
  const colors = useColors();
  const { userId } = useAuth();

  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCurrentSettings();
  }, []);

  const loadCurrentSettings = async () => {
    try {
      if (!userId) {
        logger.warn('No user ID available');
        setIsLoading(false);
        return;
      }

      // Load from Supabase
      const { data: userData } = await supabase
        .from('users')
        .select('preferred_day, preferred_time')
        .eq('clerk_id', userId)
        .maybeSingle();

      if (userData) {
        if (userData.preferred_day !== null) {
          setSelectedDay(userData.preferred_day);
        }
        if (userData.preferred_time) {
          // Convert HH:mm to Date object
          const [hours, minutes] = userData.preferred_time.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          setSelectedTime(date);
        }
      }

      logger.info('Loaded current reminder settings', {
        day: userData?.preferred_day,
        time: userData?.preferred_time,
      });
    } catch (error) {
      logger.error('Error loading reminder settings', error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleDaySelect = (dayId: number) => {
    setSelectedDay(dayId);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleTimeChange = (event: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
    }
    if (event.type === 'set' && date) {
      setSelectedTime(date);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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

  const handleSave = async () => {
    if (selectedDay === null || !selectedTime) {
      Alert.alert('Campos obrigatórios', 'Selecione o dia e horário para o lembrete');
      return;
    }

    setIsSaving(true);
    try {
      const timeString = formatTime(selectedTime);

      // Update notification
      const identifier = await updateWeeklyMedicationReminder(selectedDay, timeString);

      if (!identifier) {
        throw new Error('Failed to schedule notification');
      }

      // Update Supabase
      if (userId) {
        const { data: userData } = await supabase
          .from('users')
          .select('id')
          .eq('clerk_id', userId)
          .maybeSingle();

        if (userData) {
          await supabase
            .from('users')
            .update({
              preferred_day: selectedDay,
              preferred_time: timeString,
            })
            .eq('id', userData.id);
        }
      }

      logger.info('Reminder updated successfully', {
        day: selectedDay,
        time: timeString,
        identifier,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Salvo!', 'Lembrete atualizado com sucesso', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      logger.error('Error saving reminder', error as Error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Erro', 'Não foi possível salvar o lembrete');
    } finally {
      setIsSaving(false);
    }
  };

  const getNextReminderPreview = (): string => {
    if (selectedDay === null || !selectedTime) {
      return 'Selecione dia e horário';
    }

    const dayName = DAYS_OF_WEEK.find((d) => d.id === selectedDay)?.name || '';
    const timeString = formatTime(selectedTime);

    return `Próximo lembrete: ${dayName} às ${timeString}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Editar Lembrete</Text>
        <View style={styles.headerSpacer} />
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
        <Text style={[styles.title, { color: colors.text }]}>
          Quando você prefere aplicar?
        </Text>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Escolha o dia da semana e horário de sua preferência
        </Text>

        {/* Day Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Dia da semana
          </Text>
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
            style={[styles.timeButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={handleTimePress}
            accessibilityRole="button"
            accessibilityLabel={selectedTime ? `Horário selecionado: ${formatTime(selectedTime)}` : 'Selecionar horário'}
          >
            <Clock size={24} color={colors.textSecondary} weight="thin" />
            <Text style={[styles.timeText, { color: selectedTime ? colors.text : colors.textMuted }]}>
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

        {/* Preview */}
        <View style={[styles.previewCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>
            {getNextReminderPreview()}
          </Text>
        </View>

        {/* Info Note */}
        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.infoText, { color: colors.textMuted }]}>
            Você receberá um lembrete toda semana no horário escolhido
          </Text>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.button,
            {
              backgroundColor: selectedDay !== null && selectedTime ? colors.primary : colors.border,
            },
          ]}
          onPress={handleSave}
          disabled={isSaving || selectedDay === null || !selectedTime}
          accessibilityRole="button"
          accessibilityLabel="Salvar lembrete"
          accessibilityState={{ disabled: isSaving || selectedDay === null || !selectedTime }}
        >
          <Text
            style={[
              styles.buttonText,
              { color: selectedDay !== null && selectedTime ? '#FFFFFF' : colors.textMuted },
            ]}
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: ShotsyDesignTokens.spacing.lg,
    paddingBottom: ShotsyDesignTokens.spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 44,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...ShotsyDesignTokens.typography.body,
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
  section: {
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  sectionLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginBottom: ShotsyDesignTokens.spacing.md,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ShotsyDesignTokens.spacing.xs,
  },
  dayCard: {
    flex: 1,
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    ...ShotsyDesignTokens.shadows.card,
  },
  dayShort: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    fontSize: 13,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ShotsyDesignTokens.spacing.md,
    height: 64,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    borderWidth: 1,
    ...ShotsyDesignTokens.shadows.card,
  },
  timeText: {
    ...ShotsyDesignTokens.typography.label,
    fontSize: 18,
    fontWeight: '600',
  },
  doneButton: {
    marginTop: ShotsyDesignTokens.spacing.md,
    height: 48,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  doneButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  previewCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  previewText: {
    ...ShotsyDesignTokens.typography.body,
    textAlign: 'center',
    fontWeight: '600',
  },
  infoCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  infoText: {
    ...ShotsyDesignTokens.typography.caption,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: ShotsyDesignTokens.spacing.xl,
    paddingBottom: ShotsyDesignTokens.spacing.xxl,
    paddingTop: ShotsyDesignTokens.spacing.md,
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

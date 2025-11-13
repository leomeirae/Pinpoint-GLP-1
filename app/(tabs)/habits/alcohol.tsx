import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Martini, Check, Calendar } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useAlcoholLogs } from '@/hooks/useAlcoholLogs';
import { createLogger } from '@/lib/logger';
import * as Haptics from 'expo-haptics';
import { FadeInView } from '@/components/animations';

const logger = createLogger('AlcoholScreen');

export default function AlcoholScreen() {
  const colors = useColors();
  const { logs, loading, toggleAlcoholForDate } = useAlcoholLogs();

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find((log) => log.date === today);

  const [consumed, setConsumed] = useState(todayLog?.consumed || false);
  const [drinksCount, setDrinksCount] = useState(
    todayLog?.drinks_count ? String(todayLog.drinks_count) : ''
  );
  const [notes, setNotes] = useState(todayLog?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleToggleConsumed = async (value: boolean) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConsumed(value);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const drinksCountNum = drinksCount ? parseInt(drinksCount) : undefined;

      await toggleAlcoholForDate(today, consumed, drinksCountNum, notes);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      logger.info('Alcohol log saved', { date: today, consumed });

      Alert.alert('Salvo!', 'Registro de álcool atualizado com sucesso');
    } catch (error) {
      logger.error('Failed to save alcohol log', error as Error);
      Alert.alert('Erro', 'Não foi possível salvar o registro. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  };

  // Get last 30 days for calendar view
  const getLast30Days = (): string[] => {
    const days: string[] = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date.toISOString().split('T')[0]);
    }
    return days.reverse();
  };

  const last30Days = getLast30Days();

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowLeft size={24} color={colors.text} weight="regular" />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Álcool</Text>
          <View style={styles.headerSpacer} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Carregando...
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} weight="regular" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Álcool</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Log */}
        <FadeInView duration={800} delay={100}>
          <View style={[styles.todayCard, { backgroundColor: colors.card }]}>
            <View style={styles.todayHeader}>
              <Martini size={32} color={colors.accentRed || '#ef4444'} weight="regular" />
              <Text style={[styles.todayTitle, { color: colors.text }]}>Hoje</Text>
            </View>

            {/* Toggle */}
            <View style={styles.toggleRow}>
              <Text style={[styles.toggleLabel, { color: colors.text }]}>
                Consumi álcool hoje?
              </Text>
              <Switch
                value={consumed}
                onValueChange={handleToggleConsumed}
                trackColor={{
                  false: colors.border,
                  true: colors.accentRed || '#ef4444',
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Conditional inputs */}
            {consumed && (
              <>
                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    Quantidade de doses (opcional)
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={drinksCount}
                    onChangeText={setDrinksCount}
                    placeholder="Ex: 2"
                    placeholderTextColor={colors.textMuted}
                    keyboardType="number-pad"
                  />
                </View>

                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: colors.text }]}>
                    Observações (opcional)
                  </Text>
                  <TextInput
                    style={[
                      styles.textArea,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                        borderColor: colors.border,
                      },
                    ]}
                    value={notes}
                    onChangeText={setNotes}
                    placeholder="Adicione observações"
                    placeholderTextColor={colors.textMuted}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </>
            )}

            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colors.primary, opacity: isSaving ? 0.6 : 1 },
              ]}
              onPress={handleSave}
              disabled={isSaving}
            >
              <Check size={20} color="#FFFFFF" weight="bold" />
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Calendar View */}
        <FadeInView duration={800} delay={200}>
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <Calendar size={24} color={colors.text} weight="regular" />
              <Text style={[styles.calendarTitle, { color: colors.text }]}>
                Últimos 30 dias
              </Text>
            </View>

            <View style={styles.calendarGrid}>
              {last30Days.map((date, index) => {
                const log = logs.find((l) => l.date === date);
                const hasAlcohol = log?.consumed || false;
                const isToday = date === today;

                return (
                  <View
                    key={date}
                    style={[
                      styles.calendarDay,
                      {
                        backgroundColor: hasAlcohol
                          ? (colors.accentRed || '#ef4444') + '30'
                          : colors.card,
                        borderColor: isToday ? colors.primary : 'transparent',
                        borderWidth: isToday ? 2 : 0,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        {
                          color: hasAlcohol
                            ? colors.accentRed || '#ef4444'
                            : colors.textMuted,
                          fontWeight: hasAlcohol ? '700' : '400',
                        },
                      ]}
                    >
                      {formatDate(date)}
                    </Text>
                    {hasAlcohol && (
                      <Martini
                        size={12}
                        color={colors.accentRed || '#ef4444'}
                        weight="fill"
                      />
                    )}
                  </View>
                );
              })}
            </View>

            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View
                  style={[
                    styles.legendDot,
                    { backgroundColor: (colors.accentRed || '#ef4444') + '30' },
                  ]}
                />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  Consumo de álcool
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: colors.card }]} />
                <Text style={[styles.legendText, { color: colors.textSecondary }]}>
                  Sem consumo
                </Text>
              </View>
            </View>
          </View>
        </FadeInView>

        {/* Privacy Note */}
        <FadeInView duration={800} delay={300}>
          <View style={[styles.noteCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.noteTitle, { color: colors.text }]}>Nota de privacidade</Text>
            <Text style={[styles.noteText, { color: colors.textSecondary }]}>
              Seus dados de consumo de álcool são privados e armazenados de forma segura. Essas
              informações podem ajudar você e seu médico a entender melhor o tratamento.
            </Text>
          </View>
        </FadeInView>

        <View style={styles.bottomSpacer} />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingTop: 60,
    paddingBottom: ShotsyDesignTokens.spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: ShotsyDesignTokens.spacing.sm,
    marginLeft: -ShotsyDesignTokens.spacing.sm,
  },
  headerTitle: {
    ...ShotsyDesignTokens.typography.h3,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: ShotsyDesignTokens.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...ShotsyDesignTokens.typography.body,
  },
  todayCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.xl,
    ...ShotsyDesignTokens.shadows.card,
  },
  todayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.md,
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  todayTitle: {
    ...ShotsyDesignTokens.typography.h2,
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: ShotsyDesignTokens.spacing.lg,
  },
  toggleLabel: {
    ...ShotsyDesignTokens.typography.body,
    fontWeight: '500',
  },
  field: {
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  fieldLabel: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  input: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.body,
  },
  textArea: {
    minHeight: 80,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    borderWidth: 1,
    padding: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.typography.body,
  },
  saveButton: {
    height: 56,
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: ShotsyDesignTokens.spacing.md,
    ...ShotsyDesignTokens.shadows.card,
  },
  saveButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  calendarSection: {
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  calendarTitle: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ShotsyDesignTokens.spacing.sm,
    marginBottom: ShotsyDesignTokens.spacing.md,
  },
  calendarDay: {
    width: 48,
    height: 48,
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...ShotsyDesignTokens.shadows.card,
  },
  calendarDayText: {
    ...ShotsyDesignTokens.typography.caption,
    fontSize: 10,
  },
  legend: {
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.lg,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ShotsyDesignTokens.spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    ...ShotsyDesignTokens.typography.caption,
  },
  noteCard: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    padding: ShotsyDesignTokens.spacing.lg,
    marginBottom: ShotsyDesignTokens.spacing.lg,
    ...ShotsyDesignTokens.shadows.card,
  },
  noteTitle: {
    ...ShotsyDesignTokens.typography.h4,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.sm,
  },
  noteText: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
  },
  bottomSpacer: {
    height: ShotsyDesignTokens.spacing.xxl * 2,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { ShotsyCard } from '@/components/ui/shotsy-card';

interface StartingWeightScreenProps {
  onNext: (data: { startingWeight: number; startDate: string }) => void;
  onBack: () => void;
  weightUnit?: 'kg' | 'lb';
}

export function StartingWeightScreen({ onNext, onBack, weightUnit = 'kg' }: StartingWeightScreenProps) {
  const colors = useShotsyColors();
  const [weight, setWeight] = useState('');
  const [dateDay, setDateDay] = useState(new Date().getDate().toString());
  const [dateMonth, setDateMonth] = useState((new Date().getMonth() + 1).toString());
  const [dateYear, setDateYear] = useState(new Date().getFullYear().toString());

  const handleNext = () => {
    if (weight && dateDay && dateMonth && dateYear) {
      const weightNum = parseFloat(weight);
      const day = parseInt(dateDay);
      const month = parseInt(dateMonth);
      const year = parseInt(dateYear);

      if (!isNaN(weightNum) && weightNum > 0 && day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 2000) {
        const date = new Date(year, month - 1, day);
        onNext({
          startingWeight: weightNum,
          startDate: date.toISOString().split('T')[0],
        });
      }
    }
  };

  const isValid = weight && !isNaN(parseFloat(weight)) && parseFloat(weight) > 0 &&
    dateDay && dateMonth && dateYear;

  return (
    <OnboardingScreenBase
      title="Qual era seu peso quando começou (ou vai começar) o GLP-1?"
      subtitle="Isso nos ajuda a calcular seu progresso total"
      onNext={handleNext}
      onBack={onBack}
      disableNext={!isValid}
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.inputCard}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Peso inicial
          </Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { color: colors.text, borderColor: colors.border }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="decimal-pad"
              placeholder={weightUnit === 'kg' ? '85.0' : '187.0'}
              placeholderTextColor={colors.textMuted}
            />
            <Text style={[styles.inputSuffix, { color: colors.textSecondary }]}>
              {weightUnit}
            </Text>
          </View>
        </ShotsyCard>

        <ShotsyCard variant="elevated" style={styles.dateCard}>
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Data de início
          </Text>
          <View style={styles.dateInputRow}>
            <View style={styles.dateInputGroup}>
              <TextInput
                style={[styles.dateInput, { color: colors.text, borderColor: colors.border }]}
                value={dateDay}
                onChangeText={setDateDay}
                keyboardType="number-pad"
                placeholder="DD"
                placeholderTextColor={colors.textMuted}
                maxLength={2}
              />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Dia</Text>
            </View>
            <Text style={[styles.dateSeparator, { color: colors.textSecondary }]}>/</Text>
            <View style={styles.dateInputGroup}>
              <TextInput
                style={[styles.dateInput, { color: colors.text, borderColor: colors.border }]}
                value={dateMonth}
                onChangeText={setDateMonth}
                keyboardType="number-pad"
                placeholder="MM"
                placeholderTextColor={colors.textMuted}
                maxLength={2}
              />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Mês</Text>
            </View>
            <Text style={[styles.dateSeparator, { color: colors.textSecondary }]}>/</Text>
            <View style={styles.dateInputGroup}>
              <TextInput
                style={[styles.dateInput, { color: colors.text, borderColor: colors.border }]}
                value={dateYear}
                onChangeText={setDateYear}
                keyboardType="number-pad"
                placeholder="AAAA"
                placeholderTextColor={colors.textMuted}
                maxLength={4}
              />
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>Ano</Text>
            </View>
          </View>
        </ShotsyCard>

        <Text style={styles.emoji}>📅</Text>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  inputCard: {
    padding: 20,
  },
  dateCard: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 32,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputSuffix: {
    fontSize: 20,
    fontWeight: '500',
  },
  dateInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInputGroup: {
    flex: 1,
    alignItems: 'center',
  },
  dateInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  dateLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  dateSeparator: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { Ionicons } from '@expo/vector-icons';

interface AlreadyUsingGLP1ScreenProps {
  onNext: (data: { alreadyUsing: boolean }) => void;
  onBack: () => void;
}

export function AlreadyUsingGLP1Screen({ onNext, onBack }: AlreadyUsingGLP1ScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (selected !== null) {
      onNext({ alreadyUsing: selected === 'Já estou tomando GLP-1' });
    }
  };

  return (
    <OnboardingScreenBase
      title="Você já está tomando algum medicamento com GLP-1?"
      subtitle="Vamos personalizar o app de acordo com a sua etapa na jornada com GLP-1."
      onNext={handleNext}
      onBack={onBack}
      disableNext={selected === null}
    >
      {/* Logo Section - V0 Design */}
      <View style={styles.logoSection}>
        <View style={[styles.logoContainer, { backgroundColor: colors.primary }]}>
          <View style={styles.logoDots}>
            <View style={[styles.dot, { backgroundColor: colors.background }]} />
            <View style={[styles.dot, { backgroundColor: colors.background }]} />
            <View style={[styles.dot, { backgroundColor: colors.background }]} />
            <View style={[styles.dot, { backgroundColor: colors.background }]} />
            <View
              style={[styles.dot, styles.dotInactive, { backgroundColor: colors.background }]}
            />
          </View>
        </View>
        <Text style={[styles.logoText, { color: colors.primary }]}>PINPOINT GLP-1</Text>
      </View>

      {/* Radio Options - V0 Design */}
      <View style={styles.content}>
        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor: selected === 'Já estou tomando GLP-1' ? colors.primary : 'transparent',
              borderWidth: selected === 'Já estou tomando GLP-1' ? 2 : 0,
            },
          ]}
          onPress={() => setSelected('Já estou tomando GLP-1')}
        >
          <View style={styles.radioContainer}>
            <View
              style={[
                styles.radio,
                {
                  borderColor:
                    selected === 'Já estou tomando GLP-1' ? colors.primary : colors.border,
                },
              ]}
            >
              {selected === 'Já estou tomando GLP-1' && (
                <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.optionLabel, { color: colors.text }]}>Já estou tomando GLP-1</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            {
              backgroundColor: colors.backgroundSecondary,
              borderColor:
                selected === 'Eu ainda não comecei a usar GLP-1' ? colors.primary : 'transparent',
              borderWidth: selected === 'Eu ainda não comecei a usar GLP-1' ? 2 : 0,
            },
          ]}
          onPress={() => setSelected('Eu ainda não comecei a usar GLP-1')}
        >
          <View style={styles.radioContainer}>
            <View
              style={[
                styles.radio,
                {
                  borderColor:
                    selected === 'Eu ainda não comecei a usar GLP-1'
                      ? colors.primary
                      : colors.border,
                },
              ]}
            >
              {selected === 'Eu ainda não comecei a usar GLP-1' && (
                <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
              )}
            </View>
            <Text style={[styles.optionLabel, { color: colors.text }]}>
              Eu ainda não comecei a usar GLP-1
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    paddingHorizontal: 24,
  },
  dot: {
    borderRadius: 4,
    height: 8,
    width: 8,
  },
  dotInactive: {
    opacity: 0.5,
  },
  logoContainer: {
    alignItems: 'center',
    borderRadius: 16,
    height: 64,
    justifyContent: 'center',
    width: 64,
  },
  logoDots: {
    flexDirection: 'row',
    gap: 4,
  },
  logoSection: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 30,
    fontWeight: '700',
  },
  option: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    minHeight: 60,
    padding: 20,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  radio: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  radioContainer: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  radioInner: {
    borderRadius: 6,
    height: 12,
    width: 12,
  },
});

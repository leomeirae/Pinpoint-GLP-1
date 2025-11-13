import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { OnboardingScreenBase } from './OnboardingScreenBase';
import { useColors } from '@/hooks/useShotsyColors';
import { useTheme } from '@/lib/theme-context';
import { ShotsyCard } from '@/components/ui/shotsy-card';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop } from 'react-native-svg';

interface EducationGraphScreenProps {
  onNext: () => void;
  onBack: () => void;
}

// Dados farmacocinéticos realistas para Mounjaro/GLP-1
// Baseado em estudos clínicos (simplificados para visualização educacional)
const pharmacokineticData = [
  { day: 0, level: 0 },
  { day: 1, level: 0.3 },
  { day: 2, level: 0.7 },
  { day: 3, level: 1.1 },
  { day: 4, level: 1.2 }, // Pico (Tmax ~96h)
  { day: 5, level: 0.9 },
  { day: 6, level: 0.6 },
  { day: 7, level: 0.3 }, // Antes da próxima dose
];

export function EducationGraphScreen({ onNext, onBack }: EducationGraphScreenProps) {
  const colors = useColors();
  const { currentAccent } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = Math.min(screenWidth - 64 - 50, 280); // Max width with padding

  return (
    <OnboardingScreenBase
      title="Entenda seus níveis estimados"
      subtitle="Veja como o medicamento age no seu corpo ao longo do tempo"
      onNext={onNext}
      onBack={onBack}
      nextButtonText="Entendi"
    >
      <View style={styles.content}>
        <ShotsyCard variant="elevated" style={styles.graphCard}>
          <View style={styles.chartContainer}>
            {/* Y-axis labels */}
            <View style={styles.yAxisLabels}>
              <Text style={[styles.yAxisLabel, { color: colors.textMuted }]}>1.5mg</Text>
              <Text style={[styles.yAxisLabel, { color: colors.textMuted }]}>1.0mg</Text>
              <Text style={[styles.yAxisLabel, { color: colors.textMuted }]}>0.5mg</Text>
              <Text style={[styles.yAxisLabel, { color: colors.textMuted }]}>0mg</Text>
            </View>

            {/* Chart area */}
            <View style={styles.chartArea}>
              <Svg
                width={chartWidth}
                height={220}
                viewBox="0 0 280 200"
                preserveAspectRatio="xMidYMid meet"
              >
                <Defs>
                  <LinearGradient id="pharmaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={currentAccent} stopOpacity="0.3" />
                    <Stop offset="100%" stopColor={currentAccent} stopOpacity="0.1" />
                  </LinearGradient>
                </Defs>

                {/* Grid lines - horizontal */}
                <Line
                  x1="0"
                  y1="50"
                  x2="280"
                  y2="50"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="0"
                  y1="100"
                  x2="280"
                  y2="100"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="0"
                  y1="150"
                  x2="280"
                  y2="150"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Grid lines - vertical */}
                <Line
                  x1="40"
                  y1="0"
                  x2="40"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="80"
                  y1="0"
                  x2="80"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="120"
                  y1="0"
                  x2="120"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="160"
                  y1="0"
                  x2="160"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="200"
                  y1="0"
                  x2="200"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
                <Line
                  x1="240"
                  y1="0"
                  x2="240"
                  y2="200"
                  stroke={colors.border}
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />

                {/* Filled area path - curva farmacológica */}
                <Path
                  d="M 0,200 L 40,170 L 80,130 L 120,90 L 160,80 L 200,90 L 240,140 L 280,170 L 280,200 Z"
                  fill="url(#pharmaGradient)"
                />

                {/* Solid line - curva farmacológica */}
                <Path
                  d="M 0,200 L 40,170 L 80,130 L 120,90 L 160,80 L 200,90 L 240,140 L 280,170"
                  fill="none"
                  stroke={currentAccent}
                  strokeWidth="3"
                />

                {/* Ponto do pico (Tmax) - dia 4 */}
                <Circle
                  cx="160"
                  cy="80"
                  r="6"
                  fill={currentAccent}
                  stroke={colors.background}
                  strokeWidth="2"
                />
              </Svg>

              {/* X-axis labels */}
              <View style={styles.xAxisLabels}>
                <Text style={[styles.xAxisLabel, { color: colors.textMuted }]}>0</Text>
                <Text style={[styles.xAxisLabel, { color: colors.textMuted }]}>2</Text>
                <Text style={[styles.xAxisLabel, { color: colors.textMuted }]}>4</Text>
                <Text style={[styles.xAxisLabel, { color: colors.textMuted }]}>6</Text>
                <Text style={[styles.xAxisLabel, { color: colors.textMuted }]}>7</Text>
              </View>
            </View>
          </View>

          {/* Label do pico */}
          <Text style={[styles.peakLabel, { color: currentAccent }]}>← Pico: 1.2mg (dia 4)</Text>
        </ShotsyCard>

        <ShotsyCard style={styles.infoCard}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Como funciona?</Text>
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            Após cada aplicação, o nível do medicamento aumenta gradualmente e depois diminui ao
            longo dos dias. O gráfico acima mostra uma estimativa desses níveis.
          </Text>
        </ShotsyCard>

        <ShotsyCard style={[styles.warningCard, { backgroundColor: colors.card }]}>
          <Text style={styles.warningEmoji}>💡</Text>
          <Text style={[styles.warningText, { color: colors.textSecondary }]}>
            Essas estimativas são baseadas em dados clínicos e podem variar de pessoa para pessoa.
            Sempre siga as orientações do seu médico.
          </Text>
        </ShotsyCard>
      </View>
    </OnboardingScreenBase>
  );
}

const styles = StyleSheet.create({
  chartArea: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  chartContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    minHeight: 220,
    width: '100%',
  },
  content: {
    gap: 16,
    paddingHorizontal: 24,
  },
  graphCard: {
    overflow: 'hidden',
    padding: 20,
  },
  infoCard: {
    padding: 20, // Mudança: 16 → 20px (match Shotsy)
  },
  infoText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  peakLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginRight: 20,
    marginTop: 8,
    textAlign: 'right',
  },
  warningCard: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  warningEmoji: {
    fontSize: 24,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  xAxisLabel: {
    fontSize: 10,
  },
  xAxisLabels: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    left: 0,
    paddingHorizontal: 0,
    position: 'absolute',
    right: 0,
  },
  yAxisLabel: {
    fontSize: 10,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingBottom: 20,
    paddingRight: 8,
    width: 50,
  },
});

/**
 * ShotsyCircularProgressV2 - Progress Ring com Gradiente (Shotsy-style)
 *
 * Características Shotsy:
 * - Gradiente colorido (laranja → amarelo → verde → azul → ciano)
 * - Animações suaves com react-native-reanimated
 * - Múltiplos tamanhos (small, medium, large, custom)
 * - Estados visuais (normal, success, warning, error)
 * - Shadow effect
 * - Texto central customizável
 * - Fundo com opacidade
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { getProgressRingGradient } from '@/lib/dosageColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useColors } from '@/hooks/useShotsyColors';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Tamanhos pré-definidos
export type ProgressSize = 'small' | 'medium' | 'large' | 'xlarge';

interface SizeConfig {
  diameter: number;
  strokeWidth: number;
  fontSize: number;
  labelFontSize: number;
}

const SIZES: Record<ProgressSize, SizeConfig> = {
  small: {
    diameter: 120,
    strokeWidth: 8,
    fontSize: 24,
    labelFontSize: 11,
  },
  medium: {
    diameter: 180,
    strokeWidth: 12,
    fontSize: 32,
    labelFontSize: 13,
  },
  large: {
    diameter: 240,
    strokeWidth: 16,
    fontSize: 40,
    labelFontSize: 14,
  },
  xlarge: {
    diameter: 280,
    strokeWidth: 18,
    fontSize: 48,
    labelFontSize: 15,
  },
};

// Estados visuais
export type ProgressState = 'normal' | 'success' | 'warning' | 'error';

interface StateColors {
  gradient: string[];
  textColor: string;
}

interface ShotsyCircularProgressV2Props {
  /** Progresso de 0 a 1 */
  progress: number;
  /** Tamanho do componente */
  size?: ProgressSize;
  /** Tamanho customizado (sobrescreve size) */
  customSize?: number;
  /** Largura customizada do stroke */
  customStrokeWidth?: number;
  /** Estado visual */
  state?: ProgressState;
  /** Texto central (ex: "75%") */
  centerText?: string;
  /** Label abaixo do texto central */
  centerLabel?: string;
  /** Cores customizadas do gradiente */
  customGradient?: string[];
  /** Mostrar sombra */
  showShadow?: boolean;
  /** Duração da animação em ms */
  animationDuration?: number;
  /** Conteúdo customizado no centro */
  children?: React.ReactNode;
  /** Estilo adicional do container */
  style?: ViewStyle;
}

export const ShotsyCircularProgressV2: React.FC<ShotsyCircularProgressV2Props> = ({
  progress,
  size = 'medium',
  customSize,
  customStrokeWidth,
  state = 'normal',
  centerText,
  centerLabel,
  customGradient,
  showShadow = true,
  animationDuration = 1000,
  children,
  style,
}) => {
  const colors = useColors();

  // Configuração de tamanho
  const sizeConfig = SIZES[size];
  const diameter = customSize || sizeConfig.diameter;
  const strokeWidth = customStrokeWidth || sizeConfig.strokeWidth;
  const radius = (diameter - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Cores baseadas no estado
  const getStateColors = (): StateColors => {
    const baseGradient = customGradient || getProgressRingGradient();

    switch (state) {
      case 'success':
        return {
          gradient: [colors.success, colors.success, '#22C55E'],
          textColor: colors.success,
        };
      case 'warning':
        return {
          gradient: [colors.warning, '#FBBF24', '#F59E0B'],
          textColor: colors.warning,
        };
      case 'error':
        return {
          gradient: [colors.error, '#EF4444', '#DC2626'],
          textColor: colors.error,
        };
      default:
        return {
          gradient: baseGradient,
          textColor: colors.primary,
        };
    }
  };

  const stateColors = getStateColors();

  // Animação do progresso
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    animatedProgress.value = withTiming(progress, {
      duration: animationDuration,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [progress, animationDuration]);

  // Props animadas para o círculo de progresso
  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference - animatedProgress.value * circumference;
    return {
      strokeDashoffset,
    };
  });

  return (
    <View
      style={[
        styles.container,
        { width: diameter, height: diameter },
        showShadow && ShotsyDesignTokens.shadows.elevated,
        style,
      ]}
    >
      <Svg width={diameter} height={diameter}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {stateColors.gradient.map((color, index) => (
              <Stop
                key={index}
                offset={`${(index / (stateColors.gradient.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </LinearGradient>
        </Defs>

        {/* Background circle (track) */}
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke={colors.isDark ? '#2A2A2A' : '#E5E7EB'}
          strokeWidth={strokeWidth}
          fill="none"
          opacity={0.3}
        />

        {/* Progress circle */}
        <AnimatedCircle
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${diameter / 2} ${diameter / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>

      {/* Center content */}
      <View style={styles.centerContent}>
        {children ? (
          children
        ) : (
          <>
            {centerText && (
              <Text
                style={[
                  styles.centerText,
                  {
                    fontSize: customSize ? customSize * 0.2 : sizeConfig.fontSize,
                    color: stateColors.textColor,
                  },
                ]}
              >
                {centerText}
              </Text>
            )}
            {centerLabel && (
              <Text
                style={[
                  styles.centerLabel,
                  {
                    fontSize: customSize ? customSize * 0.08 : sizeConfig.labelFontSize,
                    color: colors.textSecondary,
                  },
                ]}
              >
                {centerLabel}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

// Componente auxiliar para texto de porcentagem
export const ProgressPercentage: React.FC<{ value: number }> = ({ value }) => {
  const colors = useColors();
  return (
    <View style={styles.percentageContainer}>
      <Text style={[styles.percentageValue, { color: colors.text }]}>
        {Math.round(value * 100)}
      </Text>
      <Text style={[styles.percentageSymbol, { color: colors.textSecondary }]}>%</Text>
    </View>
  );
};

// Componente auxiliar para valor com label
interface ProgressValueProps {
  value: string;
  label: string;
  valueColor?: string;
}

export const ProgressValue: React.FC<ProgressValueProps> = ({ value, label, valueColor }) => {
  const colors = useColors();
  return (
    <View style={styles.valueContainer}>
      <Text style={[styles.value, { color: valueColor || colors.text }]}>{value}</Text>
      <Text style={[styles.valueLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    fontWeight: '700',
    textAlign: 'center',
  },
  centerLabel: {
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.8,
  },
  // ProgressPercentage styles
  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  percentageValue: {
    ...ShotsyDesignTokens.typography.numberLarge,
  },
  percentageSymbol: {
    ...ShotsyDesignTokens.typography.h4,
    marginLeft: 2,
  },
  // ProgressValue styles
  valueContainer: {
    alignItems: 'center',
  },
  value: {
    ...ShotsyDesignTokens.typography.numberLarge,
  },
  valueLabel: {
    ...ShotsyDesignTokens.typography.caption,
    marginTop: 4,
  },
});

export default ShotsyCircularProgressV2;

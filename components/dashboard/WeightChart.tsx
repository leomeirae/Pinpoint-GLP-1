import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/constants/colors';
import { WeightLog } from '@/lib/types';
import { ResultsIcon, WeightIcon, ArrowRightIcon } from '@/components/ui/icons';

interface WeightChartProps {
  data: WeightLog[];
  goalWeight?: number | null;
  initialWeight?: number | null;
}

export function WeightChart({
  data,
  goalWeight,
  initialWeight: userInitialWeight,
}: WeightChartProps) {
  const colors = useColors();

  if (data.length === 0) {
    const styles = getStyles(colors);

    return (
      <View style={styles.emptyContainer}>
        <ResultsIcon size="md" color={colors.text} />
        <Text style={styles.emptyText}>Nenhum registro de peso ainda</Text>
        <Text style={styles.emptySubtext}>Comece registrando seu peso hoje!</Text>
      </View>
    );
  }

  // Calcular estatísticas
  const currentWeight = data[0]?.weight || 0;
  const initialWeight = userInitialWeight || data[data.length - 1]?.weight || currentWeight;
  const calculatedGoalWeight = goalWeight || initialWeight - 10; // Usar meta do usuário ou fallback para -10kg
  const totalLost = initialWeight - currentWeight;
  const progressPercentage = Math.min(
    Math.max(((initialWeight - currentWeight) / (initialWeight - calculatedGoalWeight)) * 100, 0),
    100
  );

  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      {/* Progress Card */}
      <View style={styles.progressCard}>
        <View style={styles.titleContainer}>
          <WeightIcon size="md" color={colors.text} />
          <Text style={styles.title}>Peso e Meta</Text>
        </View>

        <View style={styles.weightFlow}>
          <View style={styles.weightPoint}>
            <Text style={styles.weightLabel}>Inicial</Text>
            <Text style={styles.weightValue}>{initialWeight}kg</Text>
          </View>

          <View style={styles.arrow}>
            <ArrowRightIcon size="md" color={colors.primary} />
          </View>

          <View style={styles.weightPoint}>
            <Text style={styles.weightLabel}>Atual</Text>
            <Text style={[styles.weightValue, styles.currentWeight]}>{currentWeight}kg</Text>
          </View>

          <View style={styles.arrow}>
            <ArrowRightIcon size="md" color={colors.primary} />
          </View>

          <View style={styles.weightPoint}>
            <Text style={styles.weightLabel}>Meta</Text>
            <Text style={styles.weightValue}>{calculatedGoalWeight.toFixed(1)}kg</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progressPercentage}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {totalLost > 0 ? `${totalLost.toFixed(1)}kg perdidos` : 'Continue firme!'}
          {totalLost > 0 && ` · ${progressPercentage.toFixed(0)}% da meta`}
        </Text>
      </View>
    </View>
  );
}

const getStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      // gap: 16, // Not supported in React Native StyleSheet
    },
    emptyContainer: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 16,
      marginBottom: 16,
      padding: 32,
    },
    emptyText: {
      color: colors.text,
      fontSize: 16,
      marginBottom: 8,
    },
    emptySubtext: {
      color: colors.textMuted,
      fontSize: 14,
    },

    // Progress Card
    progressCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 20,
    },
    titleContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: 8,
      marginBottom: 16,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: 'bold',
    },
    weightFlow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    weightPoint: {
      alignItems: 'center',
      flex: 1,
    },
    weightLabel: {
      color: colors.textMuted,
      fontSize: 12,
      marginBottom: 4,
    },
    weightValue: {
      color: colors.text,
      fontSize: 20,
      fontWeight: 'bold',
    },
    currentWeight: {
      color: colors.primary,
      fontSize: 24,
    },
    arrow: {
      marginHorizontal: 8,
    },
    arrowText: {
      // fontSize: 20, // Removed as AppIcon handles its own size
      color: colors.primary,
    },
    progressBarContainer: {
      backgroundColor: colors.background,
      borderRadius: 4,
      height: 8,
      marginBottom: 8,
      overflow: 'hidden',
    },
    progressBar: {
      backgroundColor: colors.primary,
      borderRadius: 4,
      height: '100%',
    },
    progressText: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
    },
  });

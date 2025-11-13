/**
 * ShotsyCircularProgressV2 - Exemplos de Uso
 *
 * Este arquivo contém exemplos práticos de como usar o componente
 * ShotsyCircularProgressV2 em diferentes contextos.
 *
 * Para usar, copie o exemplo desejado para seu componente.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  ShotsyCircularProgressV2,
  ProgressPercentage,
  ProgressValue,
} from './ShotsyCircularProgressV2';
import { Heart, Fire, TrendUp } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';

// ============================================
// EXEMPLO 1: Dashboard - Adherence Rate
// ============================================
export function AdherenceProgressExample() {
  const adherenceRate = 0.92; // 92% de aderência

  return (
    <View style={styles.exampleContainer}>
      <Text style={styles.exampleTitle}>Weekly Adherence</Text>
      <ShotsyCircularProgressV2
        progress={adherenceRate}
        size="large"
        state={adherenceRate >= 0.8 ? 'success' : 'warning'}
        centerText={`${Math.round(adherenceRate * 100)}%`}
        centerLabel="On Track"
      />
    </View>
  );
}

// ============================================
// EXEMPLO 2: Weight Loss Progress
// ============================================
export function WeightLossProgressExample() {
  const currentWeight = 85;
  const initialWeight = 95;
  const targetWeight = 75;
  const lostWeight = initialWeight - currentWeight;
  const progress = lostWeight / (initialWeight - targetWeight);

  return (
    <ShotsyCircularProgressV2
      progress={Math.min(progress, 1)} // Limita a 100%
      size="xlarge"
      state={progress >= 1 ? 'success' : 'normal'}
    >
      <ProgressValue value={`${lostWeight.toFixed(1)}kg`} label="Lost" valueColor="#10B981" />
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 3: Month Shots Progress
// ============================================
export function MonthShotsProgressExample() {
  const shotsCompleted = 3;
  const totalShots = 4;
  const progress = shotsCompleted / totalShots;

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="medium"
      state={progress >= 1 ? 'success' : 'normal'}
    >
      <ProgressValue value={`${shotsCompleted}/${totalShots}`} label="Shots this month" />
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 4: Daily Water Intake
// ============================================
export function WaterIntakeExample() {
  const glassesConsumed = 6;
  const dailyGoal = 8;
  const progress = glassesConsumed / dailyGoal;

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="small"
      state={progress >= 0.75 ? 'success' : progress >= 0.5 ? 'warning' : 'normal'}
      centerText={`${glassesConsumed}/${dailyGoal}`}
      centerLabel="Glasses"
    />
  );
}

// ============================================
// EXEMPLO 5: Streak Counter
// ============================================
export function StreakCounterExample() {
  const colors = useColors();
  const currentStreak = 7;
  const goalStreak = 30;
  const progress = Math.min(currentStreak / goalStreak, 1);

  return (
    <ShotsyCircularProgressV2 progress={progress} size="medium">
      <View style={styles.streakContent}>
        <Fire size={32} weight="fill" color="#F97316" />
        <Text style={[styles.streakNumber, { color: colors.text }]}>{currentStreak}</Text>
        <Text style={[styles.streakLabel, { color: colors.textSecondary }]}>day streak</Text>
      </View>
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 6: Health Score
// ============================================
export function HealthScoreExample() {
  const colors = useColors();
  const healthScore = 87;
  const maxScore = 100;
  const progress = healthScore / maxScore;

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="large"
      state={progress >= 0.8 ? 'success' : progress >= 0.6 ? 'warning' : 'error'}
    >
      <View style={styles.healthContent}>
        <Heart
          size={40}
          weight="fill"
          color={progress >= 0.8 ? '#10B981' : progress >= 0.6 ? '#F59E0B' : '#EF4444'}
        />
        <Text style={[styles.healthScore, { color: colors.text }]}>{healthScore}</Text>
        <Text style={[styles.healthLabel, { color: colors.textSecondary }]}>Health Score</Text>
      </View>
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 7: Goal Progress with Custom Colors
// ============================================
export function CustomGoalProgressExample() {
  const progress = 0.65; // 65%
  const customColors = ['#FF6B6B', '#FFE66D', '#4ECDC4', '#45B7D1', '#A8E6CF'];

  return (
    <ShotsyCircularProgressV2 progress={progress} size="medium" customGradient={customColors}>
      <ProgressPercentage value={progress} />
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 8: Comparison - Multiple Sizes
// ============================================
export function SizesComparisonExample() {
  const progress = 0.7;

  return (
    <View style={styles.rowContainer}>
      <View style={styles.sizeExample}>
        <ShotsyCircularProgressV2 progress={progress} size="small" centerText="70%" />
        <Text style={styles.sizeLabel}>Small</Text>
      </View>

      <View style={styles.sizeExample}>
        <ShotsyCircularProgressV2 progress={progress} size="medium" centerText="70%" />
        <Text style={styles.sizeLabel}>Medium</Text>
      </View>

      <View style={styles.sizeExample}>
        <ShotsyCircularProgressV2 progress={progress} size="large" centerText="70%" />
        <Text style={styles.sizeLabel}>Large</Text>
      </View>
    </View>
  );
}

// ============================================
// EXEMPLO 9: States Comparison
// ============================================
export function StatesComparisonExample() {
  const progress = 0.8;

  return (
    <View style={styles.rowContainer}>
      <View style={styles.stateExample}>
        <ShotsyCircularProgressV2
          progress={progress}
          size="small"
          state="normal"
          centerText="80%"
        />
        <Text style={styles.stateLabel}>Normal</Text>
      </View>

      <View style={styles.stateExample}>
        <ShotsyCircularProgressV2
          progress={progress}
          size="small"
          state="success"
          centerText="80%"
        />
        <Text style={styles.stateLabel}>Success</Text>
      </View>

      <View style={styles.stateExample}>
        <ShotsyCircularProgressV2
          progress={progress}
          size="small"
          state="warning"
          centerText="80%"
        />
        <Text style={styles.stateLabel}>Warning</Text>
      </View>

      <View style={styles.stateExample}>
        <ShotsyCircularProgressV2 progress={progress} size="small" state="error" centerText="80%" />
        <Text style={styles.stateLabel}>Error</Text>
      </View>
    </View>
  );
}

// ============================================
// EXEMPLO 10: Animated Progress (Demo)
// ============================================
export function AnimatedProgressDemo() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    // Simula progresso incrementando
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) return 0; // Reseta ao chegar em 100%
        return prev + 0.01; // Incrementa 1%
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <ShotsyCircularProgressV2
      progress={progress}
      size="large"
      animationDuration={100} // Animação rápida para smooth increments
    >
      <ProgressPercentage value={progress} />
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 11: With Trend Indicator
// ============================================
export function TrendProgressExample() {
  const colors = useColors();
  const progress = 0.68;
  const trend = 'up'; // 'up', 'down', 'stable'

  return (
    <ShotsyCircularProgressV2 progress={progress} size="medium">
      <View style={styles.trendContent}>
        <Text style={[styles.trendValue, { color: colors.text }]}>68%</Text>
        <View style={styles.trendRow}>
          <TrendUp size={16} weight="bold" color={trend === 'up' ? '#10B981' : '#EF4444'} />
          <Text style={[styles.trendLabel, { color: colors.textSecondary }]}>+5% this week</Text>
        </View>
      </View>
    </ShotsyCircularProgressV2>
  );
}

// ============================================
// EXEMPLO 12: Complete Dashboard Widget
// ============================================
export function DashboardWidgetExample() {
  const colors = useColors();
  const adherence = 0.88;
  const shotsCompleted = 12;
  const totalShots = 16;

  return (
    <View style={[styles.widget, { backgroundColor: colors.card }]}>
      <Text style={[styles.widgetTitle, { color: colors.text }]}>Your Progress</Text>

      <View style={styles.widgetContent}>
        <ShotsyCircularProgressV2 progress={adherence} size="large" state="success">
          <ProgressPercentage value={adherence} />
        </ShotsyCircularProgressV2>

        <View style={styles.widgetStats}>
          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Adherence</Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              {Math.round(adherence * 100)}%
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Shots</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {shotsCompleted}/{totalShots}
            </Text>
          </View>

          <View style={styles.statRow}>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>7 days 🔥</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  exampleContainer: {
    alignItems: 'center',
    padding: 20,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  healthContent: {
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  healthScore: {
    fontSize: 36,
    fontWeight: '700',
    marginTop: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-around',
    padding: 20,
  },
  sizeExample: {
    alignItems: 'center',
  },
  sizeLabel: {
    fontSize: 12,
    marginTop: 8,
    opacity: 0.7,
  },
  statLabel: {
    fontSize: 14,
  },
  statRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  stateExample: {
    alignItems: 'center',
  },
  stateLabel: {
    fontSize: 11,
    marginTop: 8,
    opacity: 0.7,
  },
  streakContent: {
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  streakNumber: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 4,
  },
  trendContent: {
    alignItems: 'center',
  },
  trendLabel: {
    fontSize: 11,
  },
  trendRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginTop: 4,
  },
  trendValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  widget: {
    borderRadius: 16,
    elevation: 3,
    margin: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  widgetContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 24,
  },
  widgetStats: {
    flex: 1,
    gap: 12,
  },
  widgetTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
});

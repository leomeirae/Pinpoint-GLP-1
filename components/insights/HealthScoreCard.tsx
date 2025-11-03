import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useHealthScore } from '@/hooks/useHealthScore';
import { getScoreLevel } from '@/lib/types/insights';
import { useShotsyColors } from '@/hooks/useShotsyColors';

export const HealthScoreCard: React.FC<{ onPress?: () => void }> = ({ onPress }) => {
  const { score, loading } = useHealthScore();
  const colors = useShotsyColors();

  if (loading || !score) return null;

  const level = getScoreLevel(score.overall_score);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = (score.overall_score / 100) * circumference;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Health Score</Text>
        <Text style={[styles.trend, { color: level.color }]}>
          {score.trend === 'improving' ? '↗️' : score.trend === 'declining' ? '↘️' : '→'} {score.trend}
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.scoreCircle}>
          <Text style={[styles.scoreValue, { color: level.color }]}>{score.overall_score}</Text>
          <Text style={styles.scoreLabel}>{level.label}</Text>
        </View>

        <View style={styles.components}>
          <ScoreBar label="Consistency" value={score.consistency_score} color={colors.primary} />
          <ScoreBar label="Progress" value={score.progress_score} color="#10B981" />
          <ScoreBar label="Engagement" value={score.engagement_score} color="#F59E0B" />
          <ScoreBar label="Data Quality" value={score.data_quality_score} color="#8B5CF6" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <View style={styles.scoreBar}>
    <Text style={styles.barLabel}>{label}</Text>
    <View style={styles.barContainer}>
      <View style={[styles.barFill, { width: `${value}%`, backgroundColor: color }]} />
    </View>
    <Text style={styles.barValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 20, marginBottom: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '600', color: '#1a1a1a' },
  trend: { fontSize: 14, fontWeight: '500' },
  content: { flexDirection: 'row', gap: 20 },
  scoreCircle: { alignItems: 'center', justifyContent: 'center' },
  scoreValue: { fontSize: 48, fontWeight: 'bold' },
  scoreLabel: { fontSize: 12, color: '#666', marginTop: 4 },
  components: { flex: 1, gap: 12 },
  scoreBar: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barLabel: { fontSize: 12, color: '#666', width: 80 },
  barContainer: { flex: 1, height: 6, backgroundColor: '#f0f0f0', borderRadius: 3 },
  barFill: { height: '100%', borderRadius: 3 },
  barValue: { fontSize: 12, fontWeight: '600', color: '#333', width: 30, textAlign: 'right' },
});

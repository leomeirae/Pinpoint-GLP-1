export type InsightType = 'pattern' | 'achievement' | 'suggestion' | 'warning';
export type InsightCategory = 'weight' | 'consistency' | 'progress' | 'health';
export type PatternType = 'weekly_cycle' | 'food_correlation' | 'sleep_impact' | 'custom';
export type ScoreTrend = 'improving' | 'stable' | 'declining';

export interface UserInsight {
  id: string;
  user_id: string;
  type: InsightType;
  category: InsightCategory;
  title: string;
  description: string;
  data: Record<string, any>;
  confidence: number;
  priority: number;
  is_read: boolean;
  is_dismissed: boolean;
  valid_until?: Date;
  created_at: Date;
}

export interface DetectedPattern {
  id: string;
  user_id: string;
  pattern_type: PatternType;
  pattern_data: Record<string, any>;
  confidence: number;
  occurrences: number;
  first_detected: Date;
  last_detected: Date;
  is_active: boolean;
}

export interface HealthScore {
  id: string;
  user_id: string;
  date: Date;
  overall_score: number;
  consistency_score: number;
  progress_score: number;
  engagement_score: number;
  data_quality_score: number;
  trend?: ScoreTrend;
  created_at: Date;
}

export interface HealthScoreComponents {
  overall: number;
  consistency: number;
  progress: number;
  engagement: number;
  data_quality: number;
}

export const getInsightIcon = (type: InsightType): string => {
  const icons: Record<InsightType, string> = {
    pattern: '🔍',
    achievement: '🎉',
    suggestion: '💡',
    warning: '⚠️',
  };
  return icons[type];
};

export const getInsightColor = (type: InsightType): string => {
  const colors: Record<InsightType, string> = {
    pattern: '#3B82F6',
    achievement: '#10B981',
    suggestion: '#F59E0B',
    warning: '#EF4444',
  };
  return colors[type];
};

export const getScoreLevel = (score: number): { label: string; color: string } => {
  if (score >= 80) return { label: 'Excellent', color: '#10B981' };
  if (score >= 60) return { label: 'Good', color: '#3B82F6' };
  if (score >= 40) return { label: 'Fair', color: '#F59E0B' };
  return { label: 'Needs Attention', color: '#EF4444' };
};

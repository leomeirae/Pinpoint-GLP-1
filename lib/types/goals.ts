// Personal goals types
export type GoalType = 'weight_loss' | 'energy_boost' | 'consistency' | 'custom';
export type CelebrationStyle = 'subtle' | 'energetic' | 'zen';
export type GoalStatus = 'active' | 'paused' | 'completed' | 'abandoned';

export interface Milestone {
  value: number;
  label: string;
  achieved: boolean;
  achieved_date?: Date | string;
}

export interface PersonalGoal {
  id: string;
  user_id: string;

  // Definition
  type: GoalType;
  title: string;
  description?: string;

  // Target
  target_value?: number;
  target_unit?: string;
  target_date?: Date;

  // Progress
  current_value: number;
  progress_percentage: number;

  // Milestones
  milestones: Milestone[];

  // Customization
  celebration_style: CelebrationStyle;
  reminder_enabled: boolean;

  // Status
  status: GoalStatus;
  started_at: Date;
  completed_at?: Date;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface CreateGoalInput {
  type: GoalType;
  title: string;
  description?: string;
  target_value?: number;
  target_unit?: string;
  target_date?: Date;
  milestones?: Milestone[];
  celebration_style?: CelebrationStyle;
  reminder_enabled?: boolean;
}

// Goal templates for common goals
export const GOAL_TEMPLATES: Record<GoalType, Partial<CreateGoalInput>> = {
  weight_loss: {
    type: 'weight_loss',
    title: 'Reach my target weight',
    target_unit: 'kg',
    celebration_style: 'energetic',
  },
  energy_boost: {
    type: 'energy_boost',
    title: 'Increase my daily energy',
    celebration_style: 'zen',
  },
  consistency: {
    type: 'consistency',
    title: 'Stay consistent with my shots',
    target_value: 12,
    target_unit: 'weeks',
    celebration_style: 'subtle',
  },
  custom: {
    type: 'custom',
    title: 'My custom goal',
    celebration_style: 'energetic',
  },
};

// Helper functions
export const createMilestones = (
  targetValue: number,
  unit: string,
  count: number = 4
): Milestone[] => {
  const milestones: Milestone[] = [];
  const step = targetValue / count;

  for (let i = 1; i <= count; i++) {
    milestones.push({
      value: Math.round(step * i * 100) / 100,
      label: `${Math.round((i / count) * 100)}% - ${Math.round(step * i)} ${unit}`,
      achieved: false,
    });
  }

  return milestones;
};

export const calculateProgress = (current: number, target: number): number => {
  if (!target || target === 0) return 0;
  return Math.min(100, Math.max(0, Math.round((current / target) * 100)));
};

export const getNextMilestone = (goal: PersonalGoal): Milestone | null => {
  return goal.milestones.find(m => !m.achieved) || null;
};

export const getRemainingDays = (targetDate?: Date): number | null => {
  if (!targetDate) return null;
  const target = new Date(targetDate);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const isGoalOverdue = (goal: PersonalGoal): boolean => {
  if (!goal.target_date || goal.status !== 'active') return false;
  return new Date(goal.target_date) < new Date();
};

export const getGoalEmoji = (type: GoalType): string => {
  const emojis: Record<GoalType, string> = {
    weight_loss: '⚖️',
    energy_boost: '⚡',
    consistency: '🎯',
    custom: '✨',
  };
  return emojis[type] || '🎯';
};

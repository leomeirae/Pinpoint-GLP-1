// Avatar personalization types
export type AvatarStyle = 'abstract' | 'minimal' | 'illustrated' | 'photo';
export type AvatarMood = 'motivated' | 'chill' | 'determined' | 'playful';
export type EvolutionStage = 'beginner' | 'intermediate' | 'advanced' | 'master';

export interface UserAvatar {
  id: string;
  user_id: string;

  // Appearance
  style: AvatarStyle;
  primary_color: string;
  accessories: string[];
  mood: AvatarMood;

  // Evolution
  level: number;
  evolution_stage: EvolutionStage;
  unlock_date: Date;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface AvatarCustomization {
  style: AvatarStyle;
  primary_color: string;
  accessories: string[];
  mood: AvatarMood;
}

// Avatar appearance options
export const AVATAR_STYLES: AvatarStyle[] = ['abstract', 'minimal', 'illustrated', 'photo'];
export const AVATAR_MOODS: AvatarMood[] = ['motivated', 'chill', 'determined', 'playful'];

export const DEFAULT_AVATAR_COLORS = [
  '#0891B2', // cyan
  '#EC4899', // pink
  '#8B5CF6', // purple
  '#10B981', // green
  '#F59E0B', // amber
  '#EF4444', // red
  '#3B82F6', // blue
  '#F97316', // orange
];

export const AVATAR_ACCESSORIES = [
  'glasses',
  'hat',
  'medal',
  'headphones',
  'crown',
  'star',
  'flower',
  'sparkles',
];

// Helper functions
export const getEvolutionStageFromLevel = (level: number): EvolutionStage => {
  if (level >= 40) return 'master';
  if (level >= 25) return 'advanced';
  if (level >= 10) return 'intermediate';
  return 'beginner';
};

export const getNextEvolutionLevel = (stage: EvolutionStage): number => {
  switch (stage) {
    case 'beginner': return 10;
    case 'intermediate': return 25;
    case 'advanced': return 40;
    case 'master': return 100;
  }
};

export const getEvolutionProgress = (level: number, stage: EvolutionStage): number => {
  const ranges = {
    beginner: { min: 1, max: 9 },
    intermediate: { min: 10, max: 24 },
    advanced: { min: 25, max: 39 },
    master: { min: 40, max: 100 },
  };

  const range = ranges[stage];
  return Math.round(((level - range.min) / (range.max - range.min)) * 100);
};

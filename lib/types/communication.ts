// Communication preferences types (Tone & Voice)
export type CommunicationStyle = 'coach' | 'friend' | 'scientist' | 'minimalist';
export type MotivationType = 'data-driven' | 'emotional' | 'balanced';
export type NotificationTone = 'encouraging' | 'neutral' | 'direct' | 'playful';
export type NotificationFrequency = 'minimal' | 'normal' | 'frequent';

export interface AppPersonality {
  id: string;
  user_id: string;

  // Style
  style: CommunicationStyle;
  humor_level: number; // 1-5
  motivation_type: MotivationType;

  // Preferences
  use_emojis: boolean;
  formality_level: number; // 1-5
  preferred_language: string;

  // Notifications
  notification_tone: NotificationTone;
  notification_frequency: NotificationFrequency;

  // Metadata
  created_at: Date;
  updated_at: Date;
}

export interface PersonalityUpdate {
  style?: CommunicationStyle;
  humor_level?: number;
  motivation_type?: MotivationType;
  use_emojis?: boolean;
  formality_level?: number;
  preferred_language?: string;
  notification_tone?: NotificationTone;
  notification_frequency?: NotificationFrequency;
}

// Communication style descriptions
export const COMMUNICATION_STYLES: Record<CommunicationStyle, {
  label: string;
  description: string;
  example: string;
}> = {
  coach: {
    label: 'Coach',
    description: 'Motivating and results-focused',
    example: 'Great work staying on track! Keep pushing toward your goals.',
  },
  friend: {
    label: 'Friend',
    description: 'Casual and supportive',
    example: 'Hey! Awesome job today! You\'re doing amazing 🎉',
  },
  scientist: {
    label: 'Scientist',
    description: 'Data-driven and analytical',
    example: 'Your 7-day average shows a 2.3% improvement in consistency.',
  },
  minimalist: {
    label: 'Minimalist',
    description: 'Concise and to-the-point',
    example: 'Application logged. Next dose in 7 days.',
  },
};

export const MOTIVATION_TYPES: Record<MotivationType, {
  label: string;
  description: string;
}> = {
  'data-driven': {
    label: 'Data-Driven',
    description: 'Focus on numbers, trends, and analytics',
  },
  emotional: {
    label: 'Emotional',
    description: 'Focus on feelings, achievements, and personal growth',
  },
  balanced: {
    label: 'Balanced',
    description: 'Mix of data insights and emotional encouragement',
  },
};

export const NOTIFICATION_TONES: Record<NotificationTone, {
  label: string;
  description: string;
}> = {
  encouraging: {
    label: 'Encouraging',
    description: 'Positive and uplifting',
  },
  neutral: {
    label: 'Neutral',
    description: 'Informative and straightforward',
  },
  direct: {
    label: 'Direct',
    description: 'Brief and action-oriented',
  },
  playful: {
    label: 'Playful',
    description: 'Fun and light-hearted',
  },
};

// Helper function to get personalized message
export const personalizeMessage = (
  baseMessage: string,
  personality: AppPersonality,
  context?: {
    isEncouraging?: boolean;
    isImportant?: boolean;
    hasData?: boolean;
  }
): string => {
  let message = baseMessage;

  // Add emojis based on preferences
  if (personality.use_emojis && context?.isEncouraging) {
    switch (personality.notification_tone) {
      case 'playful':
        message += ' 🎉🎊';
        break;
      case 'encouraging':
        message += ' 🎉';
        break;
      case 'neutral':
        message += ' ✓';
        break;
      default:
        break;
    }
  }

  // Adjust tone based on style
  // In production, this would integrate with OpenAI for dynamic generation
  if (personality.style === 'minimalist') {
    // Remove emojis for minimalist
    message = message.replace(/[^\w\s,.!?-]/g, '').trim();
  }

  return message;
};

// Get default personality based on other preferences
export const getDefaultPersonality = (): Omit<AppPersonality, 'id' | 'user_id' | 'created_at' | 'updated_at'> => ({
  style: 'friend',
  humor_level: 3,
  motivation_type: 'balanced',
  use_emojis: true,
  formality_level: 3,
  preferred_language: 'en',
  notification_tone: 'encouraging',
  notification_frequency: 'normal',
});

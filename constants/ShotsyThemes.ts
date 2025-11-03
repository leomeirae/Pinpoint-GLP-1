export type ShotsyTheme = 'classic' | 'ocean' | 'drizzle' | 'galaxy' | 'petal' | 'sunset' | 'monster' | 'phantom';
export type AccentColor = 'yellow' | 'orange' | 'pink' | 'purple' | 'blue';

interface ThemeColors {
  name: string;
  gradient: {
    start: string;
    middle1: string;
    middle2: string;
    end: string;
  };
  colors: string[]; // 5 cores do tema
}

export const SHOTSY_THEMES: Record<ShotsyTheme, ThemeColors> = {
  classic: {
    name: 'Classic',
    gradient: {
      start: '#EF4444', // red
      middle1: '#F97316', // orange
      middle2: '#FBBF24', // yellow
      end: '#10B981', // green
    },
    colors: ['#EF4444', '#F97316', '#FBBF24', '#10B981', '#0891B2'],
  },
  ocean: {
    name: 'Ocean',
    gradient: {
      start: '#0891B2', // cyan
      middle1: '#06B6D4', // cyan-light
      middle2: '#22D3EE', // cyan-lighter
      end: '#10B981', // green
    },
    colors: ['#0891B2', '#06B6D4', '#22D3EE', '#10B981', '#FBBF24'],
  },
  drizzle: {
    name: 'Drizzle',
    gradient: {
      start: '#FBBF24', // yellow
      middle1: '#10B981', // green
      middle2: '#06B6D4', // cyan
      end: '#6366F1', // indigo
    },
    colors: ['#FBBF24', '#10B981', '#06B6D4', '#6366F1', '#8B5CF6'],
  },
  galaxy: {
    name: 'Galaxy',
    gradient: {
      start: '#10B981', // green
      middle1: '#06B6D4', // cyan
      middle2: '#6366F1', // indigo
      end: '#EC4899', // pink
    },
    colors: ['#10B981', '#06B6D4', '#6366F1', '#8B5CF6', '#EC4899'],
  },
  petal: {
    name: 'Petal',
    gradient: {
      start: '#FBBF24', // yellow
      middle1: '#10B981', // green
      middle2: '#06B6D4', // cyan
      end: '#EC4899', // pink
    },
    colors: ['#FBBF24', '#10B981', '#06B6D4', '#8B5CF6', '#EC4899'],
  },
  sunset: {
    name: 'Sunset',
    gradient: {
      start: '#F97316', // orange
      middle1: '#F59E0B', // amber
      middle2: '#8B5CF6', // purple
      end: '#0891B2', // cyan
    },
    colors: ['#F97316', '#F59E0B', '#8B5CF6', '#6366F1', '#0891B2'],
  },
  monster: {
    name: 'Monster',
    gradient: {
      start: '#10B981', // green
      middle1: '#22C55E', // green-light
      middle2: '#10B981', // green
      end: '#059669', // green-dark
    },
    colors: ['#10B981', '#22C55E', '#10B981', '#059669', '#047857'],
  },
  phantom: {
    name: 'Phantom',
    gradient: {
      start: '#8B5CF6', // purple
      middle1: '#A78BFA', // purple-light
      middle2: '#6366F1', // indigo
      end: '#8B5CF6', // purple
    },
    colors: ['#8B5CF6', '#A78BFA', '#6366F1', '#8B5CF6', '#7C3AED'],
  },
};

export const ACCENT_COLORS: Record<AccentColor, string> = {
  yellow: '#FBBF24',
  orange: '#F97316',
  pink: '#EC4899',
  purple: '#8B5CF6',
  blue: '#0891B2',
};

// Cores principais do Shotsy (invariáveis entre temas)
export const SHOTSY_COLORS = {
  primary: '#0891B2',
  primaryDark: '#0E7490',
  primaryLight: '#06B6D4',

  // Backgrounds
  backgroundLight: '#FFFFFF',
  backgroundDark: '#1F1F1F',
  cardLight: '#F8F9FA',
  cardDark: '#2A2A2A',

  // Text
  textLight: '#0F0F1E',
  textDark: '#FFFFFF',
  textSecondaryLight: '#64748B',
  textSecondaryDark: '#94A3B8',
  textMutedLight: '#94A3B8',
  textMutedDark: '#64748B',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0891B2',

  // Borders
  borderLight: '#E5E7EB',
  borderDark: '#374151',
};

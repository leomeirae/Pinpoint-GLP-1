// Colors and themes for Mounjaro Tracker
// Use useColors() hook for theme-aware colors

export { SHOTSY_COLORS as COLORS, SHOTSY_THEMES, ACCENT_COLORS } from './ShotsyThemes';
export { useColors } from '@/hooks/useShotsyColors';

// Backward compatibility alias (deprecated - use useColors instead)
export { useColors as useShotsyColors } from '@/hooks/useShotsyColors';

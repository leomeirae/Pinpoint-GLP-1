import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Ellipse, G, Rect } from 'react-native-svg';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import * as Haptics from 'expo-haptics';

export interface BodyDiagramProps {
  selectedSites: string[];
  onSiteToggle: (siteId: string) => void;
  history?: string[];
}

interface InjectionSite {
  id: string;
  label: string;
  x: number;
  y: number;
  icon: string;
}

const INJECTION_SITES: InjectionSite[] = [
  { id: 'stomach_left', label: 'Abdômen Esq.', x: 110, y: 140, icon: '🫃' },
  { id: 'stomach_right', label: 'Abdômen Dir.', x: 170, y: 140, icon: '🫃' },
  { id: 'thigh_left', label: 'Coxa Esq.', x: 110, y: 240, icon: '🦵' },
  { id: 'thigh_right', label: 'Coxa Dir.', x: 170, y: 240, icon: '🦵' },
  { id: 'arm_left', label: 'Braço Esq.', x: 60, y: 100, icon: '💪' },
  { id: 'arm_right', label: 'Braço Dir.', x: 220, y: 100, icon: '💪' },
  { id: 'buttock_left', label: 'Glúteo Esq.', x: 110, y: 190, icon: '🍑' },
  { id: 'buttock_right', label: 'Glúteo Dir.', x: 170, y: 190, icon: '🍑' },
];

export function BodyDiagram({ selectedSites, onSiteToggle, history = [] }: BodyDiagramProps) {
  const colors = useShotsyColors();

  // Get suggested site based on rotation logic
  const getSuggestedSite = (): string | null => {
    if (history.length === 0) return null;

    // Get last 3 sites from history
    const recentSites = history.slice(-3);

    // Find sites that haven't been used recently
    const availableSites = INJECTION_SITES.filter(
      site => !recentSites.includes(site.id)
    );

    if (availableSites.length === 0) {
      // All sites used recently, suggest least recently used
      const leastRecentSite = INJECTION_SITES.find(
        site => !recentSites.slice(-1).includes(site.id)
      );
      return leastRecentSite?.id || null;
    }

    // Rotate through body areas: stomach -> thighs -> arms -> buttocks
    const lastSite = history[history.length - 1];

    if (lastSite.startsWith('stomach_')) {
      const thighSites = availableSites.filter(s => s.id.startsWith('thigh_'));
      return thighSites[0]?.id || availableSites[0]?.id || null;
    }

    if (lastSite.startsWith('thigh_')) {
      const armSites = availableSites.filter(s => s.id.startsWith('arm_'));
      return armSites[0]?.id || availableSites[0]?.id || null;
    }

    if (lastSite.startsWith('arm_')) {
      const buttockSites = availableSites.filter(s => s.id.startsWith('buttock_'));
      return buttockSites[0]?.id || availableSites[0]?.id || null;
    }

    if (lastSite.startsWith('buttock_')) {
      const stomachSites = availableSites.filter(s => s.id.startsWith('stomach_'));
      return stomachSites[0]?.id || availableSites[0]?.id || null;
    }

    return availableSites[0]?.id || null;
  };

  const suggestedSite = getSuggestedSite();
  const recentlyUsedSites = history.slice(-3);

  const handleSitePress = (siteId: string) => {
    Haptics.selectionAsync();
    onSiteToggle(siteId);
  };

  const isSelected = (siteId: string) => selectedSites.includes(siteId);
  const isSuggested = (siteId: string) => siteId === suggestedSite;
  const isRecentlyUsed = (siteId: string) => recentlyUsedSites.includes(siteId);

  const getSiteColor = (siteId: string): string => {
    if (isSelected(siteId)) return colors.primary;
    if (isSuggested(siteId)) return colors.success;
    if (isRecentlyUsed(siteId)) return colors.textMuted;
    return colors.border;
  };

  const getSiteFillOpacity = (siteId: string): number => {
    if (isSelected(siteId)) return 0.3;
    if (isSuggested(siteId)) return 0.15;
    if (isRecentlyUsed(siteId)) return 0.05;
    return 0;
  };

  return (
    <View style={styles.container}>
      {/* SVG Body Diagram - Shotsy style: minimalist, clean */}
      <View style={styles.diagramContainer}>
        <Svg width="280" height="320" viewBox="0 0 280 320">
          {/* Simple body silhouette - very subtle */}
          <G opacity="0.1">
            {/* Head */}
            <Circle cx="140" cy="30" r="20" fill={colors.textMuted} />

            {/* Neck */}
            <Rect x="130" y="48" width="20" height="12" fill={colors.textMuted} />

            {/* Torso */}
            <Ellipse cx="140" cy="130" rx="50" ry="70" fill={colors.textMuted} />

            {/* Arms */}
            <Ellipse cx="80" cy="110" rx="12" ry="40" fill={colors.textMuted} />
            <Ellipse cx="200" cy="110" rx="12" ry="40" fill={colors.textMuted} />

            {/* Legs */}
            <Ellipse cx="115" cy="250" rx="15" ry="50" fill={colors.textMuted} />
            <Ellipse cx="165" cy="250" rx="15" ry="50" fill={colors.textMuted} />
          </G>

          {/* Injection site markers - larger and more visible */}
          {INJECTION_SITES.map((site) => {
            const siteColor = getSiteColor(site.id);
            const fillOpacity = getSiteFillOpacity(site.id);
            const strokeWidth = isSelected(site.id) ? 3 : isSuggested(site.id) ? 2 : 1;

            return (
              <G key={site.id}>
                {/* Outer ring for suggested sites - subtle */}
                {isSuggested(site.id) && (
                  <Circle
                    cx={site.x}
                    cy={site.y}
                    r="22"
                    fill="none"
                    stroke={colors.success}
                    strokeWidth="2"
                    strokeDasharray="6,3"
                    opacity={0.5}
                  />
                )}

                {/* Main circle - larger and more visible */}
                <Circle
                  cx={site.x}
                  cy={site.y}
                  r="18"
                  fill={siteColor}
                  fillOpacity={fillOpacity}
                  stroke={siteColor}
                  strokeWidth={strokeWidth}
                  onPress={() => handleSitePress(site.id)}
                />

                {/* Inner dot for selected sites */}
                {isSelected(site.id) && (
                  <Circle
                    cx={site.x}
                    cy={site.y}
                    r="8"
                    fill={colors.primary}
                  />
                )}
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  diagramContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
});

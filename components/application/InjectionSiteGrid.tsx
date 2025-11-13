import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface InjectionSiteGridProps {
  value: string[];
  onChange: (sites: string[]) => void;
}

const INJECTION_SITES = [
  { id: 'stomach_left', label: 'Abdômen\nEsquerdo', icon: '🫃' },
  { id: 'stomach_right', label: 'Abdômen\nDireito', icon: '🫃' },
  { id: 'thigh_left', label: 'Coxa\nEsquerda', icon: '🦵' },
  { id: 'thigh_right', label: 'Coxa\nDireita', icon: '🦵' },
  { id: 'arm_left', label: 'Braço\nEsquerdo', icon: '💪' },
  { id: 'arm_right', label: 'Braço\nDireito', icon: '💪' },
];

export function InjectionSiteGrid({ value, onChange }: InjectionSiteGridProps) {
  const colors = useShotsyColors();

  const toggleSite = (siteId: string) => {
    if (value.includes(siteId)) {
      onChange(value.filter((id) => id !== siteId));
    } else {
      onChange([...value, siteId]);
    }
  };

  return (
    <View style={styles.grid}>
      {INJECTION_SITES.map((site) => {
        const isSelected = value.includes(site.id);
        return (
          <TouchableOpacity
            key={site.id}
            style={[
              styles.siteButton,
              {
                backgroundColor: colors.cardSecondary,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: isSelected ? 3 : 1,
              },
            ]}
            onPress={() => toggleSite(site.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{site.icon}</Text>
            <Text
              style={[styles.label, { color: isSelected ? colors.primary : colors.textSecondary }]}
            >
              {site.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    lineHeight: 14,
    textAlign: 'center',
  },
  siteButton: {
    alignItems: 'center',
    aspectRatio: 1,
    borderRadius: 16,
    justifyContent: 'center',
    margin: 6,
    padding: 12,
    width: '31%',
  },
});

import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface FilterChipsProps {
  filters: string[];
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  selectedFilter,
  onFilterChange,
}) => {
  const colors = useShotsyColors();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {filters.map((filter) => {
        const isSelected = filter === selectedFilter;
        return (
          <TouchableOpacity
            key={filter}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
              },
            ]}
            onPress={() => onFilterChange(filter)}
          >
            <Text style={[styles.chipText, { color: isSelected ? '#FFF' : colors.text }]}>
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    marginVertical: 16,
  },
  content: {
    gap: 8,
    paddingHorizontal: 16,
  },
});

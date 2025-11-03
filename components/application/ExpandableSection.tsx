import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface ExpandableSectionProps {
  title: string;
  value?: string;
  children?: React.ReactNode;
  defaultExpanded?: boolean;
}

export function ExpandableSection({
  title,
  value,
  children,
  defaultExpanded = false
}: ExpandableSectionProps) {
  const colors = useShotsyColors();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const rotation = useSharedValue(defaultExpanded ? 180 : 0);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
    rotation.value = withTiming(expanded ? 0 : 180, { duration: 300 });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={toggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <Text style={[styles.title, { color: colors.textSecondary }]}>{title}</Text>
          {value && !expanded && (
            <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
          )}
        </View>
        <Animated.Text style={[styles.chevron, { color: colors.textSecondary }, chevronStyle]}>
          ▼
        </Animated.Text>
      </TouchableOpacity>

      {expanded && children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
});

import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface SkeletonProps {
  width?: ViewStyle['width'];
  height?: ViewStyle['height'];
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const colors = useShotsyColors();
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.cardSecondary,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

// ✅ Skeleton para ShotHistoryCards
export function ShotHistoryCardsSkeleton() {
  const colors = useShotsyColors();

  return (
    <View style={styles.container}>
      <Skeleton width={180} height={24} style={{ marginBottom: 12 }} />
      <View style={styles.cards}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={24} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={24} />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Skeleton width={40} height={40} borderRadius={20} style={{ marginBottom: 8 }} />
          <Skeleton width="80%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={24} />
        </View>
      </View>
    </View>
  );
}

// ✅ Skeleton para NextShotWidget
export function NextShotWidgetSkeleton() {
  const colors = useShotsyColors();

  return (
    <View style={[styles.widgetContainer, { backgroundColor: colors.card }]}>
      <Skeleton width={150} height={150} borderRadius={75} style={{ alignSelf: 'center', marginBottom: 16 }} />
      <Skeleton width="60%" height={20} style={{ alignSelf: 'center', marginBottom: 8 }} />
      <Skeleton width="80%" height={16} style={{ alignSelf: 'center', marginBottom: 16 }} />
      <Skeleton width="70%" height={40} borderRadius={20} style={{ alignSelf: 'center' }} />
    </View>
  );
}

// ✅ Skeleton para TodaySection
export function TodaySectionSkeleton() {
  const colors = useShotsyColors();

  return (
    <View style={styles.container}>
      <Skeleton width={100} height={24} style={{ marginBottom: 12 }} />
      <View style={styles.gridRow}>
        <View style={[styles.gridItem, { backgroundColor: colors.card }]}>
          <Skeleton width={30} height={30} style={{ marginBottom: 8 }} />
          <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={20} />
        </View>

        <View style={[styles.gridItem, { backgroundColor: colors.card }]}>
          <Skeleton width={30} height={30} style={{ marginBottom: 8 }} />
          <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={20} />
        </View>

        <View style={[styles.gridItem, { backgroundColor: colors.card }]}>
          <Skeleton width={30} height={30} style={{ marginBottom: 8 }} />
          <Skeleton width="60%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={20} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  cards: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    borderRadius: 16,
  },
  widgetContainer: {
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  gridItem: {
    flex: 1,
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
});

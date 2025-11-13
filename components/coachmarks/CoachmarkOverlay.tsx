import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Dimensions,
} from 'react-native';
import { ArrowRight, X } from 'phosphor-react-native';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyDesignTokens } from '@/constants/shotsyDesignTokens';
import { useCoachmarks } from './CoachmarkContext';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

export function CoachmarkOverlay() {
  const colors = useColors();
  const { currentCoachmark, completeCurrentCoachmark, skipTour } = useCoachmarks();

  if (!currentCoachmark) {
    return null;
  }

  const handleNext = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    completeCurrentCoachmark();
  };

  const handleSkip = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    skipTour();
  };

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      onRequestClose={handleSkip}
      accessibilityViewIsModal={true}
    >
      {/* Dark overlay */}
      <Pressable style={styles.overlay} onPress={handleSkip}>
        {/* Content card - positioned at center */}
        <Pressable
          style={[styles.contentContainer, { backgroundColor: colors.card }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleSkip}
            accessibilityRole="button"
            accessibilityLabel="Pular tour"
          >
            <X size={20} color={colors.textSecondary} weight="bold" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>{currentCoachmark.title}</Text>

          {/* Description */}
          <Text style={[styles.description, { color: colors.textSecondary }]}>
            {currentCoachmark.description}
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              accessibilityRole="button"
              accessibilityLabel="Pular tour"
            >
              <Text style={[styles.skipButtonText, { color: colors.textSecondary }]}>
                Pular tour
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.nextButton, { backgroundColor: colors.primary }]}
              onPress={handleNext}
              accessibilityRole="button"
              accessibilityLabel="Próximo"
            >
              <Text style={styles.nextButtonText}>Entendi</Text>
              <ArrowRight size={16} color="#FFFFFF" weight="bold" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.md,
    justifyContent: 'space-between',
  },
  closeButton: {
    alignItems: 'center',
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: ShotsyDesignTokens.spacing.md,
    top: ShotsyDesignTokens.spacing.md,
    width: 32,
    zIndex: 1,
  },
  contentContainer: {
    borderRadius: ShotsyDesignTokens.borderRadius.lg,
    maxWidth: 400,
    padding: ShotsyDesignTokens.spacing.xl,
    width: '100%',
    ...ShotsyDesignTokens.shadows.card,
  },
  description: {
    ...ShotsyDesignTokens.typography.body,
    lineHeight: 22,
    marginBottom: ShotsyDesignTokens.spacing.xl,
  },
  nextButton: {
    alignItems: 'center',
    borderRadius: ShotsyDesignTokens.borderRadius.md,
    flexDirection: 'row',
    gap: ShotsyDesignTokens.spacing.sm,
    paddingHorizontal: ShotsyDesignTokens.spacing.lg,
    paddingVertical: ShotsyDesignTokens.spacing.md,
  },
  nextButtonText: {
    ...ShotsyDesignTokens.typography.label,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    flex: 1,
    justifyContent: 'center',
    padding: ShotsyDesignTokens.spacing.xl,
  },
  skipButton: {
    padding: ShotsyDesignTokens.spacing.md,
  },
  skipButtonText: {
    ...ShotsyDesignTokens.typography.label,
    fontWeight: '600',
  },
  title: {
    ...ShotsyDesignTokens.typography.h3,
    fontWeight: '600',
    marginBottom: ShotsyDesignTokens.spacing.md,
    paddingRight: ShotsyDesignTokens.spacing.xl,
  },
});

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useShotsyColors';
import { ShotsyButton } from '@/components/ui/shotsy-button';
import { Ionicons } from '@expo/vector-icons';

interface OnboardingScreenBaseProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onNext?: () => void;
  onBack?: () => void;
  nextButtonText?: string;
  disableNext?: boolean;
  showBackButton?: boolean;
  loading?: boolean;
  contentContainerStyle?: any;
}

export function OnboardingScreenBase({
  children,
  title,
  subtitle,
  onNext,
  onBack,
  nextButtonText = 'Continuar',
  disableNext = false,
  showBackButton = true,
  loading = false,
  contentContainerStyle,
}: OnboardingScreenBaseProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {showBackButton && onBack && (
        <TouchableOpacity style={[styles.backButton, { top: insets.top + 16 }]} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 16, paddingBottom: insets.bottom + 100 },
          contentContainerStyle,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {title && (
          <View style={[styles.header, showBackButton && onBack && styles.headerWithBackButton]}>
            <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
            {subtitle && (
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
            )}
          </View>
        )}

        {children}
      </ScrollView>

      {onNext && (
        <View
          style={[
            styles.footer,
            {
              paddingBottom: insets.bottom + 20,
              backgroundColor: colors.background,
            },
          ]}
        >
          <ShotsyButton
            title={nextButtonText}
            onPress={onNext}
            disabled={disableNext}
            loading={loading}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    left: 20,
    position: 'absolute',
    width: 40,
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
  footer: {
    bottom: 0,
    elevation: 5,
    left: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    position: 'absolute',
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    marginBottom: 32,
    paddingLeft: 0, // Ensure no overlap with back button
  },
  headerWithBackButton: {
    paddingLeft: 0, // No extra padding needed, back button is absolute
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  scrollView: {
    flex: 1,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 36,
    marginBottom: 8,
  },
});

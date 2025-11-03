import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/lib/theme-context';

interface ShotsyButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function ShotsyButton({
  title,
  onPress,
  variant = 'primary',
  size = 'large',
  disabled = false,
  loading = false,
  style,
  textStyle,
}: ShotsyButtonProps) {
  const { colors, currentAccent, effectiveMode } = useTheme();
  const isDark = effectiveMode === 'dark';

  const getBackgroundColor = () => {
    if (disabled) return isDark ? '#374151' : '#E5E7EB';

    switch (variant) {
      case 'primary':
        return currentAccent;
      case 'secondary':
        return isDark ? colors.cardDark : colors.cardLight;
      case 'outline':
      case 'ghost':
        return 'transparent';
      default:
        return currentAccent;
    }
  };

  const getTextColor = () => {
    if (disabled) return isDark ? '#6B7280' : '#9CA3AF';

    switch (variant) {
      case 'primary':
        return '#FFFFFF';
      case 'secondary':
      case 'outline':
      case 'ghost':
        return currentAccent;
      default:
        return '#FFFFFF';
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small':
        return 40;
      case 'medium':
        return 48;
      case 'large':
        return 56;
      default:
        return 56;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          height: getHeight(),
          borderWidth: variant === 'outline' ? 2 : 0,
          borderColor: variant === 'outline' ? currentAccent : 'transparent',
        },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === 'small' ? 14 : 16,
              fontWeight: '600',
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  text: {
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

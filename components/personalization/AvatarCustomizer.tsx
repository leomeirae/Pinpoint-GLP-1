import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useAvatar } from '@/hooks/useAvatar';
import {
  AvatarStyle,
  AvatarMood,
  AVATAR_STYLES,
  AVATAR_MOODS,
  DEFAULT_AVATAR_COLORS,
  AVATAR_ACCESSORIES,
} from '@/lib/types/avatar';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('AvatarCustomizer');

const { width } = Dimensions.get('window');

interface AvatarCustomizerProps {
  onComplete?: () => void;
  showSkip?: boolean;
}

export const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({
  onComplete,
  showSkip = false,
}) => {
  const { avatar, updateAvatar, loading: avatarLoading } = useAvatar();
  const colors = useShotsyColors();

  const [selectedStyle, setSelectedStyle] = useState<AvatarStyle>('minimal');
  const [selectedColor, setSelectedColor] = useState('#0891B2');
  const [selectedMood, setSelectedMood] = useState<AvatarMood>('motivated');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  // Load avatar data when available
  useEffect(() => {
    if (avatar) {
      setSelectedStyle(avatar.style);
      setSelectedColor(avatar.primary_color);
      setSelectedMood(avatar.mood);
      setSelectedAccessories(avatar.accessories);
    }
  }, [avatar]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAvatar({
        style: selectedStyle,
        primary_color: selectedColor,
        mood: selectedMood,
        accessories: selectedAccessories,
      });
      onComplete?.();
    } catch (error) {
      logger.error('Error saving avatar:', error as Error);
    } finally {
      setSaving(false);
    }
  };

  const toggleAccessory = (accessory: string) => {
    if (selectedAccessories.includes(accessory)) {
      setSelectedAccessories((prev) => prev.filter((a) => a !== accessory));
    } else {
      // Limit to 3 accessories
      if (selectedAccessories.length < 3) {
        setSelectedAccessories((prev) => [...prev, accessory]);
      }
    }
  };

  const getStyleIcon = (style: AvatarStyle): string => {
    const icons: Record<AvatarStyle, string> = {
      abstract: '🎨',
      minimal: '⚪',
      illustrated: '✨',
      photo: '📷',
    };
    return icons[style];
  };

  const getMoodIcon = (mood: AvatarMood): string => {
    const icons: Record<AvatarMood, string> = {
      motivated: '💪',
      chill: '😌',
      determined: '🎯',
      playful: '🎉',
    };
    return icons[mood];
  };

  if (avatarLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading your avatar...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Customize Your Avatar</Text>
        <Text style={styles.subtitle}>
          Create a unique avatar that represents you on your health journey
        </Text>
      </View>

      {/* Avatar Preview */}
      <View style={[styles.previewContainer, { backgroundColor: selectedColor + '20' }]}>
        <View style={[styles.avatarCircle, { backgroundColor: selectedColor }]}>
          <Text style={styles.avatarEmoji}>{getMoodIcon(selectedMood)}</Text>
          {selectedAccessories.length > 0 && (
            <View style={styles.accessoryBadge}>
              <Text style={styles.accessoryBadgeText}>{selectedAccessories.length}</Text>
            </View>
          )}
        </View>
        <Text style={styles.previewLabel}>
          {selectedStyle} • {selectedMood}
        </Text>
      </View>

      {/* Style Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Avatar Style</Text>
        <Text style={styles.sectionDescription}>Choose how your avatar looks</Text>
        <View style={styles.optionsGrid}>
          {AVATAR_STYLES.map((style) => (
            <TouchableOpacity
              key={style}
              style={[
                styles.gridOption,
                selectedStyle === style && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedStyle(style)}
            >
              <Text style={styles.optionIcon}>{getStyleIcon(style)}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedStyle === style && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                {style}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Color Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Primary Color</Text>
        <Text style={styles.sectionDescription}>Pick your favorite color</Text>
        <View style={styles.colorGrid}>
          {DEFAULT_AVATAR_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                selectedColor === color && styles.colorSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              {selectedColor === color && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mood Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood & Expression</Text>
        <Text style={styles.sectionDescription}>How are you feeling today?</Text>
        <View style={styles.optionsGrid}>
          {AVATAR_MOODS.map((mood) => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.gridOption,
                selectedMood === mood && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={styles.optionIcon}>{getMoodIcon(mood)}</Text>
              <Text
                style={[
                  styles.optionLabel,
                  selectedMood === mood && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                {mood}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Accessories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Accessories</Text>
        <Text style={styles.sectionDescription}>
          Add up to 3 accessories (unlock more as you progress!)
        </Text>
        <View style={styles.accessoriesGrid}>
          {AVATAR_ACCESSORIES.map((accessory) => {
            const isSelected = selectedAccessories.includes(accessory);
            const isDisabled = !isSelected && selectedAccessories.length >= 3;

            return (
              <TouchableOpacity
                key={accessory}
                style={[
                  styles.accessoryChip,
                  isSelected && {
                    backgroundColor: colors.primary,
                  },
                  isDisabled && styles.accessoryDisabled,
                ]}
                onPress={() => toggleAccessory(accessory)}
                disabled={isDisabled}
              >
                <Text
                  style={[
                    styles.accessoryText,
                    isSelected && styles.accessoryTextSelected,
                    isDisabled && styles.accessoryTextDisabled,
                  ]}
                >
                  {accessory}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Avatar</Text>
          )}
        </TouchableOpacity>

        {showSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={[styles.skipButtonText, { color: colors.primary }]}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info Box */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Your avatar will evolve as you progress! Unlock new styles and accessories by completing
          goals and maintaining streaks.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  accessoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  accessoryBadge: {
    alignItems: 'center',
    backgroundColor: '#EF4444',
    borderColor: '#fff',
    borderRadius: 14,
    borderWidth: 3,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    width: 28,
  },
  accessoryBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  accessoryChip: {
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 20,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  accessoryDisabled: {
    opacity: 0.4,
  },
  accessoryText: {
    color: '#333',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  accessoryTextDisabled: {
    color: '#999',
  },
  accessoryTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  avatarCircle: {
    alignItems: 'center',
    borderRadius: 60,
    height: 120,
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    width: 120,
  },
  avatarEmoji: {
    fontSize: 56,
  },
  checkmark: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    alignItems: 'center',
    borderColor: '#fff',
    borderRadius: 28,
    borderWidth: 3,
    elevation: 2,
    height: 56,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: 56,
  },
  colorSelected: {
    borderColor: '#1a1a1a',
    borderWidth: 4,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  gridOption: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 20,
    width: (width - 52) / 2,
  },
  header: {
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    padding: 16,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    color: '#1e40af',
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#666',
    fontSize: 16,
    marginTop: 12,
  },
  optionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  optionLabel: {
    color: '#333',
    fontSize: 14,
    textTransform: 'capitalize',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  previewContainer: {
    alignItems: 'center',
    borderRadius: 20,
    marginBottom: 32,
    padding: 32,
  },
  previewLabel: {
    color: '#666',
    fontSize: 16,
    textTransform: 'capitalize',
  },
  saveButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
  },
  title: {
    color: '#1a1a1a',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

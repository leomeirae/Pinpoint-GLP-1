import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { usePersonality } from '@/hooks/usePersonality';
import {
  CommunicationStyle,
  MotivationType,
  NotificationTone,
  NotificationFrequency,
  COMMUNICATION_STYLES,
  MOTIVATION_TYPES,
  NOTIFICATION_TONES,
} from '@/lib/types/communication';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('PersonalitySelector');

interface PersonalitySelectorProps {
  onComplete?: () => void;
  showSkip?: boolean;
}

export const PersonalitySelector: React.FC<PersonalitySelectorProps> = ({
  onComplete,
  showSkip = false,
}) => {
  const { personality, updatePersonality, loading: personalityLoading } = usePersonality();
  const colors = useShotsyColors();

  const [selectedStyle, setSelectedStyle] = useState<CommunicationStyle>('friend');
  const [humorLevel, setHumorLevel] = useState(3);
  const [motivationType, setMotivationType] = useState<MotivationType>('balanced');
  const [useEmojis, setUseEmojis] = useState(true);
  const [formalityLevel, setFormalityLevel] = useState(3);
  const [notificationTone, setNotificationTone] = useState<NotificationTone>('encouraging');
  const [saving, setSaving] = useState(false);

  // Load personality data when available
  useEffect(() => {
    if (personality) {
      setSelectedStyle(personality.style);
      setHumorLevel(personality.humor_level);
      setMotivationType(personality.motivation_type);
      setUseEmojis(personality.use_emojis);
      setFormalityLevel(personality.formality_level);
      setNotificationTone(personality.notification_tone);
    }
  }, [personality]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await updatePersonality({
        style: selectedStyle,
        humor_level: humorLevel,
        motivation_type: motivationType,
        use_emojis: useEmojis,
        formality_level: formalityLevel,
        notification_tone: notificationTone,
      });
      onComplete?.();
    } catch (error) {
      logger.error('Error saving personality:', error as Error);
    } finally {
      setSaving(false);
    }
  };

  const getPreviewMessage = (): string => {
    const messages: Record<CommunicationStyle, Record<MotivationType, string>> = {
      coach: {
        'data-driven': 'Your consistency score improved by 15% this week. Keep pushing!',
        emotional: "Amazing dedication this week! You're crushing your goals!",
        balanced: "Great progress! You're 15% more consistent this week.",
      },
      friend: {
        'data-driven': 'Hey! Your stats look awesome - 15% better this week!',
        emotional: "You're doing incredible! So proud of you!",
        balanced: "Nice work! You've been way more consistent lately!",
      },
      scientist: {
        'data-driven': 'Analysis shows 15% consistency improvement over 7-day period.',
        emotional: 'Positive trend detected in your commitment levels.',
        balanced: 'Your consistency increased 15% this week - notable progress.',
      },
      minimalist: {
        'data-driven': 'Consistency: +15%',
        emotional: 'Well done.',
        balanced: 'Good progress this week.',
      },
    };

    let message = messages[selectedStyle][motivationType];

    if (useEmojis && selectedStyle !== 'minimalist') {
      if (selectedStyle === 'friend') {
        message += ' 🎉';
      } else if (selectedStyle === 'coach') {
        message += ' 💪';
      }
    }

    return message;
  };

  if (personalityLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading preferences...</Text>
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
        <Text style={styles.title}>Communication Style</Text>
        <Text style={styles.subtitle}>Customize how Pinpoint talks to you</Text>
      </View>

      {/* Preview Box */}
      <View style={[styles.previewBox, { borderColor: colors.primary }]}>
        <Text style={styles.previewLabel}>Preview</Text>
        <Text style={styles.previewMessage}>{getPreviewMessage()}</Text>
      </View>

      {/* Communication Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Preferred Style</Text>
        <Text style={styles.sectionDescription}>How should we communicate with you?</Text>
        <View style={styles.styleGrid}>
          {Object.entries(COMMUNICATION_STYLES).map(([key, value]) => {
            const style = key as CommunicationStyle;
            return (
              <TouchableOpacity
                key={style}
                style={[
                  styles.styleCard,
                  selectedStyle === style && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedStyle(style)}
              >
                <Text
                  style={[
                    styles.styleTitle,
                    selectedStyle === style && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {value.label}
                </Text>
                <Text style={styles.styleDescription}>{value.description}</Text>
                <View style={styles.exampleBox}>
                  <Text style={styles.exampleLabel}>Example:</Text>
                  <Text style={styles.exampleText}>"{value.example}"</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Motivation Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Motivation Approach</Text>
        <Text style={styles.sectionDescription}>What motivates you most?</Text>
        <View style={styles.motivationGrid}>
          {Object.entries(MOTIVATION_TYPES).map(([key, value]) => {
            const type = key as MotivationType;
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.motivationOption,
                  motivationType === type && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setMotivationType(type)}
              >
                <Text
                  style={[
                    styles.motivationLabel,
                    motivationType === type && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {value.label}
                </Text>
                <Text style={styles.motivationDescription}>{value.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Humor Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Humor Level</Text>
        <Text style={styles.sectionDescription}>How much humor do you want in messages?</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>None</Text>
            <Text style={[styles.sliderValue, { color: colors.primary }]}>{humorLevel}/5</Text>
            <Text style={styles.sliderLabel}>Maximum</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={humorLevel}
            onValueChange={setHumorLevel}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor={colors.primary}
          />
        </View>
      </View>

      {/* Formality Level */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Formality Level</Text>
        <Text style={styles.sectionDescription}>How casual or formal should we be?</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Casual</Text>
            <Text style={[styles.sliderValue, { color: colors.primary }]}>{formalityLevel}/5</Text>
            <Text style={styles.sliderLabel}>Formal</Text>
          </View>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={5}
            step={1}
            value={formalityLevel}
            onValueChange={setFormalityLevel}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor="#e0e0e0"
            thumbTintColor={colors.primary}
          />
        </View>
      </View>

      {/* Notification Tone */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Tone</Text>
        <Text style={styles.sectionDescription}>How should notifications feel?</Text>
        <View style={styles.toneGrid}>
          {Object.entries(NOTIFICATION_TONES).map(([key, value]) => {
            const tone = key as NotificationTone;
            const icons: Record<NotificationTone, string> = {
              encouraging: '💪',
              neutral: '📊',
              direct: '🎯',
              playful: '🎉',
            };

            return (
              <TouchableOpacity
                key={tone}
                style={[
                  styles.toneOption,
                  notificationTone === tone && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setNotificationTone(tone)}
              >
                <Text style={styles.toneIcon}>{icons[tone]}</Text>
                <Text
                  style={[
                    styles.toneLabel,
                    notificationTone === tone && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {value.label}
                </Text>
                <Text style={styles.toneDescription}>{value.description}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Emoji Toggle */}
      <View style={styles.section}>
        <View style={styles.switchRow}>
          <View style={styles.switchLabel}>
            <Text style={styles.switchTitle}>Use Emojis</Text>
            <Text style={styles.switchDescription}>
              Add emojis to make messages more expressive
            </Text>
          </View>
          <Switch
            value={useEmojis}
            onValueChange={setUseEmojis}
            trackColor={{ false: '#e0e0e0', true: colors.primary + '80' }}
            thumbColor={useEmojis ? colors.primary : '#f4f3f4'}
          />
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
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          )}
        </TouchableOpacity>

        {showSkip && (
          <TouchableOpacity style={styles.skipButton} onPress={onComplete}>
            <Text style={[styles.skipButtonText, { color: colors.primary }]}>Skip for now</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          These preferences affect how Shotsy communicates throughout the app, including insights,
          notifications, and celebrations. You can change them anytime in settings.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  actions: {
    gap: 12,
    marginTop: 8,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  exampleBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
  },
  exampleLabel: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  exampleText: {
    color: '#333',
    fontSize: 14,
    fontStyle: 'italic',
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
  motivationDescription: {
    color: '#666',
    fontSize: 14,
  },
  motivationGrid: {
    gap: 12,
  },
  motivationLabel: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  motivationOption: {
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
  },
  previewBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 32,
    padding: 20,
  },
  previewLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  previewMessage: {
    color: '#1a1a1a',
    fontSize: 16,
    lineHeight: 22,
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
  slider: {
    height: 40,
    width: '100%',
  },
  sliderContainer: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
  },
  sliderLabel: {
    color: '#666',
    fontSize: 13,
  },
  sliderLabels: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  styleCard: {
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
  },
  styleDescription: {
    color: '#666',
    fontSize: 14,
    marginBottom: 12,
  },
  styleGrid: {
    gap: 12,
  },
  styleTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitle: {
    color: '#666',
    fontSize: 16,
    lineHeight: 22,
  },
  switchDescription: {
    color: '#666',
    fontSize: 14,
  },
  switchLabel: {
    flex: 1,
    marginRight: 16,
  },
  switchRow: {
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  switchTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  title: {
    color: '#1a1a1a',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  toneDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  toneIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  toneLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  toneOption: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    padding: 16,
    width: '48%',
  },
});

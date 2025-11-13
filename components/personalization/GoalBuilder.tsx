import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useGoals } from '@/hooks/useGoals';
import { GoalType, CelebrationStyle, GOAL_TEMPLATES, createMilestones } from '@/lib/types/goals';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('GoalBuilder');

interface GoalBuilderProps {
  onComplete?: () => void;
  showSkip?: boolean;
}

export const GoalBuilder: React.FC<GoalBuilderProps> = ({ onComplete, showSkip = false }) => {
  const { createGoal } = useGoals();
  const colors = useShotsyColors();

  const [selectedType, setSelectedType] = useState<GoalType>('weight_loss');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [targetUnit, setTargetUnit] = useState('kg');
  const [celebrationStyle, setCelebrationStyle] = useState<CelebrationStyle>('energetic');
  const [saving, setSaving] = useState(false);

  // Load template when type changes
  React.useEffect(() => {
    const template = GOAL_TEMPLATES[selectedType];
    if (template.title) {
      setTitle(template.title);
    }
    if (template.target_unit) {
      setTargetUnit(template.target_unit);
    }
    if (template.celebration_style) {
      setCelebrationStyle(template.celebration_style);
    }
    if (template.target_value) {
      setTargetValue(template.target_value.toString());
    }
  }, [selectedType]);

  const handleCreate = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Missing Title', 'Please enter a goal title');
      return;
    }

    if (!targetValue || isNaN(Number(targetValue)) || Number(targetValue) <= 0) {
      Alert.alert('Invalid Target', 'Please enter a valid target value');
      return;
    }

    try {
      setSaving(true);

      const value = Number(targetValue);
      const milestones = createMilestones(value, targetUnit, 4);

      await createGoal({
        type: selectedType,
        title: title.trim(),
        description: description.trim() || undefined,
        target_value: value,
        target_unit: targetUnit,
        milestones,
        celebration_style: celebrationStyle,
        reminder_enabled: true,
      });

      Alert.alert(
        'Goal Created! 🎯',
        `Your "${title}" goal has been created. Let's achieve it together!`,
        [{ text: 'Great!', onPress: onComplete }]
      );
    } catch (error) {
      logger.error('Error creating goal:', error as Error);
      Alert.alert('Error', 'Failed to create goal. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: GoalType): string => {
    const icons: Record<GoalType, string> = {
      weight_loss: '⚖️',
      energy_boost: '⚡',
      consistency: '🎯',
      custom: '✨',
    };
    return icons[type];
  };

  const getTypeDescription = (type: GoalType): string => {
    const descriptions: Record<GoalType, string> = {
      weight_loss: 'Track your weight loss journey',
      energy_boost: 'Increase your daily energy levels',
      consistency: 'Stay consistent with your shots',
      custom: 'Create your own custom goal',
    };
    return descriptions[type];
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Goal</Text>
        <Text style={styles.subtitle}>Define what success looks like for you</Text>
      </View>

      {/* Goal Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What do you want to achieve?</Text>
        <View style={styles.typeGrid}>
          {(['weight_loss', 'energy_boost', 'consistency', 'custom'] as GoalType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeCard,
                selectedType === type && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={styles.typeIcon}>{getTypeIcon(type)}</Text>
              <Text
                style={[
                  styles.typeTitle,
                  selectedType === type && { color: colors.primary, fontWeight: '600' },
                ]}
              >
                {type.replace('_', ' ')}
              </Text>
              <Text style={styles.typeDescription}>{getTypeDescription(type)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Goal Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goal Details</Text>

        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g., Lose 10kg by summer"
            placeholderTextColor="#999"
          />
        </View>

        {/* Description (Optional) */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            Description <Text style={styles.optional}>(optional)</Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details about your goal..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Target Value */}
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Target</Text>
          <View style={styles.targetRow}>
            <TextInput
              style={[styles.input, styles.targetInput]}
              value={targetValue}
              onChangeText={setTargetValue}
              placeholder="0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
            <TextInput
              style={[styles.input, styles.unitInput]}
              value={targetUnit}
              onChangeText={setTargetUnit}
              placeholder="unit"
              placeholderTextColor="#999"
            />
          </View>
          <Text style={styles.inputHint}>Example: 10 kg, 30 days, 5 levels</Text>
        </View>
      </View>

      {/* Celebration Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How should we celebrate?</Text>
        <Text style={styles.sectionDescription}>
          Choose how you want to be celebrated when you hit milestones
        </Text>
        <View style={styles.celebrationGrid}>
          {(['subtle', 'energetic', 'zen'] as CelebrationStyle[]).map((style) => {
            const icons = { subtle: '✨', energetic: '🎉', zen: '🧘' };
            const descriptions = {
              subtle: 'Quiet acknowledgment',
              energetic: 'Big celebrations!',
              zen: 'Peaceful recognition',
            };

            return (
              <TouchableOpacity
                key={style}
                style={[
                  styles.celebrationOption,
                  celebrationStyle === style && {
                    backgroundColor: colors.primary + '20',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setCelebrationStyle(style)}
              >
                <Text style={styles.celebrationIcon}>{icons[style]}</Text>
                <Text
                  style={[
                    styles.celebrationLabel,
                    celebrationStyle === style && { color: colors.primary, fontWeight: '600' },
                  ]}
                >
                  {style}
                </Text>
                <Text style={styles.celebrationDescription}>{descriptions[style]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Milestone Preview */}
      {targetValue && !isNaN(Number(targetValue)) && Number(targetValue) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <Text style={styles.sectionDescription}>You'll celebrate at these points:</Text>
          <View style={styles.milestonesPreview}>
            {createMilestones(Number(targetValue), targetUnit, 4).map((milestone, index) => (
              <View key={index} style={styles.milestoneItem}>
                <View style={styles.milestoneCheckbox}>
                  <Text style={styles.milestoneNumber}>{index + 1}</Text>
                </View>
                <Text style={styles.milestoneLabel}>{milestone.label}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: colors.primary }]}
          onPress={handleCreate}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Goal</Text>
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
          You can create multiple goals and track your progress for each one. Don't worry, you can
          always edit or delete goals later!
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
  celebrationDescription: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
  },
  celebrationGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  celebrationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  celebrationLabel: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  celebrationOption: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    flex: 1,
    padding: 16,
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  createButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 16,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  input: {
    backgroundColor: '#fafafa',
    borderColor: '#e0e0e0',
    borderRadius: 10,
    borderWidth: 1,
    color: '#333',
    fontSize: 16,
    padding: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputHint: {
    color: '#999',
    fontSize: 13,
    marginTop: 6,
  },
  inputLabel: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 8,
  },
  milestoneCheckbox: {
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  milestoneItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  milestoneLabel: {
    color: '#333',
    flex: 1,
    fontSize: 15,
  },
  milestoneNumber: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  milestonesPreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    gap: 12,
    padding: 16,
  },
  optional: {
    color: '#999',
    fontSize: 13,
    fontWeight: '400',
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
  targetInput: {
    flex: 2,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  title: {
    color: '#1a1a1a',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeCard: {
    backgroundColor: '#f5f5f5',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 2,
    padding: 20,
  },
  typeDescription: {
    color: '#666',
    fontSize: 14,
  },
  typeGrid: {
    gap: 12,
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  unitInput: {
    flex: 1,
  },
});

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
import {
  GoalType,
  CelebrationStyle,
  GOAL_TEMPLATES,
  createMilestones,
} from '@/lib/types/goals';
import { useShotsyColors } from '@/hooks/useShotsyColors';

interface GoalBuilderProps {
  onComplete?: () => void;
  showSkip?: boolean;
}

export const GoalBuilder: React.FC<GoalBuilderProps> = ({
  onComplete,
  showSkip = false,
}) => {
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
      console.error('Error creating goal:', error);
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
        <Text style={styles.subtitle}>
          Define what success looks like for you
        </Text>
      </View>

      {/* Goal Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What do you want to achieve?</Text>
        <View style={styles.typeGrid}>
          {(['weight_loss', 'energy_boost', 'consistency', 'custom'] as GoalType[]).map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeCard,
                selectedType === type && {
                  backgroundColor: colors.primary + '20',
                  borderColor: colors.primary,
                  borderWidth: 2,
                }
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={styles.typeIcon}>{getTypeIcon(type)}</Text>
              <Text style={[
                styles.typeTitle,
                selectedType === type && { color: colors.primary, fontWeight: '600' }
              ]}>
                {type.replace('_', ' ')}
              </Text>
              <Text style={styles.typeDescription}>
                {getTypeDescription(type)}
              </Text>
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
          <Text style={styles.inputHint}>
            Example: 10 kg, 30 days, 5 levels
          </Text>
        </View>
      </View>

      {/* Celebration Style */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How should we celebrate?</Text>
        <Text style={styles.sectionDescription}>
          Choose how you want to be celebrated when you hit milestones
        </Text>
        <View style={styles.celebrationGrid}>
          {(['subtle', 'energetic', 'zen'] as CelebrationStyle[]).map(style => {
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
                  }
                ]}
                onPress={() => setCelebrationStyle(style)}
              >
                <Text style={styles.celebrationIcon}>{icons[style]}</Text>
                <Text style={[
                  styles.celebrationLabel,
                  celebrationStyle === style && { color: colors.primary, fontWeight: '600' }
                ]}>
                  {style}
                </Text>
                <Text style={styles.celebrationDescription}>
                  {descriptions[style]}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Milestone Preview */}
      {targetValue && !isNaN(Number(targetValue)) && Number(targetValue) > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Milestones</Text>
          <Text style={styles.sectionDescription}>
            You'll celebrate at these points:
          </Text>
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
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onComplete}
          >
            <Text style={[styles.skipButtonText, { color: colors.primary }]}>
              Skip for now
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Info */}
      <View style={styles.infoBox}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          You can create multiple goals and track your progress for each one. Don't worry, you can always edit or delete goals later!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  typeGrid: {
    gap: 12,
  },
  typeCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 90,
    paddingTop: 14,
  },
  targetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  targetInput: {
    flex: 2,
  },
  unitInput: {
    flex: 1,
  },
  inputHint: {
    fontSize: 13,
    color: '#999',
    marginTop: 6,
  },
  celebrationGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  celebrationOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  celebrationIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  celebrationLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  celebrationDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  milestonesPreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  milestoneCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  milestoneNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  milestoneLabel: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
  createButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f0f9ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    gap: 12,
  },
  infoIcon: {
    fontSize: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
    lineHeight: 20,
  },
});

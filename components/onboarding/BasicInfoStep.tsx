import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { supabase } from '@/lib/supabase';
import { useColors } from '@/hooks/useShotsyColors';
import { createLogger } from '@/lib/logger';

const logger = createLogger('BasicInfoStep');

interface BasicInfoStepProps {
  onComplete: () => void;
}

export const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onComplete }) => {
  const colors = useColors();
  const { user } = useUser();

  const [name, setName] = useState(user?.fullName || user?.firstName || '');
  const [currentWeight, setCurrentWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name');
      return;
    }

    if (!currentWeight || !goalWeight) {
      Alert.alert('Missing Information', 'Please enter your current and goal weight');
      return;
    }

    const current = parseFloat(currentWeight);
    const goal = parseFloat(goalWeight);

    if (isNaN(current) || isNaN(goal) || current <= 0 || goal <= 0) {
      Alert.alert('Invalid Values', 'Please enter valid weight values');
      return;
    }

    try {
      setLoading(true);

      // Create or update profile in Supabase
      const { error: profileError } = await supabase.from('profiles').upsert({
        id: user?.id,
        name: name.trim(),
        email: user?.primaryEmailAddress?.emailAddress || '',
        start_weight: current,
        target_weight: goal,
      });

      if (profileError) throw profileError;

      // Create initial weight log
      const { error: weightError } = await supabase.from('weights').insert({
        user_id: user?.id,
        date: new Date().toISOString(),
        weight: current,
        notes: 'Initial weight',
      });

      if (weightError) {
        // Don't fail if weight already exists
        logger.warn('Weight log error', { weightError });
      }

      // Create default settings
      const { error: settingsError } = await supabase.from('settings').upsert({
        user_id: user?.id,
      });

      if (settingsError) {
        logger.warn('Settings error', { settingsError });
      }

      onComplete();
    } catch (error: any) {
      logger.error('Error saving basic info:', error as Error);
      Alert.alert('Error', 'Failed to save your information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const weightDifference =
    currentWeight && goalWeight ? Math.abs(parseFloat(currentWeight) - parseFloat(goalWeight)) : 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Message */}
        <View style={styles.welcomeBox}>
          <Text style={styles.emoji}>👋</Text>
          <Text style={styles.welcomeText}>Let's personalize Pinpoint for you!</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>What should we call you?</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#999"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>

          {/* Current Weight */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={currentWeight}
              onChangeText={setCurrentWeight}
              placeholder="e.g., 85.5"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Goal Weight */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Goal Weight (kg)</Text>
            <TextInput
              style={styles.input}
              value={goalWeight}
              onChangeText={setGoalWeight}
              placeholder="e.g., 75.0"
              placeholderTextColor="#999"
              keyboardType="decimal-pad"
            />
          </View>

          {/* Preview */}
          {weightDifference > 0 && (
            <View style={[styles.previewCard, { backgroundColor: colors.primary + '10' }]}>
              <Text style={styles.previewLabel}>Your Journey</Text>
              <Text style={styles.previewNumbers}>
                <Text style={styles.currentWeight}>{currentWeight} kg</Text>
                <Text style={styles.arrow}> → </Text>
                <Text style={[styles.goalWeight, { color: colors.primary }]}>{goalWeight} kg</Text>
              </Text>
              <Text style={styles.difference}>Goal: {weightDifference.toFixed(1)} kg to go!</Text>
            </View>
          )}
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            This helps us personalize your experience and track your progress. You can always update
            these later!
          </Text>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  arrow: {
    color: '#999',
  },
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  continueButton: {
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: 16,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  currentWeight: {
    color: '#666',
  },
  difference: {
    color: '#666',
    fontSize: 15,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  form: {
    gap: 20,
    marginBottom: 24,
  },
  goalWeight: {
    fontWeight: 'bold',
  },
  infoBox: {
    backgroundColor: '#f0f9ff',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    borderRadius: 12,
    borderWidth: 1,
    color: '#333',
    fontSize: 16,
    padding: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
  previewCard: {
    padding: 20,
    borderRadius: 12, // Mudança: 16 → 12px (design system)
    alignItems: 'center',
    marginTop: 8,
  },
  previewLabel: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  previewNumbers: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  welcomeBox: {
    alignItems: 'center',
    marginBottom: 32,
    paddingVertical: 20,
  },
  welcomeText: {
    color: '#333',
    fontSize: 18,
    lineHeight: 24,
    textAlign: 'center',
  },
});

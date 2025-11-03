import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AvatarCustomizer, GoalBuilder, PersonalitySelector } from '@/components/personalization';
import { BasicInfoStep } from '@/components/onboarding/BasicInfoStep';
import { useShotsyColors } from '@/hooks/useShotsyColors';

type OnboardingStep = 'basic' | 'avatar' | 'goal' | 'personality';

export default function OnboardingFlowScreen() {
  const colors = useShotsyColors();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basic');
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());

  const steps: OnboardingStep[] = ['basic', 'avatar', 'goal', 'personality'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const handleStepComplete = (step: OnboardingStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    const nextIndex = steps.indexOf(step) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      router.replace('/(tabs)');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return <BasicInfoStep onComplete={() => handleStepComplete('basic')} />;
      case 'avatar':
        return <AvatarCustomizer onComplete={() => handleStepComplete('avatar')} showSkip={true} />;
      case 'goal':
        return <GoalBuilder onComplete={() => handleStepComplete('goal')} showSkip={true} />;
      case 'personality':
        return <PersonalitySelector onComplete={() => handleStepComplete('personality')} showSkip={true} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progressPercentage}%`, backgroundColor: colors.primary }]} />
        </View>
        <Text style={styles.progressText}>Step {currentStepIndex + 1} of {steps.length}</Text>
      </View>
      {renderStep()}
      {currentStep !== 'basic' && (
        <TouchableOpacity style={styles.skipAll} onPress={() => router.replace('/(tabs)')}>
          <Text style={[styles.skipText, { color: colors.primary }]}>Skip all →</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  progressContainer: { padding: 20, paddingTop: 12 },
  progressBar: { height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  progressText: { fontSize: 12, color: '#666', textAlign: 'center' },
  skipAll: { padding: 16, alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  skipText: { fontSize: 15, fontWeight: '500' },
});

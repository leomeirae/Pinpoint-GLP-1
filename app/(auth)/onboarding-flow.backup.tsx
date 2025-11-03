import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useShotsyColors } from '@/hooks/useShotsyColors';
import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';

// Import all screens
import { WelcomeScreen } from '@/components/onboarding/WelcomeScreen';
import { WidgetsIntroScreen } from '@/components/onboarding/WidgetsIntroScreen';
import { ChartsIntroScreen } from '@/components/onboarding/ChartsIntroScreen';
import { CustomizationIntroScreen } from '@/components/onboarding/CustomizationIntroScreen';
import { AlreadyUsingGLP1Screen } from '@/components/onboarding/AlreadyUsingGLP1Screen';
import { MedicationSelectionScreen } from '@/components/onboarding/MedicationSelectionScreen';
import { InitialDoseScreen } from '@/components/onboarding/InitialDoseScreen';
import { DeviceTypeScreen } from '@/components/onboarding/DeviceTypeScreen';
import { InjectionFrequencyScreen } from '@/components/onboarding/InjectionFrequencyScreen';
import { EducationGraphScreen } from '@/components/onboarding/EducationGraphScreen';
import { HealthDisclaimerScreen } from '@/components/onboarding/HealthDisclaimerScreen';
import { HeightInputScreen } from '@/components/onboarding/HeightInputScreen';
import { CurrentWeightScreen } from '@/components/onboarding/CurrentWeightScreen';
import { StartingWeightScreen } from '@/components/onboarding/StartingWeightScreen';
import { TargetWeightScreen } from '@/components/onboarding/TargetWeightScreen';
import { MotivationalMessageScreen } from '@/components/onboarding/MotivationalMessageScreen';
import { WeightLossRateScreen } from '@/components/onboarding/WeightLossRateScreen';
import { DailyRoutineScreen } from '@/components/onboarding/DailyRoutineScreen';
import { FluctuationsEducationScreen } from '@/components/onboarding/FluctuationsEducationScreen';
import { FoodNoiseScreen } from '@/components/onboarding/FoodNoiseScreen';
import { SideEffectsConcernsScreen } from '@/components/onboarding/SideEffectsConcernsScreen';
import { MotivationScreen } from '@/components/onboarding/MotivationScreen';
import { AppRatingScreen } from '@/components/onboarding/AppRatingScreen';

interface OnboardingData {
  // Screen 5
  alreadyUsing?: boolean;
  // Screen 6
  medication?: string;
  // Screen 7
  initialDose?: string;
  // Screen 8
  deviceType?: string;
  // Screen 9
  frequency?: number;
  // Screen 12
  height?: number;
  heightUnit?: 'cm' | 'ft';
  // Screen 13
  currentWeight?: number;
  weightUnit?: 'kg' | 'lb';
  // Screen 14
  startingWeight?: number;
  startDate?: string;
  // Screen 15
  targetWeight?: number;
  // Screen 17
  weightLossRate?: number;
  // Screen 18
  activityLevel?: string;
  // Screen 20
  foodNoiseDay?: string;
  // Screen 21
  sideEffectsConcerns?: string[];
  // Screen 22
  motivation?: string;
}

export default function OnboardingFlowScreen() {
  const colors = useShotsyColors();
  const router = useRouter();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const totalScreens = 23;

  const handleNext = (data?: Partial<OnboardingData>) => {
    if (data) {
      setOnboardingData((prev) => ({ ...prev, ...data }));
    }

    if (currentScreen === totalScreens - 1) {
      // Onboarding completo - salvar dados e navegar para o app
      completeOnboarding();
    } else {
      setCurrentScreen((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentScreen > 0) {
      setCurrentScreen((prev) => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    // Aqui você pode salvar os dados do onboarding no Supabase
    console.log('Onboarding data:', onboardingData);

    // Salvar no AsyncStorage que o onboarding foi concluído
    // await AsyncStorage.setItem('@shotsy:onboarding_completed', 'true');

    // Navegar para o dashboard
    router.replace('/(tabs)');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return <WelcomeScreen onNext={() => handleNext()} />;
      case 1:
        return <WidgetsIntroScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 2:
        return <ChartsIntroScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 3:
        return <CustomizationIntroScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 4:
        return <AlreadyUsingGLP1Screen onNext={handleNext} onBack={handleBack} />;
      case 5:
        return <MedicationSelectionScreen onNext={handleNext} onBack={handleBack} />;
      case 6:
        return (
          <InitialDoseScreen
            onNext={handleNext}
            onBack={handleBack}
            medication={onboardingData.medication}
          />
        );
      case 7:
        return <DeviceTypeScreen onNext={handleNext} onBack={handleBack} />;
      case 8:
        return <InjectionFrequencyScreen onNext={handleNext} onBack={handleBack} />;
      case 9:
        return <EducationGraphScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 10:
        return <HealthDisclaimerScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 11:
        return <HeightInputScreen onNext={handleNext} onBack={handleBack} />;
      case 12:
        return <CurrentWeightScreen onNext={handleNext} onBack={handleBack} />;
      case 13:
        return (
          <StartingWeightScreen
            onNext={handleNext}
            onBack={handleBack}
            weightUnit={onboardingData.weightUnit}
          />
        );
      case 14:
        return (
          <TargetWeightScreen
            onNext={handleNext}
            onBack={handleBack}
            weightUnit={onboardingData.weightUnit}
            currentWeight={onboardingData.currentWeight}
            startingWeight={onboardingData.startingWeight}
            height={onboardingData.height}
          />
        );
      case 15:
        const weightToLose = onboardingData.currentWeight && onboardingData.targetWeight
          ? onboardingData.currentWeight - onboardingData.targetWeight
          : 10;
        return (
          <MotivationalMessageScreen
            onNext={() => handleNext()}
            onBack={handleBack}
            weightToLose={weightToLose}
            weightUnit={onboardingData.weightUnit}
          />
        );
      case 16:
        return (
          <WeightLossRateScreen
            onNext={handleNext}
            onBack={handleBack}
            weightUnit={onboardingData.weightUnit}
          />
        );
      case 17:
        return <DailyRoutineScreen onNext={handleNext} onBack={handleBack} />;
      case 18:
        return <FluctuationsEducationScreen onNext={() => handleNext()} onBack={handleBack} />;
      case 19:
        return <FoodNoiseScreen onNext={handleNext} onBack={handleBack} />;
      case 20:
        return <SideEffectsConcernsScreen onNext={handleNext} onBack={handleBack} />;
      case 21:
        return <MotivationScreen onNext={handleNext} onBack={handleBack} />;
      case 22:
        return <AppRatingScreen onNext={() => handleNext()} onBack={handleBack} />;
      default:
        return <WelcomeScreen onNext={() => handleNext()} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {currentScreen > 0 && (
        <OnboardingProgressBar current={currentScreen} total={totalScreens} />
      )}
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

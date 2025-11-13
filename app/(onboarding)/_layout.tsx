import { Stack } from 'expo-router';
import { OnboardingProvider } from '@/hooks/OnboardingContext';

export default function OnboardingLayout() {
  return (
    <OnboardingProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false, // Prevent back gestures during onboarding
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="welcome" />
        <Stack.Screen name="compliance" />
        <Stack.Screen name="medication-dose" />
        <Stack.Screen name="schedule" />
        <Stack.Screen name="permissions" />
        <Stack.Screen name="feature-hook" />
      </Stack>
    </OnboardingProvider>
  );
}

import { ClerkProvider } from '@clerk/clerk-expo';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/lib/theme-context';
import { useColors } from '@/constants/colors';
import { tokenCache, validateClerkKey } from '@/lib/clerk';

function RootStack() {
  const colors = useColors();
  const { effectiveMode } = useTheme();

  return (
    <>
      <StatusBar style={effectiveMode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'fade',
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(auth)" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const publishableKey = validateClerkKey();

  return (
    <ClerkProvider 
      publishableKey={publishableKey} 
      tokenCache={tokenCache}
    >
      <ThemeProvider>
        <RootStack />
      </ThemeProvider>
    </ClerkProvider>
  );
}

import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '@/lib/clerk';
import { useRouter } from 'expo-router';
import { useColors } from '@/constants/colors';

export default function IndexScreen() {
  const colors = useColors();
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    // Aguardar um pouco antes de redirecionar para garantir que o estado de auth está estável
    const timer = setTimeout(() => {
      if (isSignedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [isSignedIn, isLoaded]);

  const styles = getStyles(colors);

  // Sempre mostrar loading enquanto decide para onde ir
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

const getStyles = (colors: any) => StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
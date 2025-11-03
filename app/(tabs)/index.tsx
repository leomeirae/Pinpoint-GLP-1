import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function TabsIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a primeira tab (dashboard)
    router.replace('/(tabs)/dashboard');
  }, []);

  return null;
}
